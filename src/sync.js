/* =====================================================================
   Roost sync — sends EOS's upcoming fixtures to Supabase so The Roost's
   calendar can show the games Dom's Going to / Wants to go to.

   Ground rules:
   * Additive only. EOS never reads anything back; localStorage stays the
     master copy and the app works exactly the same signed out or offline.
   * Silent. A failed push is remembered for the status line in Settings and
     retried on the next change / app open — it never interrupts anything.
   * Nothing here touches the "cfc:matchday:v2" key or the photo database.
     The sign-in session lives under its own key ("eos-auth").
   ===================================================================== */
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.EOS_SUPABASE_URL || "";
const KEY = process.env.EOS_SUPABASE_ANON_KEY || "";
export const syncConfigured = Boolean(SB_URL && KEY);

let client = null;
function sb() {
  if (!syncConfigured) return null;
  if (!client) {
    client = createClient(SB_URL, KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: "eos-auth" },
    });
  }
  return client;
}

/* ---- tiny status store the Settings panel subscribes to ---- */
const STATUS_KEY = "eos-sync-status";
let status = (() => { try { return JSON.parse(localStorage.getItem(STATUS_KEY)) || {}; } catch (e) { return {}; } })();
const listeners = new Set();
function setStatus(patch) {
  status = { ...status, ...patch };
  try { localStorage.setItem(STATUS_KEY, JSON.stringify({ lastOk: status.lastOk, count: status.count })); } catch (e) {}
  listeners.forEach((fn) => { try { fn(status); } catch (e) {} });
}
export function getSyncStatus() { return status; }
export function onSyncStatus(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/* ---- auth ---- */
export async function currentUser() {
  const c = sb(); if (!c) return null;
  try {
    const { data } = await c.auth.getSession();
    const s = data && data.session;
    if (!s) return null;
    const { data: aal } = await c.auth.mfa.getAuthenticatorAssuranceLevel();
    return { email: s.user.email, needsCode: !!aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2" };
  } catch (e) { return null; }
}

/** Step 1: email + password. Returns { needsCode } — Dom's account has an authenticator code. */
export async function signIn(email, password) {
  const c = sb(); if (!c) throw new Error("Sync isn't set up on this site yet.");
  const { error } = await c.auth.signInWithPassword({ email: String(email).trim(), password });
  if (error) throw new Error(/invalid login/i.test(error.message) ? "Email or password isn't right." : error.message);
  const u = await currentUser();
  return { needsCode: !!(u && u.needsCode) };
}

/** Step 2: the 6-digit code from the authenticator (same one The Roost uses). */
export async function verifyCode(code) {
  const c = sb(); if (!c) throw new Error("Sync isn't set up on this site yet.");
  const { data, error } = await c.auth.mfa.listFactors();
  if (error) throw new Error(error.message);
  const factor = data && data.totp && data.totp[0];
  if (!factor) throw new Error("No authenticator is set up on this account. Set it up in The Roost first.");
  const res = await c.auth.mfa.challengeAndVerify({ factorId: factor.id, code: String(code).replace(/\s/g, "") });
  if (res.error) throw new Error("That code didn't work. Codes refresh every 30 seconds — try the latest one.");
}

export async function signOut() {
  const c = sb(); if (!c) return;
  try { await c.auth.signOut(); } catch (e) {}
  setStatus({ error: null });
}

/* ---- push ---- */
// Upcoming games plus the last few days (so the "After the whistle" nudge knows about the
// game you've just been to), and undated games with no result yet. For nudges the server
// only gets two yes/no facts: is there a prediction, and has After the whistle been written.
function upcoming(fixtures) {
  const from = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
  return (fixtures || [])
    .filter((f) => f && f.id && (f.date ? f.date >= from : !f.result))
    .map((f) => {
      const j = f.journal || {};
      return {
        id: f.id, season: f.season || "", date: f.date || null, kickoff: f.kickoff || "",
        opposition: f.opposition || "", venue: f.venue || "", competition: f.competition || "",
        attending: f.attending || "none", dateConfirmed: !!f.dateConfirmed,
        hasPrediction: !!String(f.prediction || "").trim(),
        postDone: !!(String(j.matchFacts || "").trim() || String(j.postNote || "").trim()),
      };
    });
}

let timer = null;
let lastSent = "";
let inFlight = false;
let pending = null;

async function pushNow(fixtures, force) {
  const c = sb(); if (!c) return;
  const rows = upcoming(fixtures);
  const body = JSON.stringify(rows);
  if (!force && body === lastSent) return;
  if (inFlight) { pending = fixtures; return; }
  inFlight = true;
  try {
    const u = await currentUser();
    if (!u || u.needsCode) { inFlight = false; return; } // not signed in here — nothing to do
    if (typeof navigator !== "undefined" && navigator.onLine === false) throw new Error("offline");
    const { data, error } = await c.rpc("eos_sync_fixtures", { p_rows: rows });
    if (error) throw error;
    lastSent = body;
    setStatus({ lastOk: new Date().toISOString(), count: typeof data === "number" ? data : rows.length, error: null });
  } catch (e) {
    setStatus({ error: (e && e.message) || "Sync failed" });
  } finally {
    inFlight = false;
    if (pending) { const p = pending; pending = null; pushNow(p); }
  }
}

/** Called whenever fixtures change. Waits for a quiet couple of seconds, then pushes. */
export function scheduleSync(fixtures) {
  if (!syncConfigured) return;
  clearTimeout(timer);
  timer = setTimeout(() => { pushNow(fixtures).catch(() => {}); }, 2000);
}
/** Push straight away (app open, back online, or the "Sync now" button). */
export function syncNow(fixtures) {
  if (!syncConfigured) return Promise.resolve();
  clearTimeout(timer);
  return pushNow(fixtures, true).catch(() => {});
}

/* =====================================================================
   Push notifications (the nudges). The phone subscribes with EOS's public key;
   the scheduled job on the server decides when to send.
   ===================================================================== */
// EOS's push public key. It's public by design (it ships inside every web app that uses
// push), so it lives here in the code rather than in a Netlify setting that can be mis-pasted.
// Its private half is the EOS_VAPID_PRIVATE_KEY secret on the live site only.
const VAPID = "BCyMfuXNSOhct52bVNvSHQFnnwhyazemhUxgo8iFszfS0dnmvNfFRIqXSwsXmxvU_H3R0Bl19lK0J0dUsMwgWv4";
export const pushConfigured = syncConfigured;

export function isInstalled() {
  try { return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch (e) { return false; }
}
function pushSupported() { return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window; }

/** 'needs-install' | 'unsupported' | 'blocked' | 'off' | 'on' */
export async function pushState() {
  if (!pushSupported()) return isInstalled() ? "unsupported" : "needs-install";
  if (Notification.permission === "denied") return "blocked";
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg && (await reg.pushManager.getSubscription());
    return sub ? "on" : "off";
  } catch (e) { return "off"; }
}

function keyBytes(b64) {
  const p = (b64 + "=".repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(p); const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/** Has to run straight from a tap (iOS rule). */
export async function enablePush() {
  const c = sb(); if (!c || !VAPID) throw new Error("Notifications aren't set up on this site yet.");
  const u = await currentUser();
  if (!u || u.needsCode) throw new Error("Sign in to The Roost sync first — the nudges use the same login.");
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Notifications weren't allowed. You can change that in the iPhone's Settings → Notifications.");
  const reg = await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) || (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(VAPID) }));
  const j = sub.toJSON();
  const { error } = await c.rpc("eos_save_push_subscription", { p_endpoint: sub.endpoint, p_p256dh: j.keys && j.keys.p256dh, p_auth: j.keys && j.keys.auth });
  if (error) throw new Error(error.message);
}

export async function disablePush() {
  const c = sb();
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg && (await reg.pushManager.getSubscription());
    if (sub) {
      if (c) { try { await c.rpc("eos_delete_push_subscription", { p_endpoint: sub.endpoint }); } catch (e) {} }
      await sub.unsubscribe();
    }
  } catch (e) {}
}

export async function getNudgePrefs() {
  const c = sb(); if (!c) return null;
  try {
    const { data, error } = await c.rpc("eos_get_notify_prefs");
    if (error || !data || !data.length) return null;
    return { prediction: !!data[0].prediction, afterWhistle: !!data[0].after_whistle };
  } catch (e) { return null; }
}
export async function setNudgePrefs({ prediction, afterWhistle }) {
  const c = sb(); if (!c) return;
  const { error } = await c.rpc("eos_set_notify_prefs", { p_prediction: !!prediction, p_after_whistle: !!afterWhistle });
  if (error) throw new Error(error.message);
}

/** A copy of an in-app moment (a milestone) in the notification centre, if allowed. */
export async function localNotify(title, body, tag) {
  try {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) await reg.showNotification(title, { body, tag, icon: "./icon-192.png", badge: "./icon-192.png", data: { url: "./?tab=wrapped" } });
  } catch (e) {}
}
