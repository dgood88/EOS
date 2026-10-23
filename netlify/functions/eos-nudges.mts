// Runs every 5 minutes on the live site. Asks the database which nudges are due
// (it marks them sent in the same step, so nothing ever goes twice) and pushes each
// one to the phones that switched notifications on.
//
//   prediction    — 2 hours before kick-off and no score call entered yet
//   after_whistle — 24 hours after a game you went to and nothing written yet
//
// Needs these Netlify environment variables (the job quietly does nothing without them,
// which is what keeps it switched off on the test site):
//   EOS_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, EOS_VAPID_PUBLIC_KEY, EOS_VAPID_PRIVATE_KEY
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

interface Due {
  user_id: string;
  fixture_id: string;
  kind: "prediction" | "after_whistle";
  opposition: string;
  venue: string | null;
  competition: string | null;
  kickoff: string | null;
  date: string;
}

function matchup(d: Due): string {
  const opp = d.opposition || "the next one";
  return d.venue === "A" ? `${opp} v Chelsea` : `Chelsea v ${opp}`;
}

// "yesterday", or "on Saturday" if it's been longer — in UK time.
function when(dateISO: string, now: Date): string {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(now);
  const diff = Math.round((Date.parse(today + "T12:00:00Z") - Date.parse(dateISO + "T12:00:00Z")) / 86400000);
  if (diff <= 1) return "yesterday";
  return "on " + new Date(dateISO + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
}

export function message(d: Due, now = new Date()) {
  if (d.kind === "prediction") {
    return {
      title: "Get your call in",
      body: `${matchup(d)} kicks off at ${d.kickoff} and there's no prediction yet.`,
      url: `./?open=${encodeURIComponent(d.fixture_id)}&focus=prediction`,
      tag: `prediction-${d.fixture_id}`,
    };
  }
  return {
    title: "After the whistle",
    body: `${d.opposition || "That game"} ${when(d.date, now)} — nothing written yet. Get it down while it's fresh.`,
    url: `./?open=${encodeURIComponent(d.fixture_id)}&md=1&focus=after`,
    tag: `after-${d.fixture_id}`,
  };
}

export default async () => {
  const url = process.env.EOS_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const vapidPublic = process.env.EOS_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.EOS_VAPID_PRIVATE_KEY;
  if (!url || !serviceKey || !vapidPublic || !vapidPrivate) {
    return new Response(JSON.stringify({ skipped: "not configured" }), { headers: { "content-type": "application/json" } });
  }
  webpush.setVapidDetails(process.env.URL || "https://only-place-every-other-saturday.netlify.app", vapidPublic, vapidPrivate);
  const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const out = { due: 0, sent: 0, pruned: 0, failed: 0 };
  const { data, error } = await db.rpc("eos_take_due_nudges");
  if (error) {
    console.error("eos_take_due_nudges", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  const due = (data ?? []) as Due[];
  out.due = due.length;

  for (const d of due) {
    const { data: subs } = await db.from("eos_push_subscriptions").select("endpoint, p256dh, auth").eq("user_id", d.user_id);
    const payload = JSON.stringify(message(d));
    for (const s of (subs ?? []) as { endpoint: string; p256dh: string; auth: string }[]) {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 60 * 60 * 2, urgency: "high" });
        out.sent++;
      } catch (e: unknown) {
        const status = (e as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await db.from("eos_push_subscriptions").delete().eq("endpoint", s.endpoint);
          out.pruned++;
        } else {
          out.failed++;
          console.error("push failed", status);
        }
      }
    }
  }

  console.log("eos-nudges", JSON.stringify(out));
  return new Response(JSON.stringify(out), { headers: { "content-type": "application/json" } });
};

export const config = { schedule: "*/5 * * * *" };
