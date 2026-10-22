import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  CalendarDays, NotebookPen, Beer, BarChart3, Trophy, Plus, X, Settings,
  Download, Upload, RotateCcw, MapPin, Search, ChevronDown, Check, Pencil, Feather,
  Filter, Star, Wine, Trash2, Tv, Clock, ArrowLeft, Sparkles, CalendarPlus, StarHalf,
  Ticket, TrendingUp, TrendingDown, Equal, Building2, Target
} from "lucide-react";
import "./floodlights.css";
import { syncConfigured, scheduleSync, syncNow, currentUser, signIn, verifyCode, signOut, getSyncStatus, onSyncStatus } from "./sync";

/* ============================== SEED DATA ============================== */
const SEED = /*SEED_START*/[{"id":"h1","season":"21-22","date":"2021-08-11","dateText":"11th August 21","dateConfirmed":true,"opposition":"Super Cup - Villareal","venue":"A","competition":"Super Cup","attending":"none","result":"W","score":"Pens"},{"id":"h2","season":"21-22","date":"2021-08-14","dateText":"14th August 21","dateConfirmed":true,"opposition":"Crystal Palace","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"3-0","lps":3.0,"myCost":55.0},{"id":"h3","season":"21-22","date":"2021-08-22","dateText":"22nd August 21","dateConfirmed":true,"opposition":"Arsenal","venue":"A","competition":"Premier League","attending":"none","result":"W","score":"2-0"},{"id":"h4","season":"21-22","date":"2021-08-28","dateText":"28th August","dateConfirmed":true,"opposition":"Liverpool","venue":"A","competition":"Premier League","attending":"none","result":"D","score":"1-1"},{"id":"h5","season":"21-22","date":"2021-09-11","dateText":"11th September","dateConfirmed":true,"opposition":"Aston Villa","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"3-0","lps":3.0,"myCost":55.0},{"id":"h6","season":"21-22","date":"2021-09-14","dateText":"14th September","dateConfirmed":true,"opposition":"Zenit","venue":"H","competition":"Europe","attending":"sourced","attendee":"Matt's mate","result":"W","score":"1-0","lps":5.0,"othersCost":30.0},{"id":"h7","season":"21-22","date":"2021-09-19","dateText":"19th September","dateConfirmed":true,"opposition":"Spurs","venue":"A","competition":"Premier League","attending":"none","result":"W","score":"3-0"},{"id":"h8","season":"21-22","date":"2021-09-22","dateText":"22nd September","dateConfirmed":true,"opposition":"Aston Villa","venue":"H","competition":"Premier League","attending":"sourced","attendee":"James/Matt","result":"W","score":"Pens","lps":5.0,"othersCost":25.0},{"id":"h9","season":"21-22","date":"2021-09-25","dateText":"25th September","dateConfirmed":true,"opposition":"Man City","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Morelands","result":"L","score":"0-1","lps":1.0,"myCost":60.0},{"id":"h10","season":"21-22","date":"2021-09-29","dateText":"29th September","dateConfirmed":true,"opposition":"Juve","venue":"A","competition":"Europe","attending":"none","result":"L","score":"0-1"},{"id":"h11","season":"21-22","date":"2021-10-02","dateText":"2nd October","dateConfirmed":true,"opposition":"Southampton","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"3-1","lps":5.0,"myCost":25.0},{"id":"h12","season":"21-22","date":"2021-10-16","dateText":"16th October","dateConfirmed":true,"opposition":"Brentford","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"1-0"},{"id":"h13","season":"21-22","date":"2021-10-20","dateText":"20th October","dateConfirmed":true,"opposition":"Malmo","venue":"H","competition":"Europe","attending":"sourced","attendee":"Hubbards","result":"W","score":"4-0","lps":5.0,"othersCost":30.0},{"id":"h14","season":"21-22","date":"2021-10-23","dateText":"23rd October","dateConfirmed":true,"opposition":"Norwich","venue":"H","competition":"Premier League","attending":"sourced","attendee":"George & pal","result":"W","score":"7-0","lps":3.0,"othersCost":55.0},{"id":"h15","season":"21-22","date":"2021-10-26","dateText":"26th October","dateConfirmed":true,"opposition":"Southampton","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"1-1 / Pens","lps":3.0,"myCost":55.0},{"id":"h16","season":"21-22","date":"2021-10-30","dateText":"30th October","dateConfirmed":true,"opposition":"Newcastle","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Champz","result":"W","score":"3-0","lps":3.0,"othersCost":30.0},{"id":"h17","season":"21-22","date":"2021-11-02","dateText":"2nd November","dateConfirmed":true,"opposition":"Malmo","venue":"A","competition":"Europe","attending":"none","result":"W","score":"1-0"},{"id":"h18","season":"21-22","date":"2021-11-06","dateText":"6th November","dateConfirmed":true,"opposition":"Burnley","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"1-1","lps":3.0,"myCost":55.0},{"id":"h19","season":"21-22","date":"2021-11-20","dateText":"20th November","dateConfirmed":true,"opposition":"Leicester","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"3-0","lps":3.0,"myCost":30.0},{"id":"h20","season":"21-22","date":"2021-11-23","dateText":"23rd November","dateConfirmed":true,"opposition":"Juventus","venue":"H","competition":"Europe","attending":"sourced","attendee":"Hubbards","result":"W","score":"4-0","lps":5.0,"othersCost":30.0},{"id":"h21","season":"21-22","date":"2021-11-28","dateText":"28th November","dateConfirmed":true,"opposition":"Man Utd","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"1-1","lps":1.0,"myCost":60.0},{"id":"h22","season":"21-22","date":"2021-12-01","dateText":"1st December","dateConfirmed":true,"opposition":"Watford","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"2-1","lps":3.0,"myCost":30.0},{"id":"h23","season":"21-22","date":"2021-12-04","dateText":"4th December","dateConfirmed":true,"opposition":"West Ham","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"2-3","lps":1.0,"myCost":30.0},{"id":"h24","season":"21-22","date":"2021-12-08","dateText":"8th December","dateConfirmed":true,"opposition":"Zenit","venue":"A","competition":"Europe","attending":"none","result":"D","score":"3-3"},{"id":"h25","season":"21-22","date":"2021-12-11","dateText":"11th December","dateConfirmed":true,"opposition":"Leeds","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Ben / Champz","result":"W","score":"3-2","lps":3.0,"othersCost":55.0},{"id":"h26","season":"21-22","date":"2021-12-16","dateText":"16th December","dateConfirmed":true,"opposition":"Everton","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Hubbards (4 tickets)","result":"D","score":"1-1","lps":3.0,"othersCost":55.0},{"id":"h27","season":"21-22","date":"2021-12-19","dateText":"19th December","dateConfirmed":true,"opposition":"Wolves","venue":"A","competition":"Premier League","attending":"none","result":"D","score":"0-0"},{"id":"h28","season":"21-22","date":"2021-12-22","dateText":"22nd December","dateConfirmed":true,"opposition":"Brentford","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Martin Williams","result":"W","score":"2-0","lps":5.0,"othersCost":30.0},{"id":"h29","season":"21-22","date":"2021-12-26","dateText":"26th December","dateConfirmed":true,"opposition":"Aston Villa","venue":"A","competition":"Premier League","attending":"none","result":"W","score":"3-1"},{"id":"h30","season":"21-22","date":"2021-12-29","dateText":"29th December","dateConfirmed":true,"opposition":"Brighton","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"1-1","lps":3.0,"myCost":55.0},{"id":"h31","season":"21-22","date":"2022-01-02","dateText":"2nd January","dateConfirmed":true,"opposition":"Liverpool","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Ricky adult/junior","result":"D","score":"2-2","lps":1.0,"othersCost":60.0},{"id":"h32","season":"21-22","date":"2022-01-05","dateText":"5th January","dateConfirmed":true,"opposition":"Tottenham (cup)","venue":"H","competition":"FA Cup","attending":"going","result":"W","score":"2-0","lps":5.0,"myCost":25.0},{"id":"h33","season":"21-22","date":"2022-01-08","dateText":"8th January","dateConfirmed":true,"opposition":"Chesterfield","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"5-1","lps":5.0,"myCost":30.0},{"id":"h34","season":"21-22","date":"2022-01-12","dateText":"12th January","dateConfirmed":true,"opposition":"Tottenham (cup)","venue":"A","competition":"FA Cup","attending":"going","result":"W","score":"1-0","lps":5.0,"myCost":30.0},{"id":"h35","season":"21-22","date":"2022-01-15","dateText":"15th January","dateConfirmed":true,"opposition":"Man City","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Rich","result":"L","score":"0-1","lps":1.0,"othersCost":30.0},{"id":"h36","season":"21-22","date":"2022-01-18","dateText":"18th January","dateConfirmed":true,"opposition":"Brighton","venue":"A","competition":"Premier League","attending":"going","result":"D","score":"1-1","lps":3.0,"myCost":30.0},{"id":"h37","season":"21-22","date":"2022-01-23","dateText":"23rd January","dateConfirmed":true,"opposition":"Tottenham","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-0","lps":1.0,"myCost":60.0},{"id":"h38","season":"21-22","date":"2022-02-05","dateText":"5th February","dateConfirmed":true,"opposition":"Plymouth - 4th rd","venue":"H","competition":"FA Cup","attending":"sourced","attendee":"Hubbards","result":"W","score":"2-1","lps":5.0,"othersCost":30.0},{"id":"h39","season":"21-22","date":"2022-02-09","dateText":"9th February","dateConfirmed":true,"opposition":"Al-Hilal CWC Semi","venue":"A","competition":"Club World Cup","attending":"none","result":"W","score":"1-0"},{"id":"h40","season":"21-22","date":"2022-02-12","dateText":"12th February","dateConfirmed":true,"opposition":"Palmeiras CWC Final","venue":"A","competition":"Club World Cup","attending":"none","result":"W","score":"2-1 AET"},{"id":"h41","season":"21-22","date":"2022-02-19","dateText":"19th February","dateConfirmed":true,"opposition":"Crystal Palace","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Ben & Owen","result":"W","score":"1-0","lps":3.0,"othersCost":30.0},{"id":"h42","season":"21-22","date":"2022-02-22","dateText":"22nd February","dateConfirmed":true,"opposition":"Lille","venue":"H","competition":"Europe","attending":"sourced","attendee":"Owen K & Hubbards & Champz","result":"W","score":"2-0","lps":3.0,"othersCost":55.0},{"id":"h43","season":"21-22","date":"2022-02-27","dateText":"27th February","dateConfirmed":true,"opposition":"Carabao Final","venue":"A","competition":"League Cup","attending":"going","result":"L","score":"0-0 Pens","myCost":40.0},{"id":"h44","season":"21-22","date":"2022-03-02","dateText":"Weds 2nd March","dateConfirmed":true,"opposition":"Luton - 5th Rd","venue":"A","competition":"FA Cup","attending":"none","result":"W","score":"3-2"},{"id":"h45","season":"21-22","date":"2022-03-05","dateText":"Sat 5th March","dateConfirmed":true,"opposition":"Burnley","venue":"A","competition":"Premier League","attending":"sourced","attendee":"John +1","result":"W","score":"4-0","lps":3.0,"othersCost":30.0},{"id":"h46","season":"21-22","date":"2022-03-13","dateText":"Sun 13th March","dateConfirmed":true,"opposition":"Newcastle","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Tibs & Vik","result":"W","score":"1-0","lps":3.0,"othersCost":55.0},{"id":"h47","season":"21-22","date":"2022-03-16","dateText":"Weds 16th March","dateConfirmed":true,"opposition":"Lille","venue":"A","competition":"Europe","attending":"going","result":"W","score":"2-1","lps":5.0,"myCost":37.5},{"id":"h48","season":"21-22","date":"2022-03-10","dateText":"Thurs 10th March","dateConfirmed":true,"opposition":"Norwich","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Nigel (single only)","result":"W","score":"3-1","lps":3.0,"othersCost":30.0},{"id":"h49","season":"21-22","date":"2022-03-19","dateText":"Sat 19th March","dateConfirmed":true,"opposition":"Middlesbrough - 1/4s","venue":"A","competition":"FA Cup","attending":"unavailable","result":"W","score":"2-0"},{"id":"h50","season":"21-22","date":"2022-04-02","dateText":"Sat 2nd April","dateConfirmed":true,"opposition":"Brentford","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"1-4","lps":3.0,"myCost":55.0},{"id":"h51","season":"21-22","date":"2022-04-06","dateText":"Tues 6th April","dateConfirmed":true,"opposition":"Real Madrid","venue":"H","competition":"Europe","attending":"going","result":"L","score":"1-3","lps":1.0,"myCost":60.0},{"id":"h52","season":"21-22","date":"2022-04-09","dateText":"Sat 9th April","dateConfirmed":true,"opposition":"Southampton","venue":"A","competition":"Premier League","attending":"none","result":"W","score":"6-0"},{"id":"h53","season":"21-22","date":"2022-04-12","dateText":"Weds 12th April","dateConfirmed":true,"opposition":"Real Madrid","venue":"A","competition":"Europe","attending":"sourced","attendee":"Vince-ish","result":"W","score":"3-2","lps":5.0,"othersCost":59.0},{"id":"h54","season":"21-22","date":"2022-04-17","dateText":"Sun 17th April","dateConfirmed":true,"opposition":"Palace - Cup Semi","venue":"A","competition":"FA Cup","attending":"going","result":"W","score":"2-0","myCost":30.0},{"id":"h55","season":"21-22","date":"2022-04-20","dateText":"Weds 20th April","dateConfirmed":true,"opposition":"Arsenal","venue":"H","competition":"Premier League","attending":"unavailable","result":"L","score":"2-4"},{"id":"h56","season":"21-22","date":"2022-04-24","dateText":"Sun 24th April","dateConfirmed":true,"opposition":"West Ham","venue":"H","competition":"Premier League","attending":"unavailable","result":"W","score":"1-0"},{"id":"h57","season":"21-22","date":"2022-04-28","dateText":"Thurs 28th April","dateConfirmed":true,"opposition":"Man Utd","venue":"A","competition":"Premier League","attending":"going","result":"D","score":"1-1","lps":1.0,"myCost":30.0},{"id":"h58","season":"21-22","date":"2022-05-01","dateText":"Sun 1st May","dateConfirmed":true,"opposition":"Everton","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Twitter Kid Sam Ramsay","result":"L","score":"0-1","lps":3.0,"othersCost":30.0},{"id":"h59","season":"21-22","date":"2022-05-07","dateText":"Sat 7th May","dateConfirmed":true,"opposition":"Wolves","venue":"H","competition":"Premier League","attending":"unavailable","result":"D","score":"2-2"},{"id":"h60","season":"21-22","date":"2022-05-11","dateText":"Weds 11th May","dateConfirmed":true,"opposition":"Leeds","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Charlie & George","result":"W","score":"3-0","lps":3.0,"othersCost":30.0},{"id":"h61","season":"21-22","date":"2022-05-14","dateText":"Sat 14th May","dateConfirmed":true,"opposition":"Liverpool - Cup Final","venue":"A","competition":"FA Cup","attending":"going","result":"L","score":"0-0 Pens","myCost":115.0},{"id":"h62","season":"21-22","date":"2022-05-19","dateText":"Thurs 19th May","dateConfirmed":true,"opposition":"Leicester","venue":"H","competition":"Premier League","attending":"unavailable","result":"D","score":"1-1"},{"id":"h63","season":"21-22","date":"2022-05-22","dateText":"Sun 22nd May","dateConfirmed":true,"opposition":"Watford","venue":"H","competition":"Premier League","attending":"unavailable","result":"W","score":"2-1"},{"id":"h64","season":"22-23","date":"2022-08-06","dateText":"Sat 6th Aug","dateConfirmed":true,"opposition":"Everton","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Jack Simm Twitter","result":"W","score":"1-0","lps":3.0,"othersCost":30.0},{"id":"h65","season":"22-23","date":"2022-08-14","dateText":"Sun 14th Aug","dateConfirmed":true,"opposition":"Spurs","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"2-2","lps":1.0,"myCost":60.0},{"id":"h66","season":"22-23","date":"2022-08-21","dateText":"Sun 21st Aug","dateConfirmed":true,"opposition":"Leeds","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"0-3","lps":3.0,"myCost":30.0},{"id":"h67","season":"22-23","date":"2022-08-27","dateText":"Sat 27th Aug","dateConfirmed":true,"opposition":"Leicester","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Owen K","result":"W","score":"2-1","lps":3.0,"othersCost":61.0},{"id":"h68","season":"22-23","date":"2022-08-30","dateText":"Tues 30th Aug","dateConfirmed":true,"opposition":"Southampton","venue":"A","competition":"Premier League","attending":"none","result":"L","score":"1-2"},{"id":"h69","season":"22-23","date":"2022-09-04","dateText":"Sun 4th Sept","dateConfirmed":true,"opposition":"West Ham","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Owen K","result":"W","score":"2-1","lps":3.0,"othersCost":61.0},{"id":"h70","season":"22-23","date":"2022-09-06","dateText":"Tues 6th Sept","dateConfirmed":true,"opposition":"Zagreb","venue":"A","competition":"Europe","attending":"none","result":"L","score":"0-1"},{"id":"h71","season":"22-23","date":"2022-09-14","dateText":"Weds 14th Sept","dateConfirmed":true,"opposition":"Salzburg","venue":"H","competition":"Europe","attending":"sourced","attendee":"Owen K","result":"D","score":"1-1","lps":5.0,"othersCost":35.0},{"id":"h72","season":"22-23","date":"2022-10-01","dateText":"Sat 1st Oct","dateConfirmed":true,"opposition":"Palace","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"2-1","lps":3.0,"myCost":28.0},{"id":"h73","season":"22-23","date":"2022-10-05","dateText":"Weds 5th Oct","dateConfirmed":true,"opposition":"Milan","venue":"H","competition":"Europe","attending":"sourced","attendee":"Owen K","result":"W","score":"3-0","lps":5.0,"othersCost":35.0},{"id":"h74","season":"22-23","date":"2022-10-08","dateText":"Sat 8th Oct","dateConfirmed":true,"opposition":"Wolves","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Owen K","result":"W","score":"3-0","lps":3.0,"othersCost":50.0},{"id":"h75","season":"22-23","date":"2022-10-11","dateText":"Tues 11th Oct","dateConfirmed":true,"opposition":"Milan","venue":"A","competition":"Europe","attending":"going","result":"W","score":"2-0","lps":5.0,"myCost":36.0},{"id":"h76","season":"22-23","date":"2022-10-16","dateText":"Sun 16th Oct","dateConfirmed":true,"opposition":"Villa","venue":"A","competition":"Premier League","attending":"none","result":"W","score":"2-0"},{"id":"h77","season":"22-23","date":"2022-10-19","dateText":"Weds 19th Oct","dateConfirmed":true,"opposition":"Brentford","venue":"A","competition":"Premier League","attending":"comp","result":"D","score":"0-0"},{"id":"h78","season":"22-23","date":"2022-10-22","dateText":"Sat 22nd Oct","dateConfirmed":true,"opposition":"Man Utd","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"1-1","lps":1.0,"myCost":60.0},{"id":"h79","season":"22-23","date":"2022-10-25","dateText":"Tues 25th Oct","dateConfirmed":true,"opposition":"Salzburg","venue":"A","competition":"Europe","attending":"none","result":"W","score":"2-1"},{"id":"h80","season":"22-23","date":"2022-10-29","dateText":"Sat 29th Oct","dateConfirmed":true,"opposition":"Brighton","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"1-4","lps":3.0,"myCost":30.0},{"id":"h81","season":"22-23","date":"2022-11-02","dateText":"Weds 2nd Nov","dateConfirmed":true,"opposition":"Zagreb","venue":"H","competition":"Europe","attending":"sourced","attendee":"Owen K","result":"W","score":"2-1","lps":5.0,"othersCost":35.0},{"id":"h82","season":"22-23","date":"2022-11-06","dateText":"Sun 6th Nov","dateConfirmed":true,"opposition":"Arsenal","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Charlie","result":"L","score":"0-1","lps":1.0,"othersCost":60.0},{"id":"h83","season":"22-23","date":"2022-11-09","dateText":"Weds 9th Nov","dateConfirmed":true,"opposition":"Man City Carabao","venue":"A","competition":"League Cup","attending":"sourced","attendee":"John","result":"L","score":"0-2","lps":5.0,"myCost":30.0},{"id":"h84","season":"22-23","date":"2022-11-12","dateText":"Sat 12th Nov","dateConfirmed":true,"opposition":"Newcastle","venue":"A","competition":"Premier League","attending":"sourced","attendee":"John","result":"L","score":"0-1","lps":3.0,"othersCost":30.0},{"id":"h85","season":"22-23","date":"2022-12-27","dateText":"Tues 27th December","dateConfirmed":true,"opposition":"Bournemouth","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-0","lps":3.0,"myCost":50.0},{"id":"h86","season":"22-23","date":"2023-01-01","dateText":"Sun 1st January","dateConfirmed":true,"opposition":"Forest","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Twitter - Carl Gavin","result":"D","score":"1-1","lps":3.0,"othersCost":30.0},{"id":"h87","season":"22-23","date":"2023-01-05","dateText":"Thurs 5th January","dateConfirmed":true,"opposition":"Man City","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Ricky","result":"L","score":"0-1","lps":1.0,"othersCost":48.0},{"id":"h88","season":"22-23","date":"2023-01-08","dateText":"Sun 8th January","dateConfirmed":true,"opposition":"Man City Cup","venue":"A","competition":"Premier League","attending":"sourced","attendee":"John","result":"L","score":"0-4","lps":5.0,"myCost":45.0},{"id":"h89","season":"22-23","date":"2023-01-12","dateText":"Thurs 12th January","dateConfirmed":true,"opposition":"Fulham","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"1-2","lps":3.0,"myCost":28.0},{"id":"h90","season":"22-23","date":"2023-01-15","dateText":"Sun 15th January","dateConfirmed":true,"opposition":"Palace","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Owen K","result":"W","score":"1-0","lps":3.0,"othersCost":55.0},{"id":"h91","season":"22-23","date":"2023-01-21","dateText":"Sat 21st January","dateConfirmed":true,"opposition":"Liverpool","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Champz","result":"D","score":"0-0","lps":1.0,"othersCost":30.0},{"id":"h92","season":"22-23","date":"2023-02-03","dateText":"Fri 3rd February","dateConfirmed":true,"opposition":"Fulham","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"0-0","lps":3.0,"myCost":55.0},{"id":"h93","season":"22-23","date":"2023-02-11","dateText":"Sat 11th February","dateConfirmed":true,"opposition":"West Ham","venue":"A","competition":"Premier League","attending":"going","result":"D","score":"1-1","lps":3.0,"myCost":30.0},{"id":"h94","season":"22-23","date":"2023-02-15","dateText":"Weds 15th Feb","dateConfirmed":true,"opposition":"Dortmund","venue":"A","competition":"Europe","attending":"going","result":"L","score":"0-1","lps":5.0,"myCost":16.5},{"id":"h95","season":"22-23","date":"2023-02-18","dateText":"Sat 18th Feb","dateConfirmed":true,"opposition":"Southampton","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Champz","result":"L","score":"0-1","lps":3.0,"myCost":10.0,"othersCost":50.0},{"id":"h96","season":"22-23","date":"2023-02-26","dateText":"Sun 26th Feb","dateConfirmed":true,"opposition":"Tottenham","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"0-2","lps":1.0,"myCost":30.0},{"id":"h97","season":"22-23","date":"2023-03-04","dateText":"Sat 4th March","dateConfirmed":true,"opposition":"Leeds","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Owen K","result":"W","score":"1-0","lps":3.0,"othersCost":61.0},{"id":"h98","season":"22-23","date":"2023-03-07","dateText":"Tues 7th March","dateConfirmed":true,"opposition":"Dortmund","venue":"H","competition":"Europe","attending":"going","result":"W","score":"2-0","lps":1.0,"myCost":55.0},{"id":"h99","season":"22-23","date":"2023-03-11","dateText":"Sat 11th March","dateConfirmed":true,"opposition":"Leicester","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"3-1","lps":3.0,"myCost":30.0},{"id":"h100","season":"22-23","date":"2023-03-18","dateText":"Sat 18th March","dateConfirmed":true,"opposition":"Everton","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Charlie Extras","result":"D","score":"2-2","lps":3.0,"othersCost":61.0},{"id":"h101","season":"22-23","date":"2023-04-01","dateText":"Sat 1st April","dateConfirmed":true,"opposition":"Villa","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"0-2","lps":3.0,"myCost":55.0},{"id":"h102","season":"22-23","date":"2023-04-04","dateText":"Tues 4th April","dateConfirmed":true,"opposition":"Liverpool","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Nick","result":"D","score":"0-0","lps":1.0,"othersCost":61.0},{"id":"h103","season":"22-23","date":"2023-04-08","dateText":"Sat 8th April","dateConfirmed":true,"opposition":"Wolves","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsey","result":"L","score":"0-1","lps":3.0,"othersCost":30.0},{"id":"h104","season":"22-23","date":"2023-04-12","dateText":"Weds 12th April","dateConfirmed":true,"opposition":"Real Madrid","venue":"A","competition":"Europe","attending":"none","result":"L","score":"0-2"},{"id":"h105","season":"22-23","date":"2023-04-15","dateText":"Sat 15th April","dateConfirmed":true,"opposition":"Brighton","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Nick","result":"L","score":"1-2","lps":3.0,"othersCost":50.0},{"id":"h106","season":"22-23","date":"2023-04-18","dateText":"Tues 18th April","dateConfirmed":true,"opposition":"Real Madrid","venue":"H","competition":"Europe","attending":"going","result":"L","score":"0-2","lps":1.0,"myCost":60.0},{"id":"h107","season":"22-23","date":"2023-04-26","dateText":"Weds 26th April","dateConfirmed":true,"opposition":"Brentford","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"0-2","lps":3.0,"myCost":55.0},{"id":"h108","season":"22-23","date":"2023-05-02","dateText":"Tues 2nd May","dateConfirmed":true,"opposition":"Arsenal","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"1-3","lps":1.0,"myCost":30.0},{"id":"h109","season":"22-23","date":"2023-05-06","dateText":"Sat 6th May","dateConfirmed":true,"opposition":"Bournemouth","venue":"A","competition":"Premier League","attending":"none","result":"W","score":"3-1"},{"id":"h110","season":"22-23","date":"2023-05-13","dateText":"Sat 13th May","dateConfirmed":true,"opposition":"Forest","venue":"H","competition":"Premier League","attending":"comp","result":"D","score":"2-2","lps":3.0,"othersCost":56.0},{"id":"h111","season":"22-23","date":"2023-05-21","dateText":"Sun 21st May","dateConfirmed":true,"opposition":"Man City","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsey","result":"L","score":"0-1","lps":1.0,"othersCost":30.0},{"id":"h112","season":"22-23","date":"2023-05-25","dateText":"Thurs 25th May","dateConfirmed":true,"opposition":"Man Utd","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Twills Bro","result":"L","score":"1-4","lps":1.0,"othersCost":30.0},{"id":"h113","season":"22-23","date":"2023-05-28","dateText":"Sun 28th May","dateConfirmed":true,"opposition":"Newcastle","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"1-1","lps":3.0,"myCost":55.0},{"id":"h114","season":"23-24","date":"2023-08-13","dateText":"Sun 13th Aug","dateConfirmed":true,"opposition":"Liverpool","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"1-1","lps":1.0,"myCost":60.0},{"id":"h115","season":"23-24","date":"2023-08-20","dateText":"Sun 20th Aug","dateConfirmed":true,"opposition":"West Ham","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"1-3","lps":3.0,"myCost":30.0},{"id":"h116","season":"23-24","date":"2023-08-25","dateText":"Fri 25th Aug","dateConfirmed":true,"opposition":"Luton","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Carl Gavin","result":"W","score":"3-0","lps":3.0,"othersCost":56.0},{"id":"h117","season":"23-24","date":"2023-08-30","dateText":"Weds 30th Aug","dateConfirmed":true,"opposition":"AFC Wimbledon","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-1","lps":5.0,"myCost":26.0},{"id":"h118","season":"23-24","date":"2023-09-02","dateText":"Sat 2nd Sept","dateConfirmed":true,"opposition":"Forest","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Charlie Extras","result":"L","score":"0-1","lps":3.0,"othersCost":61.0},{"id":"h119","season":"23-24","date":"2023-09-17","dateText":"Sun 17th Sept","dateConfirmed":true,"opposition":"Bournemouth","venue":"A","competition":"Premier League","attending":"none","result":"D","score":"0-0"},{"id":"h120","season":"23-24","date":"2023-09-24","dateText":"Sun 24th Sept","dateConfirmed":true,"opposition":"Villa","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Tibs","result":"L","score":"0-1","lps":3.0,"othersCost":61.0},{"id":"h121","season":"23-24","date":"2023-09-27","dateText":"Weds 27th Sept","dateConfirmed":true,"opposition":"Brighton","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Owen","result":"W","score":"1-0","lps":5.0,"othersCost":32.0},{"id":"h122","season":"23-24","date":"2023-10-02","dateText":"Mon 2nd October","dateConfirmed":true,"opposition":"Fulham","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"2-0","lps":3.0,"myCost":27.0},{"id":"h123","season":"23-24","date":"2023-10-07","dateText":"Sat 7th October","dateConfirmed":true,"opposition":"Burnley","venue":"A","competition":"Premier League","attending":"sourced","attendee":"John","result":"W","score":"4-1","lps":3.0,"othersCost":30.0},{"id":"h124","season":"23-24","date":"2023-10-21","dateText":"Sat 21st October","dateConfirmed":true,"opposition":"Arsenal","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"2-2","lps":1.0,"myCost":60.0},{"id":"h125","season":"23-24","date":"2023-10-28","dateText":"Sat 28th October","dateConfirmed":true,"opposition":"Brentford","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Owen","result":"L","score":"0-2","lps":3.0,"othersCost":55.0},{"id":"h126","season":"23-24","date":"2023-11-01","dateText":"Weds 1st Nov","dateConfirmed":true,"opposition":"Blackburn","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Rich","result":"W","score":"2-0","lps":5.0,"othersCost":26.0},{"id":"h127","season":"23-24","date":"2023-11-06","dateText":"Mon 6th Nov","dateConfirmed":true,"opposition":"Spurs","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"4-1","lps":1.0,"myCost":30.0},{"id":"h128","season":"23-24","date":"2023-11-12","dateText":"Sun 12th Nov","dateConfirmed":true,"opposition":"Man City","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Charlie Extras","result":"D","score":"4-4","lps":1.0,"othersCost":71.0},{"id":"h129","season":"23-24","date":"2023-11-25","dateText":"Sat 25th Nov","dateConfirmed":true,"opposition":"Newcastle","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsey","result":"L","score":"1-4","lps":3.0,"othersCost":30.0},{"id":"h130","season":"23-24","date":"2023-12-03","dateText":"Sun 3rd Dec","dateConfirmed":true,"opposition":"Brighton","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Owen","result":"W","score":"3-2","lps":3.0,"othersCost":61.0},{"id":"h131","season":"23-24","date":"2023-12-06","dateText":"Weds 6th Dec","dateConfirmed":true,"opposition":"Man Utd","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"1-2","lps":1.0,"myCost":30.0},{"id":"h132","season":"23-24","date":"2023-12-10","dateText":"Sun 10th Dec","dateConfirmed":true,"opposition":"Everton","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Carl Gavin","result":"L","score":"0-2","lps":3.0,"othersCost":30.0},{"id":"h133","season":"23-24","date":"2023-12-16","dateText":"Sat 16th Dec","dateConfirmed":true,"opposition":"Sheff Utd","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Carl Gavin","result":"W","score":"2-0","lps":3.0,"othersCost":56.0},{"id":"h134","season":"23-24","date":"2023-12-19","dateText":"Tues 19th Dec","dateConfirmed":true,"opposition":"Newcastle","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Champz","result":"W","score":"1-1","lps":5.0,"othersCost":38.0},{"id":"h135","season":"23-24","date":"2023-12-24","dateText":"Sun 24th Dec","dateConfirmed":true,"opposition":"Wolves","venue":"A","competition":"Premier League","attending":"sourced","attendee":"CFCJosh9","result":"L","score":"0-2","lps":3.0,"othersCost":30.0},{"id":"h136","season":"23-24","date":"2023-12-27","dateText":"Weds 27th Dec","dateConfirmed":true,"opposition":"Palace","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-1","lps":3.0,"myCost":55.0},{"id":"h137","season":"23-24","date":"2023-12-30","dateText":"Sat 30th Dec","dateConfirmed":true,"opposition":"Luton","venue":"A","competition":"Premier League","attending":"none","result":"W"},{"id":"h138","season":"23-24","date":"2024-01-06","dateText":"Sat 6th Jan","dateConfirmed":true,"opposition":"Preston (Cup 3rd)","venue":"H","competition":"FA Cup","attending":"going","result":"W","score":"4-0","lps":5.0,"myCost":32.0},{"id":"h139","season":"23-24","date":"2024-01-09","dateText":"Tues 9th Jan","dateConfirmed":true,"opposition":"Middlesbrough","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsey","result":"L","score":"0-1","lps":5.0,"othersCost":25.0},{"id":"h140","season":"23-24","date":"2024-01-13","dateText":"Sat 13th Jan","dateConfirmed":true,"opposition":"Fulham","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Richard","result":"W","score":"1-0","lps":3.0,"othersCost":55.0},{"id":"h141","season":"23-24","date":"2024-01-23","dateText":"Tues 23rd Jan","dateConfirmed":true,"opposition":"Middlesbrough","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"6-1","lps":5.0,"myCost":38.0},{"id":"h142","season":"23-24","date":"2024-01-26","dateText":"Fri 26th Jan","dateConfirmed":true,"opposition":"Villa (Cup 4th)","venue":"H","competition":"FA Cup","attending":"going","result":"D","score":"0-0","lps":5.0,"myCost":38.0},{"id":"h143","season":"23-24","date":"2024-01-31","dateText":"Weds 31st Jan","dateConfirmed":true,"opposition":"Liverpool","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Carl Gavin","result":"L","score":"1-4","lps":1.0,"othersCost":30.0},{"id":"h144","season":"23-24","date":"2024-02-04","dateText":"Sun 4th Feb","dateConfirmed":true,"opposition":"Wolves","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Champz","result":"L","score":"2-4","lps":3.0,"othersCost":61.0},{"id":"h145","season":"23-24","date":"2024-02-07","dateText":"Weds 7th Feb","dateConfirmed":true,"opposition":"Villa (Cup Replay)","venue":"A","competition":"FA Cup","attending":"sourced","attendee":"CFCJosh9","result":"W","score":"3-1","lps":5.0,"myCost":20.0},{"id":"h146","season":"23-24","date":"2024-02-12","dateText":"Mon 12th Feb","dateConfirmed":true,"opposition":"Palace","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"3-1","lps":3.0,"myCost":28.0},{"id":"h147","season":"23-24","date":"2024-02-17","dateText":"Sat 17th Feb","dateConfirmed":true,"opposition":"City","venue":"A","competition":"Premier League","attending":"sourced","attendee":"John","result":"D","score":"1-1","lps":1.0,"othersCost":30.0},{"id":"h148","season":"23-24","date":"2024-02-25","dateText":"Sun 25th Feb","dateConfirmed":true,"opposition":"Carabao Final","venue":"N","competition":"League Cup","attending":"going","result":"L","score":"0-1 ET","myCost":41.0},{"id":"h149","season":"23-24","date":"2024-02-28","dateText":"Weds 28th Feb","dateConfirmed":true,"opposition":"Leeds (Cup 5th)","venue":"H","competition":"FA Cup","attending":"sourced","attendee":"Charlie Extras","result":"W","score":"3-2","lps":5.0,"othersCost":38.0},{"id":"h150","season":"23-24","date":"2024-03-02","dateText":"Sat 2nd March","dateConfirmed":true,"opposition":"Brentford","venue":"A","competition":"Premier League","attending":"going","result":"D","score":"2-2","lps":3.0,"myCost":30.0},{"id":"h151","season":"23-24","date":"2024-03-11","dateText":"Mon 11th March","dateConfirmed":true,"opposition":"Newcastle","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Champz","result":"W","score":"3-2","lps":3.0,"othersCost":61.0},{"id":"h152","season":"23-24","date":"2024-03-17","dateText":"Sun 17th March","dateConfirmed":true,"opposition":"Leicester","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"4-2","lps":5.0,"myCost":38.0},{"id":"h153","season":"23-24","date":"2024-03-30","dateText":"Sat 30th March","dateConfirmed":true,"opposition":"Burnley","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"2-2","lps":3.0,"myCost":50.0},{"id":"h154","season":"23-24","date":"2024-04-04","dateText":"Thurs 4th April","dateConfirmed":true,"opposition":"Man Utd","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"4-3","lps":1.0,"myCost":60.0},{"id":"h155","season":"23-24","date":"2024-04-07","dateText":"Sun 7th Aprill","dateConfirmed":true,"opposition":"Sheff Utd","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsey","result":"D","score":"2-2","lps":3.0,"othersCost":30.0},{"id":"h156","season":"23-24","date":"2024-04-15","dateText":"Mon 15th April","dateConfirmed":true,"opposition":"Everton","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Champz","result":"W","score":"6-0","lps":3.0,"othersCost":61.0},{"id":"h157","season":"23-24","date":"2024-04-20","dateText":"Sat 20th April","dateConfirmed":true,"opposition":"Man City (Cup Semi)","competition":"FA Cup","attending":"going","result":"L","score":"0-1","myCost":33.0},{"id":"h158","season":"23-24","date":"2024-04-23","dateText":"Tues 23rd April","dateConfirmed":true,"opposition":"Arsenal","venue":"A","competition":"Premier League","attending":"sourced","attendee":"George","result":"L","score":"0-5","lps":1.0,"othersCost":30.0},{"id":"h159","season":"23-24","date":"2024-04-27","dateText":"Sat 27th April","dateConfirmed":true,"opposition":"Villa","venue":"A","competition":"Premier League","attending":"sourced","attendee":"CFCJosh9","lps":3.0,"othersCost":30.0},{"id":"h160","season":"23-24","date":"2024-05-02","dateText":"Thurs 2nd May","dateConfirmed":true,"opposition":"Spurs","venue":"H","competition":"Premier League","attending":"sourced","attendee":"George","lps":1.0,"othersCost":60.0},{"id":"h161","season":"23-24","date":"2024-05-05","dateText":"Sun 5th May","dateConfirmed":true,"opposition":"West Ham","venue":"H","competition":"Premier League","attending":"none","lps":3.0,"othersCost":61.0},{"id":"h162","season":"23-24","date":"2024-05-11","dateText":"Sat 11th May","dateConfirmed":true,"opposition":"Forest","venue":"A","competition":"Premier League","attending":"none","lps":3.0,"othersCost":30.0},{"id":"h163","season":"23-24","date":"2024-05-15","dateText":"Weds 15th May","dateConfirmed":true,"opposition":"Brighton","venue":"A","competition":"Premier League","attending":"going","lps":3.0,"myCost":30.0},{"id":"h164","season":"23-24","date":"2024-05-19","dateText":"Sun 19th May","dateConfirmed":true,"opposition":"Bournemouth","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Nick","lps":3.0},{"id":"h165","season":"24-25","date":"2024-08-18","dateText":"Sun 18th Aug","dateConfirmed":true,"opposition":"Man City","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"0-2"},{"id":"h166","season":"24-25","date":"2024-08-22","dateText":"Thurs 22nd Aug","dateConfirmed":true,"opposition":"Servette","venue":"H","competition":"Europe","attending":"none","result":"W","score":"2-0","lps":5.0,"myCost":27.0},{"id":"h167","season":"24-25","date":"2024-08-25","dateText":"Sun 25th Aug","dateConfirmed":true,"opposition":"Wolves","venue":"A","competition":"Premier League","attending":"none","result":"W","score":"6-2"},{"id":"h168","season":"24-25","date":"2024-08-29","dateText":"Thurs 29th August","dateConfirmed":true,"opposition":"Servette","venue":"A","competition":"Europe","attending":"none","result":"L","score":"1-2"},{"id":"h169","season":"24-25","date":"2024-09-01","dateText":"Sun 1st Sept","dateConfirmed":true,"opposition":"Crystal Palace","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"1-1"},{"id":"h170","season":"24-25","date":"2024-09-14","dateText":"Sat 14th Sept","dateConfirmed":true,"opposition":"Bournemouth","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Owen","result":"W","score":"1-0","lps":3.0,"othersCost":30.0},{"id":"h171","season":"24-25","date":"2024-09-21","dateText":"Sat 21st Sept","dateConfirmed":true,"opposition":"West Ham","venue":"A","competition":"Premier League","attending":"none","result":"W","score":"3-0"},{"id":"h172","season":"24-25","date":"2024-09-24","dateText":"Tues 24th Sept","dateConfirmed":true,"opposition":"Barrow","venue":"H","competition":"Premier League","attending":"sourced","attendee":"Owen's pals","result":"W","score":"5-0","lps":5.0,"othersCost":27.0},{"id":"h173","season":"24-25","date":"2024-09-28","dateText":"Sat 28th Sept","dateConfirmed":true,"opposition":"Brighton","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"4-2"},{"id":"h174","season":"24-25","date":"2024-10-03","dateText":"Thurs 3rd October","dateConfirmed":true,"opposition":"Gent","venue":"H","competition":"Europe","attending":"going","result":"W","score":"4-2","lps":5.0,"myCost":27.0},{"id":"h175","season":"24-25","date":"2024-10-06","dateText":"Sun 6th October","dateConfirmed":true,"opposition":"Forest","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"1-1"},{"id":"h176","season":"24-25","date":"2024-10-20","dateText":"Sun 20th Oct","dateConfirmed":true,"opposition":"Liverpool","venue":"A","competition":"Premier League","attending":"none","result":"L","score":"1-2"},{"id":"h177","season":"24-25","date":"2024-10-24","dateText":"Thurs 24th Oct","dateConfirmed":true,"opposition":"Panathanaikos","venue":"A","competition":"Europe","attending":"none","result":"W","score":"4-1"},{"id":"h178","season":"24-25","date":"2024-10-27","dateText":"Sun 27th Oct","dateConfirmed":true,"opposition":"Newcastle","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-1"},{"id":"h179","season":"24-25","date":"2024-10-30","dateText":"Weds 30th Oct","dateConfirmed":true,"opposition":"Newcastle Cup","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsey","result":"L","score":"0-2","lps":5.0,"othersCost":20.0},{"id":"h180","season":"24-25","date":"2024-11-03","dateText":"Sun 3rd Nov","dateConfirmed":true,"opposition":"Man Utd","venue":"A","competition":"Premier League","attending":"none","result":"D","score":"1-1"},{"id":"h181","season":"24-25","date":"2024-11-07","dateText":"Thurs 7th Nov","dateConfirmed":true,"opposition":"Noah","venue":"H","competition":"Europe","attending":"sourced","attendee":"Champz","result":"W","score":"8-0","lps":5.0,"othersCost":27.0},{"id":"h182","season":"24-25","date":"2024-11-10","dateText":"Sun 10th Nov","dateConfirmed":true,"opposition":"Arsenal","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"1-1"},{"id":"h183","season":"24-25","date":"2024-11-23","dateText":"Sat 23rd Nov","dateConfirmed":true,"opposition":"Leicester","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"2-1","lps":3.0,"myCost":30.0},{"id":"h184","season":"24-25","date":"2024-11-28","dateText":"Thurs 28th Nov","dateConfirmed":true,"opposition":"Heidenheim","venue":"A","competition":"Europe","attending":"none","result":"W","score":"2-0"},{"id":"h185","season":"24-25","date":"2024-12-01","dateText":"Sun 1st Dec","dateConfirmed":true,"opposition":"Aston Villa","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"3-0"},{"id":"h186","season":"24-25","date":"2024-12-04","dateText":"Weds 4th Dec","dateConfirmed":true,"opposition":"Southampton","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Charlie","result":"W","score":"5-1","lps":3.0,"othersCost":30.0},{"id":"h187","season":"24-25","date":"2024-12-08","dateText":"Sun 8th Dec","dateConfirmed":true,"opposition":"Spurs","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"4-3","lps":1.0,"myCost":30.0},{"id":"h188","season":"24-25","date":"2024-12-12","dateText":"Thurs 12th Dec","dateConfirmed":true,"opposition":"Astana","venue":"A","competition":"Europe","attending":"none","result":"W","score":"3-1"},{"id":"h189","season":"24-25","date":"2024-12-15","dateText":"Sun 15th Dec","dateConfirmed":true,"opposition":"Brentford","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-1"},{"id":"h190","season":"24-25","date":"2024-12-19","dateText":"Thurs 19th Dec","dateConfirmed":true,"opposition":"Shamrock","venue":"H","competition":"Europe","attending":"going","result":"W","score":"5-1","lps":5.0,"myCost":27.0},{"id":"h191","season":"24-25","date":"2024-12-22","dateText":"Sun 22nd Dec","dateConfirmed":true,"opposition":"Everton","venue":"A","competition":"Premier League","attending":"none","result":"D","score":"0-0"},{"id":"h192","season":"24-25","date":"2024-12-26","dateText":"Boxing Day","dateConfirmed":true,"opposition":"Fulham","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"1-2"},{"id":"h193","season":"24-25","date":"2024-12-30","dateText":"Mon 30th Dec","dateConfirmed":true,"opposition":"Ipswich","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Rich","result":"L","score":"0-2","lps":3.0,"othersCost":30.0},{"id":"h194","season":"24-25","date":"2025-01-04","dateText":"Sat 4th Jan","dateConfirmed":true,"opposition":"Palace","venue":"A","competition":"Premier League","attending":"none","result":"D","score":"1-1"},{"id":"h195","season":"24-25","date":"2025-01-11","dateText":"Sat 11th Jan","dateConfirmed":true,"opposition":"Morecambe","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"5-0","lps":5.0,"myCost":34.0},{"id":"h196","season":"24-25","date":"2025-01-14","dateText":"Tues 14th Jan","dateConfirmed":true,"opposition":"Bournemouth","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"2-2"},{"id":"h197","season":"24-25","date":"2025-01-20","dateText":"Mon 20th Jan","dateConfirmed":true,"opposition":"Wolves","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"3-1"},{"id":"h198","season":"24-25","date":"2025-01-25","dateText":"Sat 25th Jan","dateConfirmed":true,"opposition":"City","venue":"A","competition":"Premier League","attending":"none","result":"L","score":"1-3","lps":1.0,"myCost":30.0},{"id":"h199","season":"24-25","date":"2025-02-03","dateText":"Mon 3rd Feb","dateConfirmed":true,"opposition":"West Ham","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-1"},{"id":"h200","season":"24-25","date":"2025-02-08","dateText":"Sat 8th Feb","dateConfirmed":true,"opposition":"Brighton","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"1-2","lps":5.0,"myCost":25.0},{"id":"h201","season":"24-25","date":"2025-02-14","dateText":"Fri 14th Feb","dateConfirmed":true,"opposition":"Brighton","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"0-3","lps":3.0,"myCost":30.0},{"id":"h202","season":"24-25","date":"2025-02-22","dateText":"Sat 22nd Feb","dateConfirmed":true,"opposition":"Villa","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsey","result":"L","score":"1-2","lps":3.0,"othersCost":30.0},{"id":"h203","season":"24-25","date":"2025-02-25","dateText":"Tues 25th Feb","dateConfirmed":true,"opposition":"Southampton","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"4-0"},{"id":"h204","season":"24-25","date":"2025-03-06","dateText":"Thurs 6th Mar","dateConfirmed":true,"opposition":"Copenhagen","venue":"A","competition":"Europe","attending":"none","result":"W","score":"2-1"},{"id":"h205","season":"24-25","date":"2025-03-09","dateText":"Sun 9th March","dateConfirmed":true,"opposition":"Leicester","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"1-0"},{"id":"h206","season":"24-25","date":"2025-03-13","dateText":"Thurs 13th March","dateConfirmed":true,"opposition":"Copenhagen","venue":"H","competition":"Europe","attending":"going","result":"W","score":"1-0","lps":5.0,"myCost":34.0},{"id":"h207","season":"24-25","date":"2025-03-16","dateText":"Sun 16th March","dateConfirmed":true,"opposition":"Arsenal","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"0-1","lps":1.0,"myCost":30.0},{"id":"h208","season":"24-25","date":"2025-04-03","dateText":"Thurs 3rd April","dateConfirmed":true,"opposition":"Spurs","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"1-0"},{"id":"h209","season":"24-25","date":"2025-04-06","dateText":"Sun 6th April","dateConfirmed":true,"opposition":"Brentford","venue":"A","competition":"Premier League","attending":"going","result":"D","score":"0-0","myCost":30.0},{"id":"h210","season":"24-25","date":"2025-04-10","dateText":"Thurs 10th April","dateConfirmed":true,"opposition":"Legia Warsaw","venue":"A","competition":"Europe","attending":"none","result":"W","score":"3-0"},{"id":"h211","season":"24-25","date":"2025-04-13","dateText":"Sun 13th April","dateConfirmed":true,"opposition":"Ipswich","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"2-2"},{"id":"h212","season":"24-25","date":"2025-04-17","dateText":"Thurs 17th April","dateConfirmed":true,"opposition":"Legia Warsaw","venue":"H","competition":"Europe","attending":"going","result":"L","score":"1-2","lps":1.0,"myCost":34.0},{"id":"h213","season":"24-25","date":"2025-04-20","dateText":"Sun 20th April","dateConfirmed":true,"opposition":"Fulham","venue":"A","competition":"Premier League","attending":"none","result":"W","score":"2-1"},{"id":"h214","season":"24-25","date":"2025-04-26","dateText":"Sat 26th April","dateConfirmed":true,"opposition":"Everton","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"1-0"},{"id":"h215","season":"24-25","date":"2025-05-01","dateText":"Thurs 1st May","dateConfirmed":true,"opposition":"Djurgaarden","venue":"A","competition":"Europe","attending":"none","result":"W","score":"4-1"},{"id":"h216","season":"24-25","date":"2025-05-04","dateText":"Sun 4th May","dateConfirmed":true,"opposition":"Liverpool","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"3-1"},{"id":"h217","season":"24-25","date":"2025-05-08","dateText":"Thurs 8th May","dateConfirmed":true,"opposition":"Djurgaarden","venue":"H","competition":"Europe","attending":"going","result":"W","score":"1-0","lps":1.0,"myCost":40.0},{"id":"h218","season":"24-25","date":"2025-05-11","dateText":"Sun 11th May","dateConfirmed":true,"opposition":"Newcastle","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsey","result":"L","score":"0-2","lps":3.0,"othersCost":30.0},{"id":"h219","season":"24-25","date":"2025-05-16","dateText":"Fri 16th May","dateConfirmed":true,"opposition":"Man Utd","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"1-0"},{"id":"h220","season":"24-25","date":"2025-05-25","dateText":"Sun 25th May","dateConfirmed":true,"opposition":"Forest","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Owen","result":"W","score":"1-0","lps":3.0,"othersCost":30.0},{"id":"h221","season":"24-25","date":"2025-05-28","dateText":"Weds 28th May","dateConfirmed":true,"opposition":"Real Betis","venue":"N","competition":"Europe","attending":"none","result":"W","score":"4-1"},{"id":"h222","season":"25-26","date":"2025-08-08","dateText":"Fri 8th Aug","dateConfirmed":true,"opposition":"Bayer Leverkusen","venue":"H","competition":"Europe","attending":"sourced","attendee":"Owen","lps":5.0,"othersCost":48.0},{"id":"h223","season":"25-26","date":"2025-08-10","dateText":"Sun 10th Aug","dateConfirmed":true,"opposition":"AC Milan","venue":"H","competition":"Europe","attending":"sourced","attendee":"Nick","lps":5.0},{"id":"h224","season":"25-26","date":"2025-08-17","dateText":"Sun 17th Aug","dateConfirmed":true,"opposition":"Crystal Palace","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"0-0"},{"id":"h225","season":"25-26","date":"2025-08-22","dateText":"Fri 22nd Aug","dateConfirmed":true,"opposition":"West Ham","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"5-1","lps":3.0,"myCost":31.0,"journal":{"title":"Wapping, Whispers & Wobbly Predictions","pub":"The Prospect of Whitby / The Captain Kidd","mood":"","ambience":null,"withWho":"","body":"Notes:\nWapping is cool from what I’ve seen in a spooky historic way. Cobbled streets and old buildings that could tell a few stories, I’m sure.\n\nThe Prospect was busy - lots of Americans - on a sunny Friday. No good river-view tables so had to settle for a small one back near the door. Necked it and headed for the CK. Wouldn’t mind heading back on a quieter day for a seat on the river, although Captain Kidd arguably a better pub.\n\nTHE MATCH\nMatch: West Ham (a)\n\nPrediction: ‘No better time to play them’ feels dangerous with Chelsea. Due seeing a win there after a number of draws/defeats.\n\nPrediction: 3-1 Chelsea\n\nCurrent vibes: Cautiously optimistic for the season but it’s a young squad and a few injuries to key players ruins us. Top 4/5 and a trip to Wembley 🤝\n\nPUB ATMOSPHERE\nCrowd Mood: Sat out on a picnic bench style table at the CK. Australians on the next table; lots of different groups and couples. A real mixture. Can tell it’s a Friday, it just has a different feel. The Aussies have been here a few hours, I’d say. There’s a good buzz without it necessarily being people here for the long haul or treating it as pre drinks.\n\nIt’s a nice temperature for a shacket. Not too hot, not much of a chill. Perhaps my ideal weather, you could still tan with a good seat in the sun...\n\nA lady in heeled boots got up to go to the bar or maybe the toilet, tying her hair up as she went. Every gent’s attention turned for a split second.\n\nWas planning on getting food at one of these pubs but don’t think going to have time. Uh oh.\n\n• TV On?: No TV or music at a Sam Smith’s and I’m not sure there was at the Prospect either.\n• Best overheard snippet: The Aussies have invited their pals for dinner and she got picked up on the fact that she said they should suggest a theme - when she meant cuisine. Everything is funnier in an Australian accent, and they always seem to be having fun.\n\nA CHECK IN\nToday’s Mood: All about this evening. Even away games in London hit different to going to the Bridge. Even with the long walk from Stratford and previous shite experiences at West Ham.\n\nBeen a little stressed over the last month about not being good enough at work but a few more positive interactions and responses to projects have eased that a bit, for now.\n\nHighlight of the Week: Hopefully yet to come.\nOne thing I’m glad is behind me: The week (3 days) of work and managing to avoid any difficult bits\nOne thing I’m looking forward to: The new tele is arriving tomorrow and we have a bank holiday. Longer term, we have a good September on the cards.\n\nCREATIVE CORNER\nWapping, Whispers & Wobbly Predictions\n\nWapping: where the streets are cobbled, the buildings are haunted, and the pints are priced like they’ve been aged in gold barrels. First stop, The Prospect of Whitb: a pub so historic it practically coughs up Dickensian fog. Sadly, no riverside seats unless you fancy elbowing a tourist mid-selfie. I downed a Level Head (£7.70. Cheers, inflation) and retreated to The Captain Kidd, which felt like the Prospect’s cooler, less clingy cousin.\n\nOutside, I found myself on a bench neighbouring Australians who’d clearly been marinating in gin and sunshine for hours. One of them confused “theme” with “cuisine” while planning dinner, and honestly, I’d let them narrate my life if I could. No music, no telly, just the ambient buzz of Friday optimism and the occasional bloke swiveling his neck as the sound of a lady in heeled boots walks past their table, tying her hair as she goes. Nature.\n\nMatch vibes: Chelsea vs West Ham (away). I’ve predicted a 3–1 win, which means we’ll probably lose 4–0 and someone will get sent off for blinking too aggressively. Still, cautiously optimistic. Top 4/5 and a cheeky Wembley trip? Stranger things have happened. Like paying £7.20 for two Sam Smith’s stouts and feeling like you got a deal.\n\nMood check: Work stress has been gently simmering, but a few better chats this week have turned the heat down to “mild existential dread.” New tele arrives tomorrow, bank holiday incoming, and September’s looking like the kind of month that might just offer us some more good pints and pondering.\n\nLAST ORDERS\nA final swig reflection:","postNote":""},"beers":[{"name":"Level Head","pub":"The Prospect of Whitby","price":7.7,"qty":1,"id":"b8979"},{"name":"Sam Smith’s Extra Stout","pub":"The Prospect of Whitby","price":7.2,"qty":2,"id":"b37960"}]},{"id":"h226","season":"25-26","date":"2025-08-30","dateText":"Sat 30th Aug","dateConfirmed":true,"opposition":"Fulham","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-0"},{"id":"h227","season":"25-26","date":"2025-09-13","dateText":"Sat 13th Sept","dateConfirmed":true,"opposition":"Brentford","venue":"A","competition":"Premier League","attending":"none","result":"D","score":"2-2","journal":{"title":"Guinness, Goals & Gastro-Grit","pub":"The Ramble Inn","mood":"","ambience":null,"withWho":"","body":"THE ESSENTIALS","postNote":"I aimed for the Pig & Whistle post-match but was busy with dickheads and no football on. Had a wee and left for the Park Tavern.\n\nTHE MATCH\nMatch: AFC Wimbledon v Rotherham\n\nPrediction: 0-0 (Ended 2-1 Dons)\n\nCurrent vibes:\nI don’t see many goals when i go to Wimbledon...\n\nHolly away in Deal with Frey and Sophie so I got myself a ticket for Dons.\n\nPUB ATMOSPHERE\nCrowd Mood: just two old boys when I came in but a few more have trickled in since. Quiet with most of the focus on the football on the tele.\n\nA proper old school pub - only 2nd time I’ve been able to visit\n\n• TV On?: Arsenal v Forest - 1-0 at HT (Zubimendi volley)\n\n• Best overheard snippet: a few mutters between the regulars but otherwise nicely quiet. It’s only 1pm.\n\n- Post-match pub atmos; I managed to bag a sofa spot in front of West Ham v Spurs. Nice big quiet pub even when a family with kids came in it isn’t unbearable. 0-0 at half time as I write. Feeling a bit more human than earlier - will be picking up some dirty food before heading home for cans and Chelsea on the tele\n\nA CHECK IN\nToday’s Mood in One Word: Buggy (stomach acting up a bit - had to cut a run short this morning). Gutted as was buzzing for this weekend of solo time!\n\nHighlight of the Week: A largely positive week of work\nOne thing I’m glad is behind me: A wee mini bout of work anxiety and feeling like I wasn’t good enough\n\nOne thing I’m looking forward to: Awaiting confirmation from Stu that we have tickets for Brentford - Chels this evening, in the away end too...\n\nDidn’t happen in the end 😂\n\nCREATIVE CORNER\n\n🍻 “Guinness, Goals & Gastro-Grit”\n\nSolo Saturday, stomach slightly cursed, but spirits high. Holly’s off in Deal with Frey and Sophie, so I seized the moment for a bit of football and fermentation. First stop: The Ramble Inn, a proper old-school boozer where the Guinness is £5.30 and the card machine is a myth. Cash only—like a test of character. I passed. Twice.\n\nWalked in to find two old boys already installed, eyes glued to Arsenal v Forest. Zubimendi volleyed one in and no one flinched. A few more punters trickled in, but the vibe stayed firmly “early afternoon contemplative.” No music, no fuss, just muttered commentary and the occasional throat-clear. It’s only my second visit, but it’s already earned a place in the pub pantheon.\n\nMatch prediction: 0–0. Because when I go to Wimbledon, goals tend to hide. Naturally, the Dons won 2–1. I’m starting to think I’m not cursed—just dramatically pessimistic.\n\nPost-match, I aimed for The Pig & Whistle, but it was rammed with dickheads and no football on. Had a tactical wee and retreated to The Park Tavern, where I bagged a sofa spot in front of West Ham v Spurs. Even with a family of kids nearby, it was peaceful. Murphy’s at £5.90 a pop—still cheaper than therapy. 0–0 at half-time as I write, and I’m feeling more human than earlier. Dirty food awaits, then cans and Chelsea on the telly.\n\nMood: buggy. Cut my run short this morning thanks to a stomach that’s staging a protest. Gutted, because I was buzzing for this weekend of solo serenity. Still, the Guinness helped. Work’s been decent—anxiety’s taken a back seat, and I’ve had a few wins. Was hoping for Brentford v Chelsea tickets tonight, away end, proper buzz… didn’t happen. Classic.\n\nBut hey, two pubs, two pints (plus two more), one win, and a sofa seat. Not bad for a day that started with digestive betrayal.\n\nManchester awaits next week..."},"beers":[{"name":"Guinness","pub":"The Ramble Inn","price":5.3,"qty":2,"id":"b8702"},{"name":"Pub = The Park Tavern & Murphy’s","pub":"post-match","price":5.9,"qty":2,"id":"b29126"}]},{"id":"h228","season":"25-26","date":"2025-09-17","dateText":"Weds 17th Sept","dateConfirmed":true,"opposition":"Bayern Munich","venue":"A","competition":"Europe","attending":"none","result":"L","score":"1-3"},{"id":"h229","season":"25-26","date":"2025-09-20","dateText":"Sat 20th Sept","dateConfirmed":true,"opposition":"Man Utd","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"1-2","lps":1.0,"journal":{"title":"Including the Full Review of the day","pub":"The Lost Dene - Manchester Deansgate / The Sawyers Arms - Deansgate Manchester / The Director’s Box / Old Trafford / Motel One - Hotel Bar","mood":"","ambience":null,"withWho":"","body":"[11:27] THE ESSENTIALS\n\nTHE MATCH\nMatch: Man United (a)\nPrediction: 2-2\nCurrent vibes: Just off the back of getting beat by Bayern. Old Trafford been a bogey ground for years and I’m 0 wins out of 4 visits myself. Anything could happen... we should beat them at the moment but it rarely is that simple...\n\nPUB ATMOSPHERE\nA little gutted I’ve had to end up here - I tried Mulligans - the finest Guinness I’ve ever tasted - but it was already standing only at midday and I’ve got an overnight bag with me.\n\nIt’s very wet and forecast to stay wet all day/night. Very Manchester. Let’s hope they’ve fixed those leaks at Old Trafford for later.\n\nGoing to settle in here with a pint or 3 max while the Merseyside derby is on in the early kick off and before I can check in to my hotel.\n\nCrowd Mood: Place filling up with United fans and there’s a small group playing darts with London accents who I’m guessing are Chels... doesn’t feel like there’s too many fans of either Liverpool or Everton in here. Most doing what I’m doing and warming slowly for the game here later (5.30 kick off)\n\n• Soundtrack: there’s commentary on the tele for a bit of atmosphere - this place is full of screens but the chatter of the big pub makes it feel more like 5.33pm rather than 12.33pm...\n• Best overheard snippet: Not particularly a funny one but one of the Chels lot looked up from his phone and read out a headline he’d obvs just seen about Starmer introducing digital ID, which of course no doubt is bollocks but is the sort of thing being lapped up by so many at the moment, including a large percentage of our away ends who sing about ‘having Palmer, fuck off Starmer’\n\nA CHECK IN\nToday’s Mood in One Word: We’re half a pint in - a little gutted I couldn’t make Mulligans work - slightly naively thought I’d be early enough to sit and have a few quiet ones while the early game was on\n\nHighlight of the Week: Will hopefully be today\n\nOne thing I’m glad is behind me: have been organising an event for work which was a bit stressful but is now done\n\nOne thing I’m looking forward to: hopefully a win at Old Trafford and ideally finding somewhere suitable to sink a few solo pints before and after the game today. Very much TBC\n\nCREATIVE CORNER\nYou can rotate between these or include all:\n\nOption A: Short Story Prompt\n\n• Setting: Describe the pub as if it were a scene in a novel\n• Character: Invent a fictional patron—what’s their story?\n• Conflict: What secret are they hiding or what decision are they facing?\n\nOption B: Chapter Builder\n\n• Continue a story each week.• Title of Chapter\n• Scene Summary\n• Dialogue Snippet\n• Cliffhanger or closing line\n\nOption C: AI Collaboration\n\n• Situational Prompt:• “A man walks into this pub carrying a…”\n• “The bartender knows something no one else does…”\n• “Outside, the rain starts just as…”\n\n• You send me the prompt and I write a short story based on it.\n\nCreate a “pub character roster” over time—recurring fictional figures who evolve.\n\nLAST ORDERS\nA final swig reflection:\n\n— — —\n\n[11:52] THE ESSENTIALS\n\nI’ve moved on for Pint 2 (and 3). Just next door from where I was. Had other people swarm my table in there and liked the look of this place when walked past\n\nI’ve patiently perched at the bar before nabbing a stool when some people left\n\nOn to the second pint here, third of the day before a little break to go check in\n\nTHE MATCH\nMatch:\nPrediction:\nCurrent vibes:\n\nPUB ATMOSPHERE\nCrowd Mood: a better bunch in here - the other one felt a bit ‘yellow card’ vibes. £1.25 a pint more here though...\n\nSimilar that lots of Utd fans although big cheers when Liverpool got their second goal.\n• TV On?: also showing the Merseyside Derby on multiple screens.\n•\n• Best overheard snippet: (if any)\n\nA CHECK IN\nToday’s Mood in One Word:\nHighlight of the Week:\nOne thing I’m glad is behind me:\nOne thing I’m looking forward to:\n\nCREATIVE CORNER\nYou can rotate between these or include all:\n\nOption A: Short Story Prompt\n\n• Setting: Describe the pub as if it were a scene in a novel\n• Character: Invent a fictional patron—what’s their story?\n• Conflict: What secret are they hiding or what decision are they facing?\n\nOption B: Chapter Builder\n\n• Continue a story each week.• Title of Chapter\n• Scene Summary\n• Dialogue Snippet\n• Cliffhanger or closing line\n\nOption C: AI Collaboration\n\n• Situational Prompt:• “A man walks into this pub carrying a…”\n• “The bartender knows something no one else does…”\n• “Outside, the rain starts just as…”\n\n• You send me the prompt and I write a short story based on it.\n\nCreate a “pub character roster” over time—recurring fictional figures who evolve.\n\nLAST ORDERS\nA final swig reflection:\n\n— — —\n\n[14:22] THE ESSENTIALS\n\nBeen and checked in now. Had this one starred on the map so thought would do the trick for soccer Saturday and a pint before jumping on the tram early ish\n\nThis place doesn’t necessarily seem to be people going to the game\n\nTHE MATCH\nMatch:\nPrediction:\nCurrent vibes:\n\nPUB ATMOSPHERE\nCrowd Mood: lively place- people out for Saturday day drinking. England women’s rugby on one screen and soccer Saturday on the others. No sound though - instead it’s some bad vocal remix of let me think about it.\n\nOne imagines this is the vibe from open til close,  just rowdier as the day goes on. Impressed by the locals’ commitment to early drinking despite the pissing rain.\n\nNot somewhere I’m able to sit so have taken a wall lean near the bar.\n\nNot the greatest pick from me tbf but is short walk from hotel and then on to the tram stop. My first time on a tram in Manc and aiming to get it back into town too post match\n\nThe hotel bar is big and quite nice so maybe that does the trick this evening unless I particularly want to catch Fulham v Brentford this eve\n\nTyping to look busy now 😂\n\n• TV On?: What’s playing? Any reactions?\n• Soundtrack: Music playing or general noise level\n• Best overheard snippet: (if any)\n\nA CHECK IN\nToday’s Mood in One Word:\nHighlight of the Week:\nOne thing I’m glad is behind me:\nOne thing I’m looking forward to:\n\nCREATIVE CORNER\nYou can rotate between these or include all:\n\nOption A: Short Story Prompt\n\n• Setting: Describe the pub as if it were a scene in a novel\n• Character: Invent a fictional patron—what’s their story?\n• Conflict: What secret are they hiding or what decision are they facing?\n\nOption B: Chapter Builder\n\n• Continue a story each week.• Title of Chapter\n• Scene Summary\n• Dialogue Snippet\n• Cliffhanger or closing line\n\nOption C: AI Collaboration\n\n• Situational Prompt:• “A man walks into this pub carrying a…”\n• “The bartender knows something no one else does…”\n• “Outside, the rain starts just as…”\n\n• You send me the prompt and I write a short story based on it.\n\nCreate a “pub character roster” over time—recurring fictional figures who evolve.\n\nLAST ORDERS\nA final swig reflection:\n\n— — —\n\n[15:24] THE ESSENTIALS\n\nAbsolutely lashing it down.\n\nThe tram was very straightforward just got drenched walking to the ground.\n\nIn over an hour pre kick off but £5.20 not to be sniffed at in a football ground.\n\nTHE MATCH\nMatch:\nPrediction:\nCurrent vibes:\n\nPUB ATMOSPHERE\nCrowd Mood: People using hand dryers in the toilets to try dry off jackets\n\nA large number here early - possibly as they’ve driven.\n\n• TV On?: still no HD screens in the away end but soccer Saturday is on and I can just about make things out without specs on\n\n• Soundtrack: bizarrely there is weird music on instead of the tele sound\n\n• Best overheard snippet: A dad with maybe his son and son’s mate asking if they’ll be too tired to start for their Sunday team tomorrow. Love that - although could tell he wanted him to commit. The son, in an old 90s Commodore shirt, looked sheepish at the thought - hopefully not cos he gets shouted at every week. They settled on him being on the bench.\n\nA few kids here - I can’t wait to take Frey to games but then also I don’t want trips to Old Trafford to feel normal to him. I’ve only done this 5 times and I’m 37. Would the excitement disappear - would he even be excited by it at 14/15? Would they actually rather be doing other things? I guess I only started doing aways when I could drink, when Ben and I would stash cans down the socks on official club coaches etc\n\nA CHECK IN\nToday’s Mood in One Word:\nHighlight of the Week:\nOne thing I’m glad is behind me:\nOne thing I’m looking forward to:\n\nCREATIVE CORNER\nYou can rotate between these or include all:\n\nOption A: Short Story Prompt\n\n• Setting: Describe the pub as if it were a scene in a novel\n• Character: Invent a fictional patron—what’s their story?\n• Conflict: What secret are they hiding or what decision are they facing?\n\nOption B: Chapter Builder\n\n• Continue a story each week.• Title of Chapter\n• Scene Summary\n• Dialogue Snippet\n• Cliffhanger or closing line\n\nOption C: AI Collaboration\n\n• Situational Prompt:• “A man walks into this pub carrying a…”\n• “The bartender knows something no one else does…”\n• “Outside, the rain starts just as…”\n\n• You send me the prompt and I write a short story based on it.\n\nCreate a “pub character roster” over time—recurring fictional figures who evolve.\n\nLAST ORDERS\nA final swig reflection:\n\n— — —\n\n[20:46] Including the Full Review of the day\nTHE MATCH","postNote":"Match: this is now post-match. We got beat 2-1 by Man Utd. Goalkeeper Rob Sanchez sent off after 5 mins and all our attackers subbed off shortly after. Another poor result at old Trafford.  Chelsea not won there since 2013 and I’ve still never seen us win there.\n\nCurrent vibes: Manager not good enough and the goalie / defence too. We risk losing our good attackers as a result. Man Utd are so bad and we keep gifting them points.\n\nPUB ATMOSPHERE\nCrowd Mood: I got my beer and took a seat. A Chelsea fan came in and was chatting to some Australians who had also been at the game. Chelsea lad said they left on 94 mins and paid 70 quid for a cab back into town. Unbelievable. I got out a tad before and legged it for a tram in the rain - it cost £1.40. It’s a 10-15 min drive max. That cabbie is laughing!\n\nChelsea lad’s mates turned up and they were cracking me up. They had been trying to get cash out for gear but no ATMs had any notes in them. They were desperate - at that point where it was night ruined kinda vibes.\n\nJust some great lads chat and banter - no ripping each other - just a good group having a good time\n\nBest overheard snippet: “Fucking hell, we did 3 weeks in Bali without any gear, we can do a night in Manchester”\n\nA CHECK IN\nToday’s Mood in One Word:\nHighlight of the Week:\nOne thing I’m glad is behind me:\nOne thing I’m looking forward to:\n\nCREATIVE CORNER\n🍻 “Rain, Reliance & Robbed at Old Trafford”\n\nManchester greeted me with its signature hospitality: relentless rain and a standing-room-only Mulligans. I’d had visions of settling in with the finest Guinness known to man, watching the early kick-off in quiet reverie. Instead, I found myself at The Lost Dene, bag in tow, half a pint down, and slightly gutted. £5.40 for a Guinness and a seat—fine—but the dream of a slow, solo start had already slipped.\n\nThe pub was filling up with United fans, the kind who arrive early and talk loudly. A small group with London accents played darts—Chelsea, I reckoned. The Merseyside derby was on, commentary humming through the screens, but the pub’s buzz made it feel like 5:30pm already. One of the Chelsea lads read aloud a headline about Starmer introducing digital ID—likely bollocks, but the sort of thing that gets traction in away ends. Somewhere between the pint and the politics, I realised: this was going to be a long day.\n\nI moved next door to The Sawyers Arms for pint two (and three). £6.65 for Guinness, a £1.25 upgrade in price and atmosphere. The crowd was better—less “yellow card” vibes, more football focus. Big cheers when Liverpool scored again. I perched at the bar, patient and observant, before nabbing a stool when the moment came. A small win.\n\nAfter checking in, I headed to The Director’s Box, a starred spot on my map that didn’t quite deliver. £7.25 for a Brixton Reliance and nowhere to sit. England Women’s Rugby on one screen, Soccer Saturday on the others, but no sound—just a bad vocal remix of “Let Me Think About It” pulsing through the room. I leaned against the wall, typing to look busy, watching locals day-drink with admirable commitment despite the downpour. Not the greatest pick, but it was close to the hotel and the tram stop. First tram ride in Manchester—smooth, efficient, and soon to be soaked.\n\nOld Trafford loomed, and so did the weather. Absolutely lashing it down. I arrived over an hour before kick-off, £5.20 Doombar in hand, and joined the masses drying jackets under hand dryers. Soccer Saturday flickered on the away-end screens, still not HD, still barely legible without specs. Weird music played instead of commentary. A dad asked his son and his mate if they’d be too tired to start for their Sunday team. The son, in a vintage Commodore shirt, looked sheepish. They settled on him being on the bench. I smiled. I can’t wait to take Frey to games—but I wonder if the magic fades when it becomes routine. Would he even be excited at 14? Or would it be just another thing?\n\nThe match? A disaster. Chelsea lost 2–1. Rob Sánchez sent off after five minutes. All our attackers subbed off shortly after. United were poor, but we gifted them the points. I’ve now seen us lose on all five visits to Old Trafford. We haven’t won there since 2013. It’s becoming a ritual of disappointment.\n\nPost-match, I retreated to the Motel One hotel bar. £5.50 for a bottle of Manchester Pale Ale—really drinkable, thankfully. A Chelsea fan chatted with some Australians who’d also been at the game. He’d paid £70 for a cab back into town. I’d legged it for the tram in the rain—£1.40. His mates turned up, cracking me up with tales of failed ATM missions and gearless nights. “Fucking hell, we did three weeks in Bali without any gear, we can do a night in Manchester.” Beautiful logic.\n\nThe day was wet, wallet-bruising, and football-frustrating. But it was also full of character, chatter, and the kind of moments that make away days worth it—even when the result doesn’t."},"beers":[{"name":"Guinness","pub":"The Lost Dene - Manchester Deansgate","price":5.4,"qty":1,"id":"b39490"},{"name":"Guinness","pub":"The Sawyers Arms - Deansgate Manchester","price":6.65,"qty":1,"id":"b34529"},{"name":"Brixton Reliance","pub":"The Director’s Box","price":7.25,"qty":1,"id":"b16146"},{"name":"Doombar 500mls at","pub":"Old Trafford","price":5.2,"qty":1,"id":"b66372"},{"name":"J.W Lees","pub":"Motel One - Hotel Bar","price":5.5,"qty":1,"id":"b14257"}]},{"id":"h230","season":"25-26","date":"2025-09-23","dateText":"Tues 23rd Sept","dateConfirmed":true,"opposition":"Lincoln","venue":"A","competition":"Premier League","attending":"none","result":"W","score":"2-1"},{"id":"h231","season":"25-26","date":"2025-09-27","dateText":"Sat 27th Sept","dateConfirmed":true,"opposition":"Brighton","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"1-3","journal":{"title":"","pub":"Hop Pole","mood":"","ambience":null,"withWho":"","body":"Hop Pole has become a bit of a standard first stop before home games now. Can only really do 2 though as then tend to Lime Bike to Parsons Green. May have to change approach when the weather turns again.\n\nTHE MATCH\nMatch: Brighton (h)\nPrediction: 1-1\nCurrent vibes: All the goodwill from CWC and end of last season has disappeared. Especially after last week’s showing at Man Utd.\n\nBig week ahead with Benfica and Liverpool to come. Need to win 2 of the 3 matches really. Riddled with injuries again. Maresca might find himself in bother soon. Amazing how quick it can all turn.\n\n(Result: lost 3-1 having been 1-0 up and a Chalobah red card ruining it all)\n\nPUB ATMOSPHERE\nCrowd Mood: a mix of a few watching Brentford v Ud and golf fans here for the Ryder Cup. Seen an unbearable amount of lads in Utd shirts going to the pub to watch the game, all old enough that they shouldn’t be.\n\nThe Guinness is reliably good here and about a quid cheaper than most Young’s pubs in the area.\n\n• TV On?: Some screens showing golf, some showing the football.\n• Best overheard snippet: Awful golf nerd mansplaining to his mates all things golf and a round they just played. Dull.\n\nA CHECK IN\nToday’s Mood in One Word: Fairly tired - went for a run early doors, but feeling lucky that it’s another Saturday of casual pints, pondering and football.\n\nCREATIVE CORNER\n🍻 “Hop Pole, Hope Lost”\n\nThe Hop Pole has quietly become my home-game launchpad. Two Guinnesses (£6.60 each) and I’m off—Lime Bike to Parsons Green like some sort of tactical midfielder avoiding the press. It’s a reliable setup, though I’ll need a rethink when the weather turns and I’m forced to choose between soggy jeans or the District Line.\n\nInside, the crowd’s a curious blend: Brentford v Udinese on one screen, Ryder Cup on another, and a smattering of United shirts that really shouldn’t be worn past the age of 25 unless you’re on payroll. The Guinness is solid—about a quid cheaper than most Young’s spots nearby—and the atmosphere is just lively enough to feel like matchday without tipping into pre-drinks chaos.\n\nBest overheard snippet? A golf nerd earnestly explaining his round to mates who clearly stopped listening somewhere around “par five.” The kind of mansplaining that makes you wish for a power cut.\n\nMood: fairly tired. Early run in the bank, and now cashing in on the sacred Saturday combo—casual pints, gentle pondering, and the looming dread of football.\n\nMatchday vibes: Brighton at home. Predicted 1–1, which felt optimistic given the post-CWC comedown and last week’s horror show at Old Trafford. The goodwill’s evaporated, the injury list reads like a casualty ward, and Maresca’s seat is warming faster than a Guinness left in the sun. Big week ahead: Benfica, Liverpool, and the creeping sense that we need two wins or we’re back in crisis mode.\n\nResult: Lost 3–1. Took the lead, then Chalobah did a Chalobah and got sent off. Brighton did what Brighton do—pressed, passed, punished. Another home defeat, another away fanbase singing “You’re not special anymore.”\n\nStill, the Guinness was good. The bike didn’t buckle. And for a brief moment, before the red card and the rainclouds, it felt like a proper Saturday.\n\nYou can rotate between these or include all:\n\nOption A: Short Story Prompt\n\n• Setting: Describe the pub as if it were a scene in a novel\n• Character: Invent a fictional patron—what’s their story?\n• Conflict: What secret are they hiding or what decision are they facing?\n\nOption B: Chapter Builder\n\n• Continue a story each week.• Title of Chapter\n• Scene Summary\n• Dialogue Snippet\n• Cliffhanger or closing line\n\nOption C: AI Collaboration\n\n• Situational Prompt:• “A man walks into this pub carrying a…”\n• “The bartender knows something no one else does…”\n• “Outside, the rain starts just as…”\n\n• You send me the prompt and I write a short story based on it.\n\nCreate a “pub character roster” over time—recurring fictional figures who evolve.\n\nLAST ORDERS\nA final swig reflection:","postNote":""},"beers":[{"name":"Guinness","pub":"Hop Pole","price":6.6,"qty":2,"id":"b49907"}]},{"id":"h232","season":"25-26","date":"2025-09-30","dateText":"Tues 30th Sept","dateConfirmed":true,"opposition":"Benfica","venue":"H","competition":"Europe","attending":"going","result":"W","score":"1-0","lps":5.0,"myCost":51.5,"journal":{"title":"","pub":": / Park Tavern","mood":"","ambience":null,"withWho":"","body":"[17:25] THE ESSENTIALS\n\nTHE MATCH\nMatch:\nPrediction:\nCurrent vibes:\n\nPUB ATMOSPHERE\nCrowd Mood: (e.g., rowdy, mellow, tense, cheerful)\n• TV On?: What’s playing? Any reactions?\n• Soundtrack: Music playing or general noise level\n• Best overheard snippet: (if any)\n\nA CHECK IN\nToday’s Mood in One Word:\nHighlight of the Week:\nOne thing I’m glad is behind me:\nOne thing I’m looking forward to:\n\nCREATIVE CORNER\nYou can rotate between these or include all:\n\nOption A: Short Story Prompt\n\n• Setting: Describe the pub as if it were a scene in a novel\n• Character: Invent a fictional patron—what’s their story?\n• Conflict: What secret are they hiding or what decision are they facing?\n\nOption B: Chapter Builder\n\n• Continue a story each week.• Title of Chapter\n• Scene Summary\n• Dialogue Snippet\n• Cliffhanger or closing line\n\nOption C: AI Collaboration\n\n• Situational Prompt:• “A man walks into this pub carrying a…”\n• “The bartender knows something no one else does…”\n• “Outside, the rain starts just as…”\n\n• You send me the prompt and I write a short story based on it.\n\nCreate a “pub character roster” over time—recurring fictional figures who evolve.\n\nLAST ORDERS\nA final swig reflection:\n\n— — —\n\n[17:38] THE ESSENTIALS\n\nCan’t argue with the price and it’s a good pint.\n\nPushing it a bit fine to have one in there. 1 hr 20 to kick off so hopefully the tube is playing ball\n\nDone fairly well in September ‘supporting the pubs...\n\nTHE MATCH\nMatch: Benfica\nPrediction: 0-1\nCurrent vibes: Not great and Jose Mourinho has just become Benfica manager so his first time back at the Bridge for a while.\n\nWe find ourselves pining for a manager as elite as he was\n\nPUB ATMOSPHERE\nCrowd Mood: : A weird church group bursting into song on one occasion. Some regulars\n• TV On?:\n• Soundtrack:\n• Best overheard snippet:\n\nA CHECK IN\nToday’s Mood in One Word:\nHighlight of the Week:\nOne thing I’m glad is behind me:\nOne thing I’m looking forward to:","postNote":""},"beers":[{"name":":","pub":":","price":0,"qty":1,"id":"b24743"},{"name":"Murphy’s","pub":"Park Tavern","price":5.9,"qty":2,"id":"b20556"}]},{"id":"h233","season":"25-26","date":"2025-10-04","dateText":"Sat 4th Oct","dateConfirmed":true,"opposition":"Liverpool","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-1"},{"id":"h234","season":"25-26","date":"2025-10-11","dateText":"Sat 11th Oct","dateConfirmed":true,"opposition":"Forest","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsay","result":"W","score":"3-0","lps":3.0,"othersCost":31.0},{"id":"h235","season":"25-26","date":"2025-10-22","dateText":"Weds 22nd Oct","dateConfirmed":true,"opposition":"Ajax","venue":"H","competition":"Europe","attending":"sourced","attendee":"Tibs","result":"W","score":"5-1","lps":5.0,"othersCost":51.5},{"id":"h236","season":"25-26","date":"2025-10-25","dateText":"Sat 25th Oct","dateConfirmed":true,"opposition":"Sunderland","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"1-2","journal":{"title":"","pub":"Hop Pole","mood":"","ambience":null,"withWho":"","body":"THE MATCH\nMatch: Sunderland (h)\nPrediction: 1-0\nCurrent vibes: Who knows! These are the games we struggle in at the moment but it’d be lovely to go win a home game comfortably for a change. Feels like a long time since gone into one fully confident.\n\nCole Palmer out injured for a little while so others are gona have to step up to break down stubborn deep lying oppo.\n\nSpurs away next week...","postNote":"*Post-match addition*: lost 2-1 in the last minute from being 1-0 down. Pathetic.\n\nPUB ATMOSPHERE\nCrowd Mood: Fairly quiet around 12.30-2, Smell of Thai food floating around and the pub slowly filling up. Great spot for a quiet pint. It works while I’m on the Lime Bikes to the ground but may have to alter plans the further we get into winter and start using the tube to get to The Bridge.\n\n• TV On?: heart music on and then the bar lady realised there was Championship early kick offs so Ipswich v West Brom is on now but ideally we’d have Frank Lampard’s Coventry City on SkySports+! They’re 3-0 up at half time and flying top of the league. Am on the 2nd so off shortly anyway.\n• Soundtrack: Heart music been playing some bangers tbf...\n\nA CHECK IN\nHolly out at Becky / Phoebe’s birthday so mum and dad are on Frey duty at ours while we’re both out.\n\nHighlight of the Week: Had a nice day with Frey on Thursday. He’s been a bit under the weather with an ongoing cold and conjunctivitis but it meant he has been real cuddly.\n\nWork busy but going ok - new marketing director coming in from the 4th Nov which will be interesting. Always nice to get a few pints and pondering in with a 3pm Saturday game today.\n\nOne thing I’m looking forward to: Spurs away next week...\n\nThe write up:\n\nThe Scene\n\nArrived early doors at the Hop Pole—12:30ish—and it was still in its “Thai food and Heart FM” phase. A slow trickle of punters, the faint whiff of lemongrass, and a soundtrack that veered from soft pop to surprisingly decent bangers. The bar lady clocked the early Championship kick-offs and got Ipswich v West Brom on, but if I had my way, it’d be Lampard’s Coventry on SkySports+—3-0 up and top of the league at half-time. Some redemption for the day, at least.\n\nIt’s a cracking spot for a quiet pint pre-match, especially while the Lime Bikes are still viable. Might need to rethink that plan once winter bites and the tube becomes the more frostbite-friendly option to The Bridge.\n\nThe Match\n\nSunderland at home. Predicted 1-0. Hoped for a comfortable win. Got neither.\nCole Palmer’s out for a bit, which meant someone else had to step up to unlock a deep-lying Sunderland side. Garnacho put us  1-0 up  and then—because football is cruel and we are Chelsea they equalised from a ridiculous long throw and then conceded a last-minute winner. Pathetic.\n\nThese are the games we’re meant to win. The ones that build momentum. Instead, they’re becoming the ones that remind us how far off we still are. Spurs away next week. Gulp.\n\nThe Check-In\n\nHolly’s out celebrating Becky/Phoebe’s birthday, so mum and dad are on Frey duty. He’s been under the weather this week—cold and conjunctivitis—but it’s made him extra cuddly, which has been lovely. Had a good day with him Thursday. One of those small wins you cling to when the football lets you down.\n\nWork’s busy but ticking along. New marketing director starts on the 4th Nov, so we’ll see what that stirs up. Always good to get a few pints and some pondering in with a 3pm Saturday game—even if the pondering ends up being more existential than tactical.\n\nLooking Ahead\n\nSpurs away next week.\nLet’s just say: I’m not packing confidence, but I’ll bring hope."},"beers":[{"name":"Guinness","pub":"Hop Pole","price":6.7,"qty":2,"id":"b86736"}]},{"id":"h237","season":"25-26","date":"2025-10-29","dateText":"Weds 29th Oct","dateConfirmed":true,"opposition":"Wolves - Cup","venue":"A","competition":"FA Cup","attending":"none","result":"W","score":"4-3","lps":5.0,"myCost":16.0},{"id":"h238","season":"25-26","date":"2025-11-01","dateText":"Sat 1st Nov","dateConfirmed":true,"opposition":"Spurs","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"1-0","lps":1.0,"myCost":31.0,"journal":{"title":"","pub":"The Marquis - Covent Garden","mood":"","ambience":null,"withWho":"","body":"THE MATCH\nMatch: Spurs (a)\nPrediction: Could be 3-0 either way!\nCurrent vibes: lost 2-1 at home to Sunderland last week. Nearly threw away a 3-0 half time lead to Wolves in the cup midweek. The current vibe is ‘wary’!\n\n*Updated post match: Won 1-0. Battered them, should have won by more. Another great win at Spurs, and all of a sudden things look rosy again!*\n\nPUB ATMOSPHERE\nCrowd Mood: love this place. Came here for the first time before Spurs (a) last season. Got my same spot at the end of the bar. Dangerously close to the ‘no service’ area so I keep getting dirty dishes and glasses coming over ready for the dishwasher. Still the best spot for a solo drinker watching the music.\n\nOlder couples take the limited seating, mods and music lovers meeting as well the odd tourist popping in. And it’s clear who the locals are. A great vibe.\n\nI’m a third of the way through the third pint and it’s def time for a piss but can’t leave the pint! The perils of solo pinting in a busy pub.\n\n• TV On?: they have a big screen showing old comedy shows on silent\n• Soundtrack: Lucca Mae is playing live. Unreal voice. Soulful and Winehousey\nOverheard snippets: two older couples, one set travel down from Northampton just to come to the Marquis (it’s that good) and another live over the road and are here all the time. Genuinely intrigued by people who live this central (how??)\n\nA CHECK IN\nToday’s Mood: Spurs away ain’t it?! Got out early doors to make an arvo off it ahead of the 5.30 kick off. Day could be ruined by 7.30 of course, despite what you do!","postNote":"Here’s your Pint & Ponder entry polished into that signature blend of pub detail, football angst, and post-match relief:\n\n---\n\n🍺 Pint & Ponder: The Marquis, Covent Garden\n\nPub: The Marquis\nPints: 3 x Guinness\nPrice: £7.10 each\nMood: Wary, but hopeful\n\nThe Scene\n\nBack at The Marquis, Covent Garden—same spot at the end of the bar as last season’s Spurs away. It’s dangerously close to the “no service” zone, so dirty dishes and pint glasses keep sliding past me en route to the washer. Still, for a solo drinker, it’s the perfect perch: tucked in, pint in hand, soundtrack rolling.\n\nThe crowd is a mix—older couples guarding the limited seating, mods and music lovers drifting in, tourists popping by, and locals who clearly know this place inside out. It’s got that rare balance of character and comfort.\n\nLucca Mae is playing live this afternoon. Soulful, smoky, Winehouse-esque—her voice fills the room, even over the clatter of glasses. On the big screen, old comedy shows flicker silently, a surreal backdrop to the music. Overheard snippets: one couple travel down from Northampton just to drink here, another live across the road and are regulars. I’m genuinely baffled by people who live this central—how does that work?\n\nBy pint three, the bladder’s calling, but the pint’s too good to abandon. The eternal solo drinker’s dilemma.\n\nThe Match\n\nSpurs away. Prediction: could be 3-0 either way.\nPre-match vibe: wary. Last week’s 2-1 home loss to Sunderland still stings, and nearly throwing away a 3-0 half-time lead to Wolves midweek didn’t help.\n\nPost-match reality: Chelsea 1–0 Spurs.\nWe battered them, should’ve scored more, but another great win at Spurs. Suddenly, things look rosy again. Funny how quickly the mood flips in football—one minute fragile, the next buoyant.\n\nThe Check-In\n\nMade a proper afternoon of it ahead of the 5.30 kick-off. Spurs away always carries that edge: no matter how good the day, it can all be ruined by 7.30. Not this time.\n\nLooking Ahead\n\nMomentum feels back. The Marquis delivered the pints, Chelsea delivered the points. For once, the pondering is pleasant."},"beers":[{"name":"Guinness","pub":"The Marquis - Covent Garden","price":7.1,"qty":3,"id":"b3864"}]},{"id":"h239","season":"25-26","date":"2025-11-05","dateText":"Weds 5th Nov","dateConfirmed":true,"opposition":"Qarabag","venue":"A","competition":"Europe","attending":"none","result":"D","score":"2-2"},{"id":"h240","season":"25-26","date":"2025-11-08","dateText":"Sat 8th Nov","dateConfirmed":true,"opposition":"Wolves","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"3-0"},{"id":"h241","season":"25-26","date":"2025-11-22","dateText":"Sat 22nd Nov","dateConfirmed":true,"opposition":"Burnley","venue":"A","competition":"Premier League","attending":"sourced","attendee":"John","result":"W","score":"2-0","lps":3.0,"othersCost":31.0},{"id":"h242","season":"25-26","date":"2025-11-25","dateText":"Tues 25th Nov","dateConfirmed":true,"opposition":"Barcelona","venue":"H","competition":"Europe","attending":"going","result":"W","score":"3-0","lps":5.0,"myCost":51.5,"journal":{"title":"","pub":"The Hop Pole","mood":"","ambience":null,"withWho":"","body":"Just have to weigh up how many to have here before heading on to The Bridge... 2 or 3 tends to be the sweetspot. It ended up being 3...\n\nFirst update for a while. We played Wolves at The Bridge in between but I caught up with Charlie and Rigo at the Lillie Langtry so no quiet ponderous pints for that one!\n\nTHE MATCH\nMatch: Barcelona (h) CL group stage\nPrediction: 2-2\nCurrent vibes: We’ve not been great but results haven’t been tooo bad recently and we somehow find ourselves in the top 3 in the league. Could do with a few results in the Champs League to secure our passage through. Not an easy run with Barca, Atalanta and Napoli to come.\n\nUpdate post match: we won 3-0! Battered then and Estevao started to look like a star\n\nPUB ATMOSPHERE\nCrowd Mood: 5.30 on a Tuesday when I arrived and it was quiet but slowly filling up with a post-work crowd and no doubt some securing their table to watch the games later\n\nThe Radio was on when I arrived but now a music channel has been put on the teles. It’s Now 00s but currently a song I don’t recognise... “Now that’s what I don’t call music..!”\n\nA CHECK IN\nToday’s Mood: Starting to edge towards December, we’re off to Lille for Holly’s birthday next week, the Christmas Party is next week and before all that I’ve got Barca and Arsenal at the bridge. A lot to look forward to.\n\nHighlight of the Week: A great Monday off with Frey yesterday who is now fully over his Hand, Foot & Mouth. Still only Tuesday though so hopefully the highlights are to come...!\n\nOne thing I’m glad is behind me:\n\nOne thing I’m looking forward to: Some good Chels fixtures & Lille for 48 hrs next week\n\nBlog post:\n🍺 Pint & Ponder: The Hop Pole, Barcelona (h)\n\nPub: The Hop Pole\nPints: 3 x Guinness\nPrice: £6.70 each\nMood: Balancing the sweet spot before The Bridge\n\n---\n\nThe Scene\n\nBack at the Hop Pole, weighing up the eternal pre-match question: two or three? The sweet spot is usually two, but tonight it stretched to three. A quiet start at 5.30 on a Tuesday, the pub slowly filling with post-work drinkers and early birds staking their tables for the evening’s football.\n\nThe radio was on when I arrived, but the teles switched to a music channel—Now 00s. A track I didn’t recognise came on, prompting the thought: Now that’s what I don’t call music.\n\nThe Match\n\nBarcelona at home in the Champions League group stage. Prediction: 2-2.\nPre-match vibes: cautious optimism. Chelsea haven’t been sparkling, but results have kept us in the top three domestically. Europe’s a tougher ask, with Barca, Atalanta, and Napoli lined up.","postNote":"Post-match reality: Chelsea 3–0 Barcelona.\nWe battered them. Estevão looked every inch the star in the making. Nights like this remind you why you endure the slog—when The Bridge roars, and the team delivers, everything feels possible again.\n\nThe Check-In\n\nMood: edging towards December. Lille for Holly’s birthday next week, the Christmas party looming, and Arsenal at The Bridge before all that. Plenty to look forward to.\n\nHighlight of the Week: Monday off with Frey, who’s finally shaken off Hand, Foot & Mouth. He was cuddly, cheerful, and back to himself. Still only Tuesday, so maybe more highlights to come.\n\nOne thing I’m glad is behind me: the lingering worry of Frey’s illness.\nOne thing I’m looking forward to: a run of big Chelsea fixtures and 48 hours in Lille.\n\nClosing Thought\n\nThree ponderous pub pints, three goals, and a glimpse of the future in Estevão. Sometimes the sweet spot stretches just right."},"beers":[{"name":"Guinness","pub":"The Hop Pole","price":6.7,"qty":3,"id":"b68423"}]},{"id":"h243","season":"25-26","date":"2025-11-30","dateText":"Sun 30th Nov","dateConfirmed":true,"opposition":"Arsenal","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"1-1","journal":{"title":"","pub":"The Hop Pole","mood":"","ambience":null,"withWho":"","body":"Mirroring the pre-match routine the senses to work against Barca in the week for the 3-0 win...\n\nTHE MATCH\nMatch: Arsenal (h)\nPrediction: 1-2 defeat\nCurrent vibes: not on the worst run and there are good vibes having battered Barcelona in the week but realistically we’d take the draw. Although we’re long overdue a win against Arsenal","postNote":"Post-match Update: Drew 1-1 but was a great performance until Caicedo got sent off. Went 1-0 up in front of the MHL through a Chalobah header but couldn’t hang on\n\nPUB ATMOSPHERE\nCrowd Mood: No one standing but most tables are taken on a Sunday afternoon with small groups having drinks and watching the football\n• TV On?: I got here for the end of Palace 1-2 Man United and now we’ve got London Reds watching West Ham - Liverpool - 0-0 at time of writing in the first half\n• Soundtrack: Whiney old white men ‘supporting’ Liverpool but sounding like the classic fickle football fan, given they are current Chanpions and just on a bit of a bad run. They’re convinced they’re the worst team ever - pure whining from someone of this age gives me the ick 😂\n\nBest overheard snippet: They also think they know football better than each other - ‘have you read this book...?’ / ‘the thing is it’s much easier to receive the ball in front of you...’ it’s the epitome of an armchair fan cos you can’t talk about how shit the away end is there or anything like that\n\nI almost want them to win to hear them change their tune at the flip of a coin !\n\nA CHECK IN\nToday’s Mood. Wary of the football - looking forward to an early start for Lille tomorrow and Holly’s birthday\nHighlight of the Week: Turning Barcelona over 3-0 was decent. Had two fairly boozy nights on Tues / Weds and don’t think have fully recovered!\n\n---\n\n🍺 Pint & Ponder: The Hop Pole, Arsenal (h)\n\nPub: The Hop Pole\nPints: 3 x Guinness\nPrice: £6.70 each\nMood: Mirroring the Barca routine, hoping for repeat magic\n\nThe Scene\n\nSunday afternoon at the Hop Pole. Tables mostly taken, no one standing, small groups scattered with drinks and football on screens. I arrived just in time to catch the end of Palace 1–2 Man United, before the London Reds settled in for West Ham v Liverpool.\n\nThe soundtrack? Whining. Older blokes “supporting” Liverpool but sounding like caricatures of fickle fandom. Champions not long ago, but now convinced they’re the worst team ever. The moaning, the self-contradiction—it’s pure armchair energy. Best overheard snippet: “Have you read this book…?” / “It’s much easier to receive the ball in front of you…” The kind of pseudo-analysis you can only get when you’ve never stood in an away end. Almost wanted Liverpool to win just to hear the instant flip in tone.\n\nThe Match\n\nArsenal at home. Prediction: 1–2 defeat.\nPre-match vibes: cautious. The Barcelona battering midweek gave us good energy, but Arsenal are overdue victims. A draw would’ve been acceptable.\n\nPost-match reality: Chelsea 1–1 Arsenal.\nWe went ahead through Chalobah’s header in front of the MHL, and for a while it felt like the overdue win was coming. But Caicedo’s red card shifted the balance, and we couldn’t hold on. Still, a great performance—more fight than fragility.\n\nThe Check-In\n\nMood: wary of the football, but buoyed by the week ahead. Early start tomorrow for Lille and Holly’s birthday celebrations.\n\nHighlight of the Week: Turning Barcelona over 3–0. Two boozy nights on Tuesday and Wednesday, still not fully recovered, but worth it.\n\nClosing Thought\n\nThree pints, one point. The Hop Pole routine delivered again, even if the result didn’t. Arsenal remain elusive, but Lille awaits."},"beers":[{"name":"Guinness","pub":"The Hop Pole","price":6.7,"qty":3,"id":"b98115"}]},{"id":"h244","season":"25-26","date":"2025-12-03","dateText":"Weds 3rd Dec","dateConfirmed":true,"opposition":"Leeds","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam","result":"L","score":"1-3","lps":3.0,"othersCost":31.0},{"id":"h245","season":"25-26","date":"2025-12-06","dateText":"Sat 6th Dec","dateConfirmed":true,"opposition":"Bournemouth","venue":"A","competition":"Premier League","attending":"none","result":"D","score":"0-0"},{"id":"h246","season":"25-26","date":"2025-12-09","dateText":"Tues 9th Dec","dateConfirmed":true,"opposition":"Atalanta","venue":"A","competition":"Europe","attending":"none","result":"L","score":"1-2"},{"id":"h247","season":"25-26","date":"2025-12-13","dateText":"Sat 13th Dec","dateConfirmed":true,"opposition":"Everton","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-0","journal":{"title":"","pub":"The Hop Pole","mood":"","ambience":null,"withWho":"","body":"THE MATCH\nMatch: Everton (h)\nPrediction: 0-0\nCurrent vibes: What a difference two weeks makes. We were positive after beating Barca and a good performance against Arsenal. Followed that up with a drab 0-0 at Bournemouth and then chucked a 1-0 lead away at Atalanta, and the mood has plummeted. I’ve not been a fan of Maresca from early doors, which is unusual for me with managers. I’d gladly get rid and see what someone else could do with this squad.\n\nMore often than not, it’s dull to watch and ineffective on top.\n\nPUB ATMOSPHERE\nCrowd Mood:\n• TV On?: Got here about 12.30 and Radio is on\n• Soundtrack:\n• Best overheard snippet:\nCouple of brummie lads just bowled in - think they might be Wolves actually - they’re playing at Arsenal this eve. A lovely 8-hour pre sesh if so. Chatting birds and saying someone’s got hench “don’t know if she’s aiming for hyrox or aesthetics”\n\nOne of his GFs has just turned up with their dog. Can tell they don’t want her there 😂\n\nAh god - now they’re discussing the book ‘The Game’\n\nA CHECK IN\nToday’s Mood in One Word:\nHighlight of the Week: Not a bad week of work as we run up to Xmas. Frey managed about 4 or 5 days clear of illness and has now got a fever again!\n\nOne thing I’m looking forward to: Today is the 13th December so we’re on the run in to Christmas\n\n🍺 Pint & Ponder: The Hop Pole, Everton (h)\n\nPub: The Hop Pole\nPints: 3 x Guinness\nPrice: £6.70 each\nMood: Sliding from cautious optimism into festive fatalism\n\n---\n\nThe Scene\n\nBack at The Hop Pole for another Sunday of self‑inflicted emotional turbulence. Arrived around 12.30 to the radio humming away and a fairly gentle lunchtime crowd. That didn’t last long.\n\nA couple of Brummie lads wandered in — Wolves fans, by the sound of it — gearing up for an eight‑hour pre‑session before Arsenal away this evening. They immediately launched into a conversation about women at the gym: “Don’t know if she’s aiming for Hyrox or aesthetics.” Poetry.\n\nThen one of their girlfriends turned up with a dog, and you could feel the energy shift. The lads clearly didn’t want the dog there. Or her. Or both. Hard to tell.\n\nMoments later, they were discussing The Game. Of course they were. The Hop Pole delivers again.\n\nThe Match\n\nEverton at home. Prediction: 0–0.\nCurrent vibes: bleak. Two weeks ago we were buzzing — Barca battered, Arsenal performance strong. Since then: a drab 0–0 at Bournemouth and a sloppy collapse away at Atalanta. The mood has nosedived.\n\nI’ve not warmed to Maresca from early doors, which is rare for me. Usually I give managers time. But this? It’s dull, predictable, and ineffective. The squad feels better than the football we’re watching.\n\nSometimes you can sense when something isn’t going to click. This feels like that.\n\n(Post‑match update: we won 2-0.)\n\nThe Check-In\n\nToday’s Mood in One Word: Drained\nHighlight of the Week: A decent run at work as we edge toward Christmas. Frey managed four or five days illness‑free before picking up a fever again — the winter nursery cycle continues.\nLooking Forward To: It’s 13 December, so we’re officially on the festive runway. Lights, mulled wine, and the annual attempt to pretend the football can’t hurt me.","postNote":""},"beers":[{"name":"Guinness","pub":"The Hop Pole","price":6.7,"qty":3,"id":"b25304"}]},{"id":"h248","season":"25-26","date":"2025-12-16","dateText":"Tues 16th Dec","dateConfirmed":true,"opposition":"Cardiff","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Ben","result":"W","score":"3-1","lps":5.0,"othersCost":28.0},{"id":"h249","season":"25-26","date":"2025-12-20","dateText":"Sat 20th Dec","dateConfirmed":true,"opposition":"Newcastle","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsay","result":"D","score":"2-2","lps":3.0,"othersCost":31.0},{"id":"h250","season":"25-26","date":"2025-12-27","dateText":"Sat 27th Dec","dateConfirmed":true,"opposition":"Villa","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"1-2"},{"id":"h251","season":"25-26","date":"2025-12-30","dateText":"Tues 30th Dec","dateConfirmed":true,"opposition":"Bournenouth","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"2-2"},{"id":"h252","season":"25-26","date":"2026-01-04","dateText":"Sun 4th Jan","dateConfirmed":true,"opposition":"Man City","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsay","result":"D","score":"1-1","lps":1.0,"othersCost":31.0},{"id":"h253","season":"25-26","date":"2026-01-07","dateText":"Weds 7th Jan","dateConfirmed":true,"opposition":"Fulham","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"1-2","lps":3.0,"myCost":31.0,"journal":{"title":"","pub":"Prince of Wales (East Putney)","mood":"","ambience":null,"withWho":"","body":"THE MATCH\nMatch: Fulham (a)\nPrediction: 2-2\nCurrent vibes:  Maresca just been got rid of as manager. Liam Rosenior announced as the new manager but not in charge yet. Calum MacFarlane (youth manager) is in charge for this as he was for the 1-1 at City a few days ago.\n\nUsually a good atmosphere in the away end here but be interesting to see how it is tonight. We’re winless in something like 7 matches and there’s a lot of discontent around how the club is being managed. A lot of disillusionment with the ‘project’.\n\nA couple of wins very much needed to get back on track otherwise things could turn very sour. I’ve never been Maresca’s biggest fan but it’s clear the problems run deeper than just the coach.\n\nToday is first game of 6 attending in January with Charlton (a) in the cup and a semi final vs Arsenal to come in the next 7 days.","postNote":"*Post-match update*: we lost 2-1. Cucurella stupidly sent off after 22 mins and it was a struggle from there. First vocal unrest from the fans 🎶 “we don’t care about Clearlake, they don’t care about us, all we care about is Chelsea fc...”\n\nPUB ATMOSPHERE\nI got out of work at 4 and straight over to Putney for some food and a few beers. Quiet when I arrived but slowly filled up. Couple sat down right next to me when I was on Pint 2 which felt unnecessarily close... unless I’m sat in their usual spot. Does feel like maybe they’re in regularly...\n\nCrowd Mood:\nMusic is 80s / 90s classics. Found myself foot tapping along to some terrible tunes...\n\nA CHECK IN\nChristmas and new year has been and gone, and this is the first proper full week back in work. Straight back into the thick of it.\n\nA lot going on and a lot of pressure to deliver results but need to channel it as excitement and potential to push the career on a bit with more responsibility.\n\n🍺 Pint & Ponder: Prince of Wales, East Putney — Fulham (a)\n\nPub: Prince of Wales, East Putney\nPints: 2 x London Pride (£6.80), 1 x Guinness (£7.40)\nMood: New year, same chaos\n\n---\n\nThe Scene\n\nStraight out of work at 4 and over to Putney for food and a few pre‑match pints. It was quiet when I arrived — that gentle post‑office lull — but it filled steadily as the hour ticked on.\n\nA couple plonked themselves right next to me during Pint 2. Unnecessarily close. Either I’m in their sacred spot or they’re the kind of couple who treat pub seating like a territorial sport. Judging by the familiarity, I suspect the former.\n\nThe soundtrack was a run of 80s and 90s classics — the kind of tunes you pretend to hate but still find your foot tapping to. Terrible, but effective.\n\nThe Match\n\nFulham away. Prediction: 2–2.\nCurrent vibes: transitional chaos. Maresca finally gone. Liam Rosenior announced but not in charge yet. Calum MacFarlane — the youth manager — taking the reins again after the 1–1 at City.\n\nThe away end here is usually lively, but with seven games without a win and a fanbase increasingly disillusioned with the “project”, tonight felt like a test of patience as much as football.\n\nWe desperately needed a win. Not for the table — for the temperature. Things are close to turning sour, and while I’ve never been Maresca’s biggest fan, it’s obvious the rot runs deeper than the dugout.\n\nFirst of six matches I’m attending in January, with Charlton away in the cup and a semi‑final vs Arsenal looming in the next week. A big month, one way or another.\n\nPost‑match update: Lost 2–1. Cucurella sent off after 22 minutes for a brain‑dead challenge and it was uphill from there. First real vocal unrest from the fans too —\n🎶 “We don’t care about Clearlake, they don’t care about us…”\nA line that hits harder when you’re stood in the away end watching another limp defeat.\n\nThe Check-In\n\nChristmas and New Year have come and gone, and this is the first proper full week back at work. Straight back into the deep end.\n\nThere’s a lot on — pressure, deadlines, expectations — but I’m trying to frame it as opportunity rather than weight. A chance to push on a bit, take more responsibility, and turn the chaos into momentum.\n\n📊 Pints vs Points Tally (Season-to-Date)\n\nI’ll update the running totals once we stitch this into the full season log — but for now, chalk up:\n+3 pints\n0 points\n\nThe ratio continues to lean heavily toward Guinness."},"beers":[{"name":"London Pride","pub":"Prince of Wales (East Putney)","price":6.8,"qty":2,"id":"b96977"},{"name":"Guinness","pub":"Prince of Wales (East Putney)","price":7.4,"qty":1,"id":"b81122"}]},{"id":"h254","season":"25-26","date":"2026-01-10","dateText":"Sat 10th Jan","dateConfirmed":true,"opposition":"Charlton","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"5-1","lps":5.0,"myCost":28.0,"journal":{"title":"","pub":"Horniman at Hays - London Bridge","mood":"","ambience":null,"withWho":"","body":"Had a few beers at home last night and probably should have gone Guinness. There’s still plenty of time for that.\n\nThen went round the corner to the Bunch of Grapes for 2 x Guinness @ ~£7.80\n\nThey were showing\n\nTHE MATCH\nMatch: Charlton (a) FA Cup 3rd Round\nPrediction: 3-1 Chelsea\nCurrent vibes: Rosenior’s first game tonight and hopefully the start of an upward trend.\n\nWill be a tough atmosphere which is something this current squad have struggled with this season. Hopefully can get on the front foot early and quieten the home fans down somewhat.\n\n8pm kick off so I’ve got into town nice and early before a 15 min train out to Charlton","postNote":"*Post-match update* - won 4-0 on a very moody cold evening in south London. A lot of old school Chels seemed to be about and aggressive policing made it all feel like a bit of a throwback. An away end not fit to be at capacity and an open air concourse reminds us how spoilt we are at *most* grounds in the Premier League. A fairly uninspiring performance but job done - a lot of the goals came late - and we’re into the hat for the 4th round.\n\nPUB ATMOSPHERE\nCrowd Mood: busy not mad busy\n\nI’ve actually sat myself outside despite the cold. It’s quiet out here but a lovely few (albeit in the dark) of Tower Bridge and HMS Belfast\n\nA check in\nToday’s Mood in One Word: MildlyHungover  (yes it’s one word)\n\n🍺 Pint & Ponder: Horniman at Hays → Bunch of Grapes, Charlton (a)\n\nPubs:\n• Horniman at Hays, London Bridge\n• Bunch of Grapes, London Bridge\n\nPints:\n• 2 x London Pride @ £7.25\n• 2 x Guinness @ ~£7.80\n\nMood: MildlyHungover (officially one word)\n\n---\n\nThe Scene\n\nA few beers at home last night set the tone, so London Pride probably wasn’t the wisest first move — but there’s always time for Guinness, and the Bunch of Grapes delivered exactly that.\n\nThe Horniman was busy without being chaotic, the kind of steady footfall you get on a cold January evening by the river. I ended up sitting outside despite the temperature — partly for the peace, partly for the view. Even in the dark, Tower Bridge and HMS Belfast have that postcard stillness that makes a pint taste better.\n\nThe Match\n\nCharlton away in the FA Cup 3rd Round. Prediction: 3–1 Chelsea.\nCurrent vibes: cautious optimism. Rosenior’s first game, the start of something new (hopefully), and a chance to reset after a grim run.\n\nAtmosphere was always going to be tough — this squad hasn’t handled hostile environments well this season — but the hope was to get on the front foot early and quieten the home crowd.\n\n8pm kick-off meant getting into town early, a couple of pints by the river, then a short hop out to Charlton.\n\nPost‑match update:\nChelsea won 4–0 on a moody, bitterly cold night in south London. A lot of old‑school Chels were about, and the policing felt… assertive. The away end was cramped, the open‑air concourse freezing — a reminder of how spoilt we are in the Premier League.\n\nThe performance wasn’t exactly thrilling, but the job got done. Most of the goals came late, and we’re into the hat for the 4th round. Sometimes that’s all you need.\n\nPub Atmosphere\n\nInside: steady, warm, and lively enough without being packed.\nOutside: quiet, cold, and scenic — the perfect place to nurse a hangover and a London Pride simultaneously.\n\nThe Check-In\n\nToday’s Mood: MildlyHungover\nGeneral State: First proper week back after Christmas, straight into the deep end. Plenty of pressure, but also plenty of opportunity — the kind of stretch where you can either sink or use the momentum to push the career on a bit."},"beers":[{"name":"London Pride","pub":"Horniman at Hays - London Bridge","price":7.25,"qty":2,"id":"b40471"}]},{"id":"h255","season":"25-26","date":"2026-01-14","dateText":"Weds 14th Jan","dateConfirmed":true,"opposition":"Arsenal","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"2-3","lps":5.0,"myCost":56.0},{"id":"h256","season":"25-26","date":"2026-01-17","dateText":"Sat 17th Jan","dateConfirmed":true,"opposition":"Brentford","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-0"},{"id":"h257","season":"25-26","date":"2026-01-21","dateText":"Weds 21st Jan","dateConfirmed":true,"opposition":"Pafos","venue":"H","competition":"Europe","attending":"sourced","attendee":"Tibs","result":"W","score":"1-0","lps":5.0,"othersCost":51.5},{"id":"h258","season":"25-26","date":"2026-01-25","dateText":"Sun 25th Jan","dateConfirmed":true,"opposition":"Palace","venue":"A","competition":"Premier League","attending":"going","result":"W","score":"3-1","lps":3.0,"myCost":31.0,"journal":{"title":"","pub":"The Ramble Inn","mood":"","ambience":null,"withWho":"","body":"I was disappointed the last time I came here and today has reassured me. By far the best Guinness near us. And they now take card.\n\nThe plan was 1 pint at the ramble before jumping across to the railway but it was so good that I had another.\n\nPints & Price: Murphy’s and a cheeseburger for 11.90 thanks to the City Stack membership Sarah got me for Christmas 👌","postNote":"​*Update: chucked in a bit of post-match action today - managed to jump straight on a train at Thornton Heath so nipped into The Nightingale by Wandsworth Common for one...*​And then popped in The Wandle for 2 Guinness to watch Arsenal lose to Man Utd...Big day in the end !\n\nThe Match\nMatch: Crystal Palace (a)\nPrediction: 1-1\nCurrent vibes: Rosenior has actually started ok results-wise but performances have been lacking. We could really do with both a result and some good intensity today. Crucial champions league game at Napoli ahead of us but our route back in is best done by finishing well in the league. Hoping a strong team gets put out today.\n\nUpdate: won 3-1 - great performance and good away end.\n\nPUB ATMOSPHERE\nCrowd Mood:\n• TV On?:\n• Soundtrack:\n• Best overheard snippet:\n\nA CHECK IN\nToday’s Mood in One Word:\nHighlight of the Week:\nOne thing I’m glad is behind me:\nOne thing I’m looking forward to:\n\n🍺 Pint & Ponder: The Ramble Inn → The Railway → The Nightingale → The Wandle\n\nMatch: Crystal Palace (a)\nPrediction: 1–1\nResult: Chelsea won 3–1\n\n---\n\nThe Essentials\n\nPub 1: The Ramble Inn\n\nPints: 2 x Guinness\nPrice: £5.50 (cash only… until now)\n\nReturned with low expectations after being disappointed last time — and was immediately proven wrong. Easily the best Guinness anywhere near home, and they’ve finally joined the 21st century by taking card.\n\nThe plan was one pint before heading to The Railway. The pint was too good. The plan dissolved. Another Guinness was inevitable.\n\nPub 2: The Railway (Streatham)\n\nPints: 1 x Murphy’s\nFood: Cheeseburger\nPrice: £11.90 with the City Stack membership Sarah got me for Christmas 👌\n\nA tactical switch from Guinness to Murphy’s, plus a cheeseburger that hit the spot. A proper pre‑match base layer.\n\nPost‑Match Bonus Round\n\nCaught a train straight from Thornton Heath and somehow ended up on a mini pub crawl:\n\n• The Nightingale (Wandsworth Common): 1 pint\n• The Wandle: 2 x Guinness while watching Arsenal lose to Man United\n\nA big day. A very big day.\n\nThe Match\n\nCrystal Palace away. Prediction: 1–1.\nCurrent vibes: cautiously hopeful. Rosenior’s results have been decent, but performances still feel a bit flat. With Napoli looming in the Champions League, this felt like a game where intensity mattered as much as points.\n\nPost‑match: Chelsea won 3–1.\nA genuinely strong performance and a lively away end. Exactly the kind of afternoon that makes the cold, the travel, and the emotional investment feel worth it."},"beers":[{"name":"Guinness","pub":"The Ramble Inn","price":5.5,"qty":2,"id":"b1696"}]},{"id":"h259","season":"25-26","date":"2026-01-28","dateText":"Weds 28th Jan","dateConfirmed":true,"opposition":"Napoli","venue":"A","competition":"Europe","attending":"none","result":"W","score":"3-2"},{"id":"h260","season":"25-26","date":"2026-01-31","dateText":"Sat 31st Jan","dateConfirmed":true,"opposition":"West Ham","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"3-2","journal":{"title":"","pub":"The Hop Pole","mood":"","ambience":null,"withWho":"","body":"THE MATCH\nMatch: West Ham (h)\nPrediction: 2-2\nCurrent vibes: won 5 out of 6 under Rosenior now but you lean towards pessimism and you feel there’s still goals to be had against us. West Ham have been dire this season but picking up a little and it’s a London derby...\n\nNeed to balance the squad having just come back from Napoli and got Arsenal on Tues I the semi final of carabao 2nd leg\n\nWhen the team gets weakened the drop off has been noticeable recently. Let’s see...","postNote":"*Post-match update* - Won 3-2 in the last minute, turning round a 0-2 half time deficit. Enzo Fernandez with a Lampard style winner in front of the Matthew Harding. Class.\n\nPUB ATMOSPHERE\nCrowd Mood:\n• TV On?: soccer Saturday on mute\n• Soundtrack: great country playlist when came in but has moved on to dreadful synthy r&b\n• Best overheard snippet: there’s a group that were already hooped when I arrived at 2.45 singing along to the country - great vibes\n\nA CHECK IN\nToday’s Mood in One Word:\nHighlight of the Week:\nOne thing I’m glad is behind me:\nOne thing I’m looking forward to:\n\n🍺 Pint & Ponder: The Hop Pole — West Ham (h)\n\nPub: The Hop Pole\nPints: 3 x Guinness\nPrice: £6.70 each\nMood: Quietly pessimistic, loudly caffeinated by stout\n\n---\n\nThe Scene\n\nBack at the Hop Pole for another pre‑match ritual. Soccer Saturday on mute, a great country playlist drifting through the speakers when I arrived — the kind of toe‑tapping Americana that makes a Guinness taste even better — before it abruptly shifted into dreadful synthy R&B. A real gear change.\n\nA group were already absolutely hooped by 2.45, belting out the country tunes with full chest. Proper Saturday energy. The kind of group you know will either be asleep or in a police van by 10pm.\n\nThe Match\n\nWest Ham at home. Prediction: 2–2.\nCurrent vibes: cautiously pessimistic. Rosenior has won 5 of 6, but you still feel there are goals to be had against us. West Ham have been dire but are picking up slightly, and it’s a London derby — never straightforward.\n\nThe real challenge: balancing the squad. Napoli away just happened, Arsenal in the Carabao semi‑final second leg is on Tuesday, and whenever the team gets rotated the drop‑off has been obvious.\n\nPost‑match update:\nChelsea 3–2 West Ham.\nA ridiculous turnaround — 0–2 down at half‑time, then a last‑minute winner from Enzo Fernández, Lampard‑style, in front of the Matthew Harding. Absolute limbs. One of those wins that feels bigger than the scoreline.\n\nPub Atmosphere\n\nCrowd Mood: lively but not chaotic\nTV: Soccer Saturday on mute\nSoundtrack:\n\n• Started: great country playlist\n• Ended: synthy R&B that felt like a punishment\nBest overheard: the already‑steaming group singing along to the country tunes like they were at the O2."},"beers":[{"name":"Guinness","pub":"The Hop Pole","price":6.7,"qty":3,"id":"b76035"}]},{"id":"h261","season":"25-26","date":"2026-02-03","dateText":"Tues 3rd Feb","dateConfirmed":true,"opposition":"Arsenal","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"0-1","lps":5.0,"myCost":39.0},{"id":"h262","season":"25-26","date":"2026-02-07","dateText":"Sat 7th Feb","dateConfirmed":true,"opposition":"Wolves","venue":"A","competition":"Premier League","attending":"none","result":"W","score":"3-1"},{"id":"h263","season":"25-26","date":"2026-02-10","dateText":"Tues 10th Feb","dateConfirmed":true,"opposition":"Leeds","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"2-2"},{"id":"h264","season":"25-26","date":"2026-02-13","dateText":"Fri 13th Feb","dateConfirmed":true,"opposition":"Hull","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Sam Ramsay","result":"W","score":"4-0","lps":5.0,"othersCost":30.0},{"id":"h265","season":"25-26","date":"2026-02-21","dateText":"Sat 21st Feb","dateConfirmed":true,"opposition":"Burnley","venue":"H","competition":"Premier League","attending":"going","result":"D","score":"1-1","journal":{"title":"","pub":"The Hop Pole","mood":"","ambience":null,"withWho":"","body":"2nd Pub Name: The Queen Adelaide\nPint & Price: 1 x Guinness @ £7.70\n\nHad to get out of the Hop Pole! Was really filling out and ruining the vibe - even with the prices going up at The Hop - here is still 60p more expensive 👀\n\nTHE MATCH\nMatch: Burnley (h)\nPrediction: an uninspiring but solid 2-0\nCurrent vibes: Rosenior has done ok since coming in and results largely been ok but we threw away a 2-0 lead to draw 2-2 against Leeds last time out.\n\nPUB ATMOSPHERE\nCrowd Mood:\n• TV On?: It’s England - Ireland rugby today and I’m the only Englishman in here! Still a while until that kicks off but it’s filling out. Interesting to see if the price of a pint has gone up for the rugby or just generally...\n\nI was hoping they might have Frank Lampard’s Coventry City on the tele in the early kick off but RTE has been on the screens since I got in!\n\nGoing to move on after this one...\n\nA CHECK IN\nGood - Dad’s in the away end today so planning to meet him at The Duke after the match. May well be 5 pints deep by then...","postNote":""},"beers":[{"name":"Guinness","pub":"The Hop Pole","price":7.1,"qty":2,"id":"b59683"}]},{"id":"h266","season":"25-26","date":"2026-03-01","dateText":"Sun 1st March","dateConfirmed":true,"opposition":"Arsenal","venue":"A","competition":"Premier League","attending":"going","result":"L","score":"1-2","lps":1.0,"myCost":31.0,"journal":{"title":"","pub":"Anspach & Hobday Tap Room - Bermondsey","mood":"","ambience":null,"withWho":"","body":"The Two Bridges - London Bridge @ £6.95\n\nTube to Angel and walked up to\n\nThe Foxglove - 2 Guinness @ £6.90\n\nNo pints above 7 quid feels like a result these days (until the ground)\n\nTHE MATCH\nMatch: Arsenal (a)\nPrediction: 3-0\nCurrent vibes: Arsenal were wobbling a bit. If we can leave unbeaten, it’d be a good dent in their title charge. Feel like we might just get easily rolled though. Chels are back to being frustrating and throwing easy points away\n\nPUB ATMOSPHERE\nCrowd Mood: Anspach\n: Quiet but a few small groups\nThey don’t have the Ordinary Bitter on tap which is a shame\n•\n• Soundtrack: I thought it was Ludovici Einaudi but think it’s actually just piano covers!\n\nWent on the two bridges which was on the walk back to London Bridge tube. Weird pub, weird crowd but two games on the screens.\n\nHad one and left to get the tube to Angel\n\nWalked up and returned to The Foxglove where we came the other week. Nicer in the dark tbf but still a nice pub.\n\nA CHECK IN\nToday’s Mood in One Word:\nHighlight of the Week:\nOne thing I’m glad is behind me:\nOne thing I’m looking forward to:","postNote":""},"beers":[{"name":"London Black","pub":"Anspach & Hobday Tap Room - Bermondsey","price":6.75,"qty":1,"id":"b53755"}]},{"id":"h267","season":"25-26","date":"2026-03-04","dateText":"Weds 4th March","dateConfirmed":true,"opposition":"Villa","venue":"A","competition":"Premier League","attending":"sourced","attendee":"Josh (Twitter)","result":"W","score":"4-1","lps":3.0,"othersCost":31.0},{"id":"h268","season":"25-26","date":"2026-03-07","dateText":"Sat 7th March","dateConfirmed":true,"opposition":"Wrexham","venue":"A","competition":"Premier League","attending":"none","result":"W"},{"id":"h269","season":"25-26","date":"2026-03-11","dateText":"Weds 11th March","dateConfirmed":true,"opposition":"PSG","venue":"A","competition":"Europe","attending":"none","result":"L","score":"2-5"},{"id":"h270","season":"25-26","date":"2026-03-14","dateText":"Sat 14th March","dateConfirmed":true,"opposition":"Newcastle","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"0-1"},{"id":"h271","season":"25-26","date":"2026-03-17","dateText":"Tues 17th March","dateConfirmed":true,"opposition":"PSG","venue":"H","competition":"Europe","attending":"going","result":"L","score":"0-3","myCost":67.0},{"id":"h272","season":"25-26","date":"2026-03-21","dateText":"Sat 21st March","dateConfirmed":true,"opposition":"Everton","venue":"A","competition":"Premier League","attending":"none","result":"L","score":"0-3"},{"id":"h273","season":"25-26","date":"2026-04-04","dateText":"Sat 4th April","dateConfirmed":true,"opposition":"Port Vale","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"7-0","lps":5.0},{"id":"h274","season":"25-26","date":"2026-04-12","dateText":"Sun 12th April","dateConfirmed":true,"opposition":"Man City","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"0-3"},{"id":"h275","season":"25-26","date":"2026-04-18","dateText":"Sat 18th April","dateConfirmed":true,"opposition":"Man Utd","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"0-1"},{"id":"h276","season":"25-26","date":"2026-04-21","dateText":"Tues 21st April","dateConfirmed":true,"opposition":"Brighton","venue":"A","competition":"Premier League","attending":"none","result":"L","score":"1-4"},{"id":"h277","season":"25-26","date":"2026-04-26","dateText":"Sun 26th April","dateConfirmed":true,"opposition":"Leeds","venue":"N","competition":"Premier League","attending":"going","result":"W","score":"1-0"},{"id":"h278","season":"25-26","date":"2026-05-04","dateText":"Mon 4th May","dateConfirmed":true,"opposition":"Forest","venue":"H","competition":"Premier League","attending":"going","result":"L","score":"0-3"},{"id":"h279","season":"25-26","date":"2026-05-09","dateText":"Sat 9th May","dateConfirmed":true,"opposition":"Liverpool","venue":"A","competition":"Premier League","attending":"none","result":"D","score":"1-1","lps":1.0},{"id":"h280","season":"25-26","date":"2026-05-16","dateText":"Sat 16th May","dateConfirmed":true,"opposition":"City - Cup Final","venue":"A","competition":"FA Cup","attending":"going","result":"L","score":"0-1","myCost":126.0,"journal":{"title":"","pub":"Devonshire","mood":"","ambience":null,"withWho":"","body":"Pint / price: Guinness @ £7.20\n\nPub: Red Lion - Duke of York St\nPint: London Pride @ £6.65\n\nPub: Audley Public House\nPint: London Pride @ £7.35\n\nPub: The Marlborough\nPint: Guinness @ £7.35\n\nTHE MATCH\nMatch: FA Cup Final - Man City @ Wembley\nPrediction: I think it’ll be a close defeat - 1-2\nCurrent vibes: It’s been another shambolic season in the end, but we find ourselves in a cup final still 😅\n\nGot battered 3-0 by them at The Bridge a few weeks back but we have a habit of turning up in these games. Equally, we’re well capable of conceding early and getting battered!","postNote":"*post-match update*: Lost 1-0 to a very good goal by Semenyo. We were ok given how we have been playing but shouldn’t leave a cup final with a feeling of acceptance when we’ve spent ~2bn in 5 years.\n\nPUB ATMOSPHERE\nCrowd Mood: Strange morning in London today with both Tommy Robinson and pro-Palestine marches meaning huge police presence. I tried to go Regency Cafe for breakfast but couldn’t get in. Ended up at Queen Street Cafe before walking up to Piccadilly.\n\nDevonshire - I got there 9 mins after opening and all seats taken already. A good pint but not all it’s cracked up to be. Standing room so got it down and moved on.\n\nRed Lion - small pub and again standing room only at 11.30ish! Nice vibes, friendly landlady and a 6/10 London Pride. Nice traditional old London pub, the sort that don’t survive out of central.\n\nAudley - a great pub. A slightly better 7/10 London Pride, and I’ve actually got a seat. A mix of crowds. 3 tourists have sat down next to me and ordered fish and chips - people here for the true British experience!\n\nThe good thing with pubs in town is that no one blinks an eye at early-in-the-day beers but also it’s hard to find a quiet spot to sit and enjoy your beer. More tourists eating food and drinking coffee etc. At the moment, it doesn’t massively feel like I’m going to football 😅\n\nMarlborough - Celtic v Hearts title decider on the tele although still only small percentage of punters seem to be football crowd. Some strange folk about tbh.\n\nA decent Guinness that’s a similar level to the Devonshire tbh. Reckon I’ll be on my way after this one and get one in the ground."},"beers":[{"name":"price: Guinness","pub":"Devonshire","price":7.2,"qty":1,"id":"b90413"}]},{"id":"h281","season":"25-26","date":"2026-05-17","dateText":"Sun 17th May","dateConfirmed":true,"opposition":"Spurs","venue":"H","competition":"Premier League","attending":"going","result":"W","score":"2-1","journal":{"title":"","pub":"Bricklayers Arms - Putney","mood":"","ambience":null,"withWho":"","body":"THE MATCH\nMatch: Spurs (h)\nPrediction: 1-1\nCurrent vibes: Last home game of the season. Spurs need a point from the next two games to stay up.\n\nChelsea are 3 days on from a cup final defeat at Wembley.\nIt feels like one team will be bang up for it and the other a little worn down and ready for the season to be over. Especially with so many due to go to the World Cup this summer.\n\nIn 38 years, I’ve never seen Spurs beat us at The Bridge in the flesh...","postNote":"*Post-Match Update* - and the wait goes on! Chelsea won 2-1 keeping spurs in relegation fight on last day of season\n\nPUB ATMOSPHERE\nCrowd Mood: semi-busy all seats taken kind of vibe\n\n• Soundtrack: very quiet playlist of classics on. Like good classics\n\nA CHECK IN\nToday’s Mood in One Word:\nHighlight of the Week:\nOne thing I’m glad is behind me:\nOne thing I’m looking forward to:"},"beers":[{"name":"Beamish","pub":"Bricklayers Arms - Putney","price":7.0,"qty":3,"id":"b19521"}]},{"id":"h282","season":"25-26","date":"2026-05-24","dateText":"Sun 24th May","dateConfirmed":true,"opposition":"Sunderland","venue":"A","competition":"Premier League","attending":"none","result":"L","score":"1-2"},{"id":"ps1","season":"26-27","date":"2026-08-15","dateConfirmed":true,"kickoff":"14:00","opposition":"Real Sociedad","venue":"H","competition":"Friendly","attending":"going","lps":6.0,"myCost":30.0},{"id":"n1","season":"26-27","date":"2026-08-24","dateConfirmed":true,"kickoff":"20:00","broadcaster":"Sky Sports","opposition":"Fulham","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n2","season":"26-27","date":"2026-08-30","dateConfirmed":true,"kickoff":"14:00","broadcaster":"Sky Sports","opposition":"Brighton","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n3","season":"26-27","date":"2026-09-06","dateConfirmed":true,"kickoff":"16:30","broadcaster":"Sky Sports","opposition":"Arsenal","venue":"A","competition":"Premier League","attending":"none","lps":1},{"id":"n4","season":"26-27","date":"2026-09-12","dateConfirmed":true,"kickoff":"15:00","opposition":"Hull","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n5","season":"26-27","date":"2026-09-18","dateConfirmed":true,"kickoff":"20:00","broadcaster":"Sky Sports","opposition":"Brentford","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n6","season":"26-27","date":"2026-10-10","dateConfirmed":false,"opposition":"Bournemouth","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n7","season":"26-27","date":"2026-10-17","dateConfirmed":false,"opposition":"Everton","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n8","season":"26-27","date":"2026-10-24","dateConfirmed":false,"opposition":"Spurs","venue":"H","competition":"Premier League","attending":"going","lps":1},{"id":"n9","season":"26-27","date":"2026-10-31","dateConfirmed":false,"opposition":"Man Utd","venue":"H","competition":"Premier League","attending":"going","lps":1},{"id":"n10","season":"26-27","date":"2026-11-07","dateConfirmed":false,"opposition":"Sunderland","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n11","season":"26-27","date":"2026-11-21","dateConfirmed":false,"opposition":"Leeds","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n12","season":"26-27","date":"2026-11-28","dateConfirmed":false,"opposition":"Forest","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n13","season":"26-27","date":"2026-12-02","dateConfirmed":false,"opposition":"Palace","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n14","season":"26-27","date":"2026-12-05","dateConfirmed":false,"opposition":"Liverpool","venue":"H","competition":"Premier League","attending":"going","lps":1},{"id":"n15","season":"26-27","date":"2026-12-12","dateConfirmed":false,"opposition":"Man City","venue":"A","competition":"Premier League","attending":"none","lps":1},{"id":"n16","season":"26-27","date":"2026-12-19","dateConfirmed":false,"opposition":"Villa","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n17","season":"26-27","date":"2026-12-26","dateConfirmed":false,"opposition":"Coventry","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n18","season":"26-27","date":"2026-12-30","dateConfirmed":false,"opposition":"Ipswich","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n19","season":"26-27","date":"2027-01-02","dateConfirmed":false,"opposition":"Newcastle","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n20","season":"26-27","date":"2027-01-06","dateConfirmed":false,"opposition":"Palace","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n21","season":"26-27","date":"2027-01-16","dateConfirmed":false,"opposition":"Sunderland","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n22","season":"26-27","date":"2027-01-23","dateConfirmed":false,"opposition":"Leeds","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n23","season":"26-27","date":"2027-01-30","dateConfirmed":false,"opposition":"Forest","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n24","season":"26-27","date":"2027-02-06","dateConfirmed":false,"opposition":"Man Utd","venue":"A","competition":"Premier League","attending":"none","lps":1},{"id":"n25","season":"26-27","date":"2027-02-10","dateConfirmed":false,"opposition":"Newcastle","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n26","season":"26-27","date":"2027-02-20","dateConfirmed":false,"opposition":"Ipswich","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n27","season":"26-27","date":"2027-02-27","dateConfirmed":false,"opposition":"Villa","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n28","season":"26-27","date":"2027-03-03","dateConfirmed":false,"opposition":"Coventry","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n29","season":"26-27","date":"2027-03-13","dateConfirmed":false,"opposition":"Arsenal","venue":"H","competition":"Premier League","attending":"going","lps":1},{"id":"n30","season":"26-27","date":"2027-03-20","dateConfirmed":false,"opposition":"Hull","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n31","season":"26-27","date":"2027-04-10","dateConfirmed":false,"opposition":"Fulham","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n32","season":"26-27","date":"2027-04-17","dateConfirmed":false,"opposition":"Brighton","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n33","season":"26-27","date":"2027-04-24","dateConfirmed":false,"opposition":"Man City","venue":"H","competition":"Premier League","attending":"going","lps":1},{"id":"n34","season":"26-27","date":"2027-05-01","dateConfirmed":false,"opposition":"Liverpool","venue":"A","competition":"Premier League","attending":"none","lps":1},{"id":"n35","season":"26-27","date":"2027-05-08","dateConfirmed":false,"opposition":"Spurs","venue":"A","competition":"Premier League","attending":"none","lps":1},{"id":"n36","season":"26-27","date":"2027-05-15","dateConfirmed":false,"opposition":"Everton","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"n37","season":"26-27","date":"2027-05-23","dateConfirmed":false,"opposition":"Bournemouth","venue":"A","competition":"Premier League","attending":"none","lps":3},{"id":"n38","season":"26-27","date":"2027-05-30","dateConfirmed":false,"opposition":"Brentford","venue":"H","competition":"Premier League","attending":"going","lps":3},{"id":"c1","season":"26-27","date":"2026-08-26","dateConfirmed":false,"opposition":"Round 2","competition":"League Cup","attending":"none","lps":5},{"id":"c2","season":"26-27","date":"2026-09-09","dateConfirmed":false,"opposition":"Round 3","competition":"League Cup","attending":"none","lps":5},{"id":"c3","season":"26-27","date":"2026-10-28","dateConfirmed":false,"opposition":"Round 4","competition":"League Cup","attending":"none","lps":5},{"id":"c4","season":"26-27","date":"2026-12-16","dateConfirmed":false,"opposition":"Quarter-final","competition":"League Cup","attending":"none","lps":5},{"id":"c5","season":"26-27","date":"2027-01-13","dateConfirmed":false,"opposition":"Semi-final 1st leg","competition":"League Cup","attending":"none","lps":5},{"id":"c6","season":"26-27","date":"2027-02-03","dateConfirmed":false,"opposition":"Semi-final 2nd leg","competition":"League Cup","attending":"none","lps":5},{"id":"c7","season":"26-27","date":"2027-03-21","dateConfirmed":false,"opposition":"Final","venue":"N","competition":"League Cup","attending":"none","lps":0},{"id":"c8","season":"26-27","date":"2027-01-09","dateConfirmed":false,"opposition":"Round 3","competition":"FA Cup","attending":"none","lps":5},{"id":"c9","season":"26-27","date":"2027-02-13","dateConfirmed":false,"opposition":"Round 4","competition":"FA Cup","attending":"none","lps":5},{"id":"c10","season":"26-27","date":"2027-03-06","dateConfirmed":false,"opposition":"Round 5","competition":"FA Cup","attending":"none","lps":5},{"id":"c11","season":"26-27","date":"2027-04-03","dateConfirmed":false,"opposition":"Quarter-final","competition":"FA Cup","attending":"none","lps":5},{"id":"c12","season":"26-27","date":"2027-04-24","dateConfirmed":false,"opposition":"Semi-final","venue":"N","competition":"FA Cup","attending":"none","lps":0},{"id":"c13","season":"26-27","date":"2027-05-22","dateConfirmed":false,"opposition":"Final","venue":"N","competition":"FA Cup","attending":"none","lps":0}]/*SEED_END*/;

/* ============================== STORAGE ============================== */
const KEY = "cfc:matchday:v2";
const APP_VERSION = "2.5 (22 Oct 2026)";
const SEED_VERSION = 10;
// Confirmed Aug–Sep 2026 TV selections. Applied once (via the tvPatch2627 flag) so an
// already-published copy gets the new dates/kick-offs/broadcasters without wiping any
// results, journals or "attending" choices already logged against these games.
const FIXTURE_PATCHES = {
  n1: { date: "2026-08-24", kickoff: "20:00", broadcaster: "Sky Sports", dateConfirmed: true },
  n2: { date: "2026-08-30", kickoff: "14:00", broadcaster: "Sky Sports", dateConfirmed: true },
  n3: { date: "2026-09-06", kickoff: "16:30", broadcaster: "Sky Sports", dateConfirmed: true },
  n4: { date: "2026-09-12", kickoff: "15:00", dateConfirmed: true },
  n5: { date: "2026-09-18", kickoff: "20:00", broadcaster: "Sky Sports", dateConfirmed: true },
};
// Cup ties that were logged as "Premier League" in earlier seasons. Re-tagged once
// (via the compFix1 flag) so the league table, projection and stats stop counting cup
// games as league games. Only these exact ids are touched — nothing else moves, and
// results, journals and costs are all left alone.
const COMP_PATCHES = {
  // 21/22 — League Cup run to the final, plus the Chesterfield FA Cup tie
  h8: "League Cup", h15: "League Cup", h28: "League Cup", h32: "League Cup", h34: "League Cup",
  h33: "FA Cup",
  // 22/23
  h88: "FA Cup",
  // 23/24 — League Cup run to the final, plus the Leicester FA Cup quarter
  h117: "League Cup", h121: "League Cup", h126: "League Cup", h134: "League Cup",
  h139: "League Cup", h141: "League Cup", h152: "FA Cup",
  // 24/25
  h172: "League Cup", h179: "League Cup", h195: "FA Cup", h200: "FA Cup",
  // 25/26 — League Cup run to the Arsenal semi, and the FA Cup run to Wembley
  h230: "League Cup", h237: "League Cup", h248: "League Cup", h255: "League Cup", h261: "League Cup",
  h254: "FA Cup", h264: "FA Cup", h268: "FA Cup", h273: "FA Cup", h277: "FA Cup",
};
// Typos in the original spreadsheet import.
const NAME_PATCHES = { h251: "Bournemouth" };

// Beers you order often enough that typing them out every time is a chore.
const DEFAULT_BEERS = ["Guinness", "Murphy's", "London Pride"];
const DEFAULT_PUBS = ["The Hop Pole", "The Duke on The Green"];
const DEFAULT_MATES = ["Charlie", "George", "Rigo"];
// A different list to the pub one — the ground bar has its own small range — but starting
// it empty was a mistake: it left nothing to tap on the first matchday. Seeded with the
// usual suspects instead, and anything not actually on sale can be pruned via Edit.
const DEFAULT_GROUND_BEERS = ["Guinness", "Camden Hells", "Doom Bar"];

// Real Chelsea outcomes, pre-filled (editable per season)
const DEFAULT_PERF = {
  "21-22": { leaguePos: "3rd", faCup: "Runners-up — lost final to Liverpool (pens)", leagueCup: "Runners-up — lost final to Liverpool (pens)", europe: "CL quarter-finals (Real Madrid); won Club World Cup & Super Cup" },
  "22-23": { leaguePos: "12th", faCup: "Third round — out to Man City", leagueCup: "Third round — out to Man City (0-2)", europe: "CL quarter-finals (Real Madrid)" },
  "23-24": { leaguePos: "6th", faCup: "Semi-finals — out to Man City (0-1)", leagueCup: "Runners-up — lost final to Liverpool (0-1 AET)", europe: "Not in Europe" },
  "24-25": { leaguePos: "4th", faCup: "", leagueCup: "", europe: "Conference League winners — beat Real Betis 4-1" },
  "25-26": { leaguePos: "10th", faCup: "Runners-up — lost final to Man City (0-1)", leagueCup: "Early-round exit", europe: "CL last 16 — out to PSG" },
};
const mem = {};
// Storage has three tiers, tried in order of durability:
// 1. window.storage — Claude's cross-session store (present only inside Claude)
// 2. localStorage — the device's own drawer (used when self-hosted / installed to a phone)
// 3. mem — in-memory last resort so the app never hard-crashes (e.g. private browsing)
// Inside Claude we stick to window.storage and never touch localStorage, so the
// artifact sandbox is left completely alone.
const hasWinStore =
  typeof window !== "undefined" && window.storage && typeof window.storage.get === "function";
let localOK = false;
if (!hasWinStore && typeof window !== "undefined") {
  try { window.localStorage.setItem("__ml_probe", "1"); window.localStorage.removeItem("__ml_probe"); localOK = true; }
  catch (e) { localOK = false; }
}

async function storeGet(key) {
  if (hasWinStore) {
    try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
    catch (e) { return mem[key] ?? null; }
  }
  if (localOK) {
    try { const r = window.localStorage.getItem(key); if (r) return JSON.parse(r); }
    catch (e) {}
  }
  return mem[key] ?? null;
}
async function storeSet(key, val) {
  mem[key] = val;
  if (hasWinStore) { try { await window.storage.set(key, JSON.stringify(val)); } catch (e) {} return; }
  if (localOK) { try { window.localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
}

/* ---- Photo highlights: stored in IndexedDB, deliberately kept OUT of the main
   {fixtures,settings} blob so images can never bloat or break core data. Every
   call is guarded so if IndexedDB is missing the app just carries on without it. ---- */
const PHOTO_DB = "same-again-photos";
const PHOTO_STORE = "photos";
const idbOK = typeof window !== "undefined" && !!window.indexedDB;
function idbOpen() {
  return new Promise((resolve, reject) => {
    if (!idbOK) return reject(new Error("no-idb"));
    const req = window.indexedDB.open(PHOTO_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        const os = db.createObjectStore(PHOTO_STORE, { keyPath: "id" });
        os.createIndex("season", "season", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function photosForSeason(season) {
  try {
    const db = await idbOpen();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE, "readonly");
      const cur = tx.objectStore(PHOTO_STORE).index("season").openCursor(IDBKeyRange.only(season));
      const out = [];
      cur.onsuccess = (e) => { const c = e.target.result; if (c) { out.push(c.value); c.continue(); } else resolve(out.sort((a, b) => a.ts - b.ts)); };
      cur.onerror = () => reject(cur.error);
    });
  } catch (e) { return []; }
}
async function photoPut(photo) { try { const db = await idbOpen(); return await new Promise((res, rej) => { const tx = db.transaction(PHOTO_STORE, "readwrite"); tx.objectStore(PHOTO_STORE).put(photo); tx.oncomplete = () => res(true); tx.onerror = () => rej(tx.error); }); } catch (e) { return false; } }
async function photoDelete(id) { try { const db = await idbOpen(); return await new Promise((res) => { const tx = db.transaction(PHOTO_STORE, "readwrite"); tx.objectStore(PHOTO_STORE).delete(id); tx.oncomplete = () => res(true); tx.onerror = () => res(false); }); } catch (e) { return false; } }
async function photosAll() { try { const db = await idbOpen(); return await new Promise((res, rej) => { const req = db.transaction(PHOTO_STORE, "readonly").objectStore(PHOTO_STORE).getAll(); req.onsuccess = () => res(req.result || []); req.onerror = () => rej(req.error); }); } catch (e) { return []; } }
async function photosBulkPut(list) { try { const db = await idbOpen(); return await new Promise((res) => { const tx = db.transaction(PHOTO_STORE, "readwrite"); (list || []).forEach((p) => { try { tx.objectStore(PHOTO_STORE).put(p); } catch (e) {} }); tx.oncomplete = () => res(true); tx.onerror = () => res(false); }); } catch (e) { return false; } }

// Shrink a photo to a modest JPEG before storing, so highlights stay small.
function compressImage(file, maxDim = 1280, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        w = Math.round(w * scale); h = Math.round(h * scale);
        const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        const ctx = cv.getContext("2d"); ctx.drawImage(img, 0, 0, w, h);
        try { resolve(cv.toDataURL("image/jpeg", quality)); } catch (e) { reject(e); }
      };
      img.onerror = reject; img.src = reader.result;
    };
    reader.onerror = reject; reader.readAsDataURL(file);
  });
}

/* ============================== HELPERS ============================== */
const COMPS = ["Premier League", "Europe", "FA Cup", "League Cup", "Club World Cup", "Super Cup", "Friendly", "Other"];
const COMP_SHORT = { "Premier League": "PL", "Europe": "EUR", "FA Cup": "FAC", "League Cup": "EFL", "Club World Cup": "CWC", "Super Cup": "SC", "Friendly": "FR", "Other": "—" };
const COMP_TINT = { "Premier League": "", "Europe": "#7C3AED", "FA Cup": "#C0413A", "League Cup": "#1F8A57", "Club World Cup": "#C5821E", "Super Cup": "#C5821E", "Friendly": "#69718A", "Other": "#69718A" };
// Estimated dates the PL announces TV-rescheduled fixtures (2026/27)
const TV_DATES = [
  ["Aug–Sep", "MW 2–5", "w/c 13 Jul"], ["October", "MW 6–9", "w/c 24 Aug"],
  ["November", "MW 10–12", "w/c 21 Sep"], ["Dec–Jan", "MW 13–20", "w/c 19 Oct"],
  ["January", "MW 21–23", "w/c 30 Nov"], ["February", "MW 24–27", "w/c 21 Dec"],
  ["March", "MW 28–30", "w/c 18 Jan"], ["April", "MW 31–33", "w/c 22 Feb"],
  ["Apr–May", "MW 34", "w/c 22 Mar"], ["May", "MW 35", "w/c 29 Mar"],
  ["May", "MW 36", "w/c 5 Apr"], ["May", "MW 37", "After FA Cup semis"],
];
// Attending states. "went" is the one that earns loyalty points — from 26/27 the
// club only awards them when you scan at the turnstile, so intending to go isn't
// enough. Old "comp"/"unavailable" statuses are migrated into these on load.
const ATT = {
  none: { past: "Didn't go", future: "Want to go", tone: "amber" },
  going: { past: "Had a ticket", future: "Going", tone: "blue" },
  went: { past: "Was there", future: "Was there", tone: "win" },
  sourced: { past: "Sourced", future: "Sourcing", tone: "muted" },
  cant: { past: "Couldn't go", future: "Not going", tone: "muted" },
};
function attLabel(status, isFuture) { const a = ATT[status]; if (!a) return "—"; return isFuture ? a.future : a.past; }

function uid() { return "f" + Math.random().toString(36).slice(2, 9); }
function money(n) { if (n == null || n === "" || isNaN(n)) return "—"; return "£" + Math.round(n); }
function money2(n) { if (n == null || isNaN(n)) return "£0.00"; return "£" + Number(n).toFixed(2); }
function parseScore(s) {
  if (!s) return null;
  const m = String(s).match(/(\d+)\s*[-–]\s*(\d+)/);
  if (!m) return null;
  return [parseInt(m[1]), parseInt(m[2])];
}
function chelseaGoals(f) { const p = parseScore(f.score); return p ? p[0] : null; }
function autoResult(score) {
  const p = parseScore(score); if (!p) return null;
  return p[0] > p[1] ? "W" : p[0] < p[1] ? "L" : "D";
}
// Cup deciders: extra time / penalties. Encoded in the score string so nothing
// else in the app needs to change — parseScore still reads the 90/120‑min score
// first, which is the correct goal tally (shootout goals don't count).
function parseDecider(score) {
  const s = String(score || "");
  let decider = "normal";
  if (/pen|shootout|\bpk\b/i.test(s)) decider = "pens";
  else if (/aet|a\.e\.t|extra ?time|\bet\b/i.test(s)) decider = "aet";
  // Only read a shootout score when it's explicitly marked, so a level score
  // like "0-0 Pens" isn't mistaken for the shootout result.
  let pens = "";
  const pm = s.match(/\((\d+)\s*[-–]\s*(\d+)\s*pens?\)/i)
    || s.match(/pens?[:\s]+(\d+)\s*[-–]\s*(\d+)/i)
    || s.match(/(\d+)\s*[-–]\s*(\d+)\s*on pens/i);
  if (pm) pens = pm[1] + "-" + pm[2];
  return { decider, pens };
}
function composeScore(base, decider, pens) {
  const b = String(base || "").trim();
  if (decider === "aet") return b ? b + " (AET)" : "";
  if (decider === "pens") return b ? b + (pens ? ` (${pens} pens)` : " (pens)") : (pens ? `(${pens} pens)` : "");
  return b;
}
function composeResult(base, decider, pens) {
  if (decider === "pens") { const p = parseScore(pens); return p ? (p[0] > p[1] ? "W" : p[0] < p[1] ? "L" : null) : null; }
  return autoResult(base);
}
// 26/27 loyalty points, per Chelsea's official Men's Ticketing Policy:
//  1 pt  — Arsenal, Liverpool, Man City, Man Utd, Spurs (home AND away)
//  3 pts — all other Premier League matches, home and away
//  5 pts — FA Cup (not semi-final or final), League Cup home and away (not the final)
//  0 pts — League Cup final, FA Cup semi-final and final
// Home points are awarded for attending (scanning in); away points for purchasing.
const LP_LOW_OPPO = ["arsenal", "liverpool", "man utd", "man united", "manchester utd", "manchester united", "man city", "manchester city", "tottenham", "spurs"];
function lpDefault(venue, comp, opposition) {
  const o = String(opposition || "").toLowerCase();
  const isSemi = /semi/.test(o);
  const isQuarter = /quarter/.test(o);
  const isFinal = /\bfinals?\b/.test(o) && !isSemi && !isQuarter;
  if (comp === "Premier League") return LP_LOW_OPPO.some((n) => o.includes(n)) ? 1 : 3;
  if (comp === "FA Cup") return (isSemi || isFinal) ? 0 : 5;
  if (comp === "League Cup") return isFinal ? 0 : 5;
  return null; // friendlies and anything else — enter by hand
}
function fmtDate(iso, fallback) {
  if (!iso) return fallback || "TBC";
  const d = new Date(iso + "T12:00:00");
  if (isNaN(d)) return fallback || "TBC";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}
function seasonOf(f) { return f.season; }
function sortFix(list) {
  return [...list].sort((a, b) => {
    if (a.date && b.date) return a.date < b.date ? -1 : 1;
    if (a.date) return -1; if (b.date) return 1; return 0;
  });
}
function attended(f) { return f.attending === "going" || f.attending === "went" || f.attending === "comp"; }
// Loyalty points: HOME points are awarded for attending (scanning in at the turnstile),
// AWAY points for buying the ticket — so an away game still counts if you pass it on.
function scannedIn(f) { return f.attending === "went"; }
function earnsLP(f) {
  if (f.venue === "H") return f.attending === "went";
  return f.attending === "went" || f.attending === "going" || f.attending === "sourced";
}
// Season ticket seat-usage rule: must attend, or pass on, 13+ PL home games a season.
function seatUsed(f) { return f.competition === "Premier League" && f.venue === "H" && (f.attending === "went" || f.attending === "sourced"); }
// Friendlies are excluded from result-based stats — the result doesn't matter.
function countsToRecord(f) { return f.competition !== "Friendly"; }
function ensureFields(f) {
  if (f && f.groundBeers && "allocation" in f && "prediction" in f && "saleDate" in f) return f;
  return { ...f, groundBeers: (f && f.groundBeers) || [], allocation: f && f.allocation != null ? f.allocation : null, prediction: f && f.prediction != null ? f.prediction : "", saleDate: f && f.saleDate != null ? f.saleDate : "" };
}
function pad2(n) { return String(n).padStart(2, "0"); }
function makeICS(list) {
  const ev = list.filter((f) => f.date && f.opposition).map((f) => {
    const d = f.date.replace(/-/g, "");
    let dl = `DTSTART;VALUE=DATE:${d}\nDTEND;VALUE=DATE:${d}`;
    if (f.kickoff) {
      const [hh, mm] = f.kickoff.split(":");
      const end = new Date(f.date + "T" + f.kickoff + ":00"); end.setHours(end.getHours() + 2);
      dl = `DTSTART:${d}T${pad2(hh)}${pad2(mm)}00\nDTEND:${end.getFullYear()}${pad2(end.getMonth() + 1)}${pad2(end.getDate())}T${pad2(end.getHours())}${pad2(end.getMinutes())}00`;
    }
    const v = f.venue === "H" ? "(H)" : f.venue === "A" ? "(A)" : f.venue === "N" ? "(N)" : "";
    return `BEGIN:VEVENT\nUID:${f.id}@sameagain\nSUMMARY:Chelsea v ${f.opposition} ${v}\n${dl}\nDESCRIPTION:${f.competition}${f.broadcaster ? " · " + f.broadcaster : ""}\nEND:VEVENT`;
  });
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Every Other Saturday//EN\nCALSCALE:GREGORIAN\n${ev.join("\n")}\nEND:VCALENDAR`;
}
/* Saving a file. iOS Safari refuses to navigate to a data: URL, so the old
   <a href="data:..." download> links silently did nothing on an iPhone — which is why
   the season export button appeared broken. Blob URLs work everywhere, and on mobile we
   offer the share sheet first so the file can go straight into Claude, Files or Mail. */
function saveBlob(filename, text, mime) {
  try {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.rel = "noopener";
    document.body.appendChild(a); a.click();
    setTimeout(() => { try { document.body.removeChild(a); } catch (e) {} URL.revokeObjectURL(url); }, 2000);
    return true;
  } catch (e) { return false; }
}
async function shareOrSave(filename, text, mime) {
  try {
    if (typeof File === "function" && navigator.share && navigator.canShare) {
      const file = new File([text], filename, { type: mime });
      if (navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: filename }); return "shared"; }
    }
  } catch (e) { if (e && e.name === "AbortError") return "cancelled"; }
  return saveBlob(filename, text, mime) ? "saved" : "failed";
}
async function copyText(text) {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; } } catch (e) {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.top = "-1000px"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    const ok = document.execCommand("copy"); document.body.removeChild(ta); return ok;
  } catch (e) { return false; }
}
function median(a) {
  if (!a.length) return 0;
  const x = [...a].sort((p, q) => p - q), m = Math.floor(x.length / 2);
  return x.length % 2 ? x[m] : Math.round((x[m - 1] + x[m]) / 2);
}
const DEFAULT_TONE = `- **Wry, dry, deadpan.** Observational and impersonal — narrate the day at a remove, avoid "I". A knowing, unimpressed observer, not a bloke recounting his day. Understated, never breathless; let dry lines land flat.
- **When Chelsea are poor, lean into gallows humour** — laugh at the misery, don't rage at it. The running joke is that people paid good money for this and turned up anyway. No player ratings, no tactical inquest.
- **Swear freely where it's honest** — it's how the day actually sounded; don't sanitise it.
- **Name whoever's in the notes** — mates, the pub, the bloke two rows back. Real detail over a vague "a friend".
- **Let the data lead the emphasis.** Lots of pub/mates notes and a forgettable game → make it about the day out. A proper match → make it about the football. Never manufacture atmosphere that wasn't logged.
- **Avoid:** clichés (game of two halves, backs to the wall), exclamation marks, hyperbole, invented detail, matchday-programme gloss.`;
function seasonReviewMD(list, season, settings) {
  const went = list.filter(scannedIn);
  const played = went.filter((f) => f.result && countsToRecord(f));
  const rec = { W: 0, D: 0, L: 0 }; played.forEach((f) => rec[f.result]++);
  const beers = list.flatMap((f) => fxBeers(f));
  const pints = beers.reduce((a, b) => a + (b.qty || 0), 0);
  const beerSpend = beers.reduce((a, b) => a + (b.price || 0) * (b.qty || 0), 0);
  const myCost = list.reduce((a, f) => a + (f.myCost || 0), 0);
  const stCost = (settings.stCost || {})[season] || 0;
  const aways = went.filter((f) => f.venue === "A").length;
  const perf = (settings.seasonPerf || {})[season] || {};
  const pred = ((settings.predictions || {})[season]) || {};
  const pubs = list.flatMap((f) => ((f.journal && f.journal.pubs) || []).map((p) => ({ ...p, fx: f })));
  const bestPint = pubs.filter((p) => p.pint).sort((a, b) => b.pint - a.pint)[0];
  const bestAmb = pubs.filter((p) => p.ambience).sort((a, b) => b.ambience - a.ambience)[0];
  const specials = pubs.filter((p) => p.special);
  const L = [];
  L.push(`# Every Other Saturday — Season ${season} review pack`);
  L.push("");
  L.push(`_Exported ${new Date().toLocaleDateString("en-GB")} from Dom's "Every Other Saturday" matchday log. Chelsea's score is always written first._`);
  L.push("");
  L.push("## What to write");
  L.push("Two things, using only the data below — don't invent detail that isn't logged:");
  L.push("1. **A journal entry for every game in the \"Every game\" section**, headed with the fixture. Let the notes set the length — a game with a full day of pub notes deserves 150–250 words; one with a line or two gets a short, factual paragraph. Never pad a thin game out with invention.");
  L.push("2. **A full season wrap at the end — and write this one long.** Aim for 2,500–4,000 words, and go beyond that if the material justifies it. There is no word budget to squeeze into and nothing should be cut for brevity: if it is in the data below, it is fair game. This is the keepsake centrepiece, so give it room.");
  L.push("");
  L.push("### How to write the season wrap");
  L.push("- **Build it in movements, not bullet points.** Something like: the pre-season mood and the predictions; the opening weeks; the autumn; the winter slog and Christmas; the new year and the cup runs; the run-in; the reckoning. Use sub-headings where they help the read.");
  L.push("- **Follow threads across the whole season** rather than marching game to game — the recurring pubs, the recurring mates, the managers, the mood swings, the away days that outshone the football, the money quietly going out the door.");
  L.push("- **Be linguistically ambitious inside the tone above.** Vary the sentence length, find the good image, let the dry lines land flat. What it must never do is invent: every score, name, price, pub and feeling has to come from the data below. The richness comes from how it is written, never from making things up.");
  L.push("- **Use the numbers as texture rather than a table** — the pints, the spend, the cost per win, the record, woven into the prose where they land.");
  L.push("- **Close on a proper ending**: where the season left things, and what it cost to be there.");
  L.push("");
  L.push("### Important — check the beer balance with Dom first");
  L.push("The pubs and pints are logged because tracking them is good fun, not because the drinking is the point of the day. These write-ups are keepsakes, likely to be read by Dom's kids and grandkids one day, and a piece that reads as a running tally of units would land badly in twenty years.");
  L.push("So **before you write anything, come back to Dom with a short recommendation on how much of the beer detail to carry through** — which bits earn their place (a great pub, a landlord, an overheard conversation, the price of a pint as a record of what things cost) and which are just a count that adds nothing. Say what you'd keep, what you'd thin out and what you'd drop, then wait for his steer before writing the final piece.");
  L.push("As a default, lean towards restraint: pubs as places and scenes, pints as texture. The day is about the football, the travel, the people and the city — never about how much was drunk.");
  L.push("");
  L.push("Each game may include a **What happened on the pitch** line (use this for the football facts — goals, cards, the turning point — so the match detail is accurate and in Dom's own words, never a reporter's) and a **Life beyond the football** line (family, work, whatever was going on — weave it in lightly where it adds warmth; for the keepsake these human moments matter as much as the score). Both are optional; when they're absent, don't invent them.");
  L.push("");
  L.push("## Tone of voice (follow this closely)");
  (settings.toneGuide && settings.toneGuide.trim() ? settings.toneGuide.trim() : DEFAULT_TONE).split("\n").forEach((line) => L.push(line));
  L.push("");
  L.push("## Season at a glance");
  L.push(`- Games attended: ${went.length} (${aways} away days)`);
  L.push(`- Record at those games: ${rec.W}W ${rec.D}D ${rec.L}L`);
  L.push(`- Pints sunk: ${pints} · beer spend ${money(beerSpend)}`);
  L.push(`- Ticket spend (season ticket + match costs): ${money(stCost + myCost)}`);
  L.push(`- Total damage (tickets + beer): ${money(stCost + myCost + beerSpend)}`);
  L.push("");
  if (perf.leaguePos || perf.faCup || perf.leagueCup || perf.europe) {
    L.push("## How the Blues got on");
    if (perf.leaguePos) L.push(`- League finish: ${perf.leaguePos}`);
    if (perf.faCup) L.push(`- FA Cup: ${perf.faCup}`);
    if (perf.leagueCup) L.push(`- Carabao Cup: ${perf.leagueCup}`);
    if (perf.europe) L.push(`- Europe: ${perf.europe}`);
    L.push("");
  }
  if (pred && pred.pre && typeof pred.pre === "object") {
    const entries = Object.entries(pred.pre).filter(([, v]) => v);
    if (entries.length) {
      L.push("## Dom's pre-season predictions");
      entries.forEach(([k, v]) => L.push(`- ${k}: ${v}`));
      L.push("");
    }
  }
  if (bestPint || bestAmb || specials.length) {
    L.push("## Pub of the season");
    if (bestPint) L.push(`- Best pint: ${bestPint.name || "?"} (${bestPint.pint.toFixed(1)}/10)`);
    if (bestAmb) L.push(`- Best ambience: ${bestAmb.name || "?"} (${bestAmb.ambience.toFixed(1)}/10)`);
    if (specials.length) L.push(`- Special mentions: ${specials.map((p) => p.name || "?").join(", ")}`);
    L.push("");
  }
  L.push("## Every game Dom attended");
  L.push("");
  went.slice().sort((a, b) => (a.date || "").localeCompare(b.date || "")).forEach((f) => {
    const v = f.venue === "H" ? "H" : f.venue === "A" ? "A" : f.venue === "N" ? "Neutral" : "";
    L.push(`### ${fmtDate(f.date, f.dateText)} — Chelsea v ${f.opposition}${v ? ` (${v})` : ""} · ${f.competition}`);
    if (f.score || f.result) L.push(`- Result: ${f.score || "?"}${f.result ? ` (${f.result})` : ""}`);
    if (f.prediction) L.push(`- Dom's prediction: ${f.prediction}`);
    if (f.rating) L.push(`- Day-out rating: ${f.rating}/10`);
    const j = f.journal || null;
    if (j) {
      const who = j.solo ? "Solo" : (j.withWho ? `With ${j.withWho}` : "");
      if (who) L.push(`- ${who}`);
      if (j.body && j.body.trim()) L.push(`\n${j.body.trim()}`);
      if (j.matchFacts && j.matchFacts.trim()) L.push(`\n_What happened on the pitch:_ ${j.matchFacts.trim()}`);
      if (j.postNote && j.postNote.trim()) L.push(`\n${j.postNote.trim()}`);
      if (j.lifeNote && j.lifeNote.trim()) L.push(`\n_Life beyond the football:_ ${j.lifeNote.trim()}`);
    }
    const bs = fxBeers(f);
    if (bs.length) L.push(`\nBeers: ${bs.map((b) => `${b.qty || 1}× ${b.name}${b.price ? ` (£${b.price})` : ""}${b.pub ? ` @ ${b.pub}` : ""}`).join("; ")}`);
    L.push("");
  });
  return L.join("\n");
}

/* The seed still carries the original spreadsheet's competition tags, so the cup-tie
   corrections get applied on the way in as well as via the one-time migration. */
function applyFixes(list) {
  return list.map((f) => {
    const c = COMP_PATCHES[f.id], n = NAME_PATCHES[f.id];
    if (!c && !n) return f;
    return { ...f, ...(c ? { competition: c } : {}), ...(n ? { opposition: n } : {}) };
  });
}

/* Raw seed records still carry the old attending statuses. Existing installs had these
   normalised by the lpScan2627 migration; a fresh seed (or a "re-import original history")
   needs the same treatment, otherwise every historic game reads as a ticket held rather
   than a game attended — and nothing counts. Only ever applied to raw seed data. */
function normaliseAttendance(list) {
  const today = new Date().toISOString().slice(0, 10);
  return list.map((f) => {
    let a = f.attending;
    if (a === "comp") a = "went";
    else if (a === "unavailable") a = "cant";
    else if (a === "going" && (f.result || (f.date && f.date < today))) a = "went";
    return a === f.attending ? f : { ...f, attending: a };
  });
}

/* hydrate a seed record into a full fixture */
function hydrate(r) {
  const base = {
    id: r.id || uid(), season: r.season, date: r.date || null, dateText: r.dateText || "",
    dateConfirmed: r.dateConfirmed !== undefined ? r.dateConfirmed : true,
    kickoff: r.kickoff || "", broadcaster: r.broadcaster || "",
    opposition: r.opposition || "", venue: r.venue || "N",
    competition: r.competition || "Premier League",
    attending: r.attending || "none", attendee: r.attendee || "",
    result: r.result || null, score: r.score || "",
    lps: r.lps != null ? r.lps : null, lpRequired: r.lpRequired != null ? r.lpRequired : null,
    myCost: r.myCost != null ? r.myCost : null,
    othersCost: r.othersCost != null ? r.othersCost : null,
    rating: r.rating || null,
    journal: r.journal || null,
    beers: r.beers || [],
    groundBeers: r.groundBeers || [],
    allocation: r.allocation != null ? r.allocation : null,
    prediction: r.prediction || "",
    saleDate: r.saleDate || "",
  };
  return migratePubs(base);
}

/* Convert old single-pub journal (+ flat beers[]) into the new pubs[] model.
   New journal: { title, mood, solo, withWho, body, postNote, pubs:[{id,name,ambience,note,beers:[{id,name,price,qty}]}] } */
function migratePubs(f) {
  if (f.journal && Array.isArray(f.journal.pubs)) return f; // already new shape
  const j = f.journal || null;
  const oldBeers = f.beers || [];
  if (!j && oldBeers.length === 0) return f; // nothing to migrate
  const names = j && j.pub ? j.pub.split(/\s*\/\s*/).map((s) => s.trim()).filter(Boolean) : [];
  oldBeers.forEach((b) => {
    const bp = (b.pub || "").trim();
    if (bp && !names.some((n) => n.toLowerCase() === bp.toLowerCase())) names.push(bp);
  });
  if (names.length === 0 && oldBeers.length) names.push("");
  const assigned = new Set();
  const pubs = names.map((nm, i) => {
    const bs = oldBeers.filter((b) => {
      const bp = (b.pub || "").trim();
      const hit = bp.toLowerCase() === nm.toLowerCase() || (nm === "" && !bp);
      if (hit) assigned.add(b);
      return hit;
    });
    return { id: uid(), name: nm, ambience: i === 0 ? (j && j.ambience) || null : null, note: "",
      beers: bs.map((b) => ({ id: b.id || uid(), name: b.name, price: b.price, qty: b.qty })) };
  });
  const leftover = oldBeers.filter((b) => !assigned.has(b));
  if (leftover.length) {
    const byp = {};
    leftover.forEach((b) => { const k = (b.pub || "Other").trim() || "Other"; (byp[k] = byp[k] || []).push(b); });
    Object.entries(byp).forEach(([k, bs]) => pubs.push({ id: uid(), name: k, ambience: null, note: "",
      beers: bs.map((b) => ({ id: b.id || uid(), name: b.name, price: b.price, qty: b.qty })) }));
  }
  const nj = {
    title: (j && j.title) || "", mood: (j && j.mood) || "",
    solo: j && j.withWho && j.withWho.trim() ? false : (typeof (j && j.solo) === "boolean" ? j.solo : null),
    withWho: (j && j.withWho) || "", body: (j && j.body) || "", postNote: (j && j.postNote) || "",
    matchFacts: (j && j.matchFacts) || "", lifeNote: (j && j.lifeNote) || "", pubs,
  };
  return { ...f, journal: nj, beers: [] };
}

/* A beer row only counts once there's actually something in it — a real name or a
   price. Empty placeholder rows left behind on a game that never got logged shouldn't
   turn up in the bar tab as a mystery £0. */
function realBeer(b) {
  if (!b) return false;
  if ((b.qty || 0) <= 0) return false;
  const nm = String(b.name || "").replace(/[^a-z0-9]/gi, "").trim();
  return !!nm || (b.price || 0) > 0;
}

/* All beers for a fixture (nested in pubs, with legacy flat fallback) */
function fxBeers(f) {
  const out = [];
  ((f.journal && f.journal.pubs) || []).forEach((p) => (p.beers || []).forEach((b) => out.push({ ...b, pub: p.name })));
  (f.groundBeers || []).forEach((b) => out.push({ ...b, pub: "Inside the ground", ground: true }));
  (f.beers || []).forEach((b) => out.push(b));
  return out.filter(realBeer);
}

/* ============================== ATOMS ============================== */
function Pill({ tone = "muted", children, className = "" }) {
  return <span className={`pill pill-${tone} ${className}`}>{children}</span>;
}
function ResultPill({ r }) {
  if (!r) return <span className="pill pill-muted">—</span>;
  const tone = r === "W" ? "win" : r === "L" ? "loss" : "draw";
  return <span className={`pill pill-${tone}`} style={{ minWidth: 22, textAlign: "center" }}>{r}</span>;
}
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="lbl">{label}</span>
      {children}
    </label>
  );
}
function Stars({ value, onChange, size = 20 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(value === n ? null : n)}
          className="transition-transform active:scale-90" aria-label={`${n} stars`}>
          <Star size={size} fill={value >= n ? "var(--amber)" : "none"} stroke={value >= n ? "var(--amber)" : "var(--line)"} />
        </button>
      ))}
    </div>
  );
}

function HalfStars({ value = 0, onChange, size = 19 }) {
  const v = value || 0;
  const set = (n) => onChange(v === n ? 0 : n);
  return (
    <div className="hstars">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
        const full = v >= i, half = !full && v >= i - 0.5;
        return (
          <span key={i} className="hstar" style={{ width: size, height: size }}>
            <Star size={size} stroke="var(--line)" fill="none" />
            {full && <Star className="hstar-fill" size={size} stroke="var(--amber)" fill="var(--amber)" />}
            {half && <StarHalf className="hstar-fill" size={size} stroke="var(--amber)" fill="var(--amber)" />}
            <button type="button" className="hstar-hit l" onClick={() => set(i - 0.5)} aria-label={`${i - 0.5}`} />
            <button type="button" className="hstar-hit r" onClick={() => set(i)} aria-label={`${i}`} />
          </span>
        );
      })}
      <span className="hstar-num font-mono">{v ? v.toFixed(1) : "–"}</span>
    </div>
  );
}

/* ============================== APP ============================== */
export default function App() {
  const [fixtures, setFixtures] = useState([]);
  const [settings, setSettings] = useState({ lpTargets: {}, title: "EVERY OTHER SATURDAY" });
  const [season, setSeason] = useState(null);
  const [tab, setTab] = useState("fixtures");
  const [loaded, setLoaded] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [matchdayMode, setMatchdayMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const saveTimer = useRef(null);

  // load / seed
  useEffect(() => {
    (async () => {
      const data = await storeGet(KEY);
      if (data && data.fixtures && data.fixtures.length) {
        let fx = data.fixtures;
        let st = data.settings || { lpTargets: {}, title: "EVERY OTHER SATURDAY" };
        let changed = false;
        // migrate: pull in any new seed fixtures by id (new seasons, cup placeholders) without touching edits/journals
        if ((st.seedVersion || 0) < SEED_VERSION) {
          const have = new Set(fx.map((f) => f.id));
          const add = SEED.filter((r) => !have.has(r.id)).map(hydrate);
          if (add.length) fx = [...fx, ...add];
          fx = fx.map((f) => ensureFields(migratePubs(f))); // pubs[] model + ground/allocation fields
          st = {
            ...st, seedVersion: SEED_VERSION,
            lpStart: { "24-25": 47, "25-26": 47, "26-27": 0, ...(st.lpStart || {}) },
            stCost: { "24-25": 810, "25-26": 880, "26-27": 880, ...(st.stCost || {}) },
            batch1: st.batch1 || {}, seasonPerf: { ...DEFAULT_PERF, ...(st.seasonPerf || {}) },
            regularPubs: st.regularPubs || DEFAULT_PUBS,
          };
          changed = true;
        }
        // one-time: 26/27 loyalty-point scheme + simplified attending statuses.
        // Points now only count when you scan in, so past attendance is marked "went";
        // the old 47-point starting balance for 26/27 is cleared.
        if (!st.lpScan2627) {
          const today = new Date().toISOString().slice(0, 10);
          fx = fx.map((f) => {
            let a = f.attending;
            if (a === "comp") a = "went";
            else if (a === "unavailable") a = "cant";
            else if (a === "going" && (f.result || (f.date && f.date < today))) a = "went";
            const patch = { attending: a };
            // seed the new home-league point values where none were set
            if (f.season === "26-27" && (f.lps == null)) {
              const v = lpDefault(f.venue, f.competition, f.opposition);
              if (v != null) patch.lps = v;
            }
            return { ...f, ...patch };
          });
          st = { ...st, lpScan2627: true, lpStart: { ...(st.lpStart || {}), "26-27": 0 } };
          changed = true;
        }
        // one-time: apply the official 26/27 ticketing policy point values across the
        // season (away + cup games included). Safe to overwrite — the season hasn't
        // started, so these are placeholders rather than logged history.
        if (!st.lpPolicy2627) {
          fx = fx.map((f) => {
            if (f.season !== "26-27") return f;
            const v = lpDefault(f.venue, f.competition, f.opposition);
            return v == null ? f : { ...f, lps: v };
          });
          st = { ...st, lpPolicy2627: true };
          changed = true;
        }
        // migrate: retitle from old working name only (won't touch a custom title)
        if (st.title === "THE MATCHDAY LOG" || st.title === "SAME AGAIN?") { st = { ...st, title: "EVERY OTHER SATURDAY" }; changed = true; }
        // one-time: apply confirmed Aug–Sep 2026 TV selections to the opening fixtures
        if (!st.tvPatch2627) {
          fx = fx.map((f) => FIXTURE_PATCHES[f.id] ? { ...f, ...FIXTURE_PATCHES[f.id] } : f);
          st = { ...st, tvPatch2627: true };
          changed = true;
        }
        // one-time: re-tag historic cup ties that were logged as league games, so the
        // league points panel stops seeing 47 "league" fixtures in a 38-game season.
        // one-time: the ground pint list shipped empty, so there was nothing to pick on
        // the first game. Top it up with the defaults, keeping anything already saved.
        if (!st.groundSeed1) {
          const cur = st.regularGroundBeers || [];
          const merged = [...cur];
          DEFAULT_GROUND_BEERS.forEach((b) => { if (!merged.some((x) => String(x).toLowerCase() === b.toLowerCase())) merged.push(b); });
          st = { ...st, regularGroundBeers: merged, groundSeed1: true };
          changed = true;
        }
        if (!st.compFix1) {
          fx = applyFixes(fx);
          st = { ...st, compFix1: true };
          changed = true;
        }
        if (!st.lpTargets) st.lpTargets = {};
        if (st.lpTargets["26-27"] == null) { st = { ...st, lpTargets: { ...st.lpTargets, "26-27": 140 } }; changed = true; }
        // Only seed these when the key has never been set. Checking for an empty list
        // instead would quietly undo it every launch if you cleared the list on purpose.
        if (!st.regularMates) { st = { ...st, regularMates: DEFAULT_MATES }; changed = true; }
        setFixtures(fx); setSettings(st);
        const seasons = [...new Set(fx.map((f) => f.season))].sort();
        setSeason(seasons[seasons.length - 1]);
        if (changed) await storeSet(KEY, { fixtures: fx, settings: st });
      } else {
        const seeded = normaliseAttendance(applyFixes(SEED.map(hydrate)));
        const seasons = [...new Set(seeded.map((f) => f.season))].sort();
        const st = {
          lpTargets: {}, title: "EVERY OTHER SATURDAY", seedVersion: SEED_VERSION,
          lpStart: { "24-25": 47, "25-26": 47, "26-27": 0 },
          stCost: { "24-25": 810, "25-26": 880, "26-27": 880 },
          batch1: {}, seasonPerf: { ...DEFAULT_PERF }, compFix1: true, lpScan2627: true, lpPolicy2627: true, tvPatch2627: true, groundSeed1: true,
          regularPubs: DEFAULT_PUBS, regularMates: DEFAULT_MATES,
          regularBeers: DEFAULT_BEERS, regularGroundBeers: DEFAULT_GROUND_BEERS,
        };
        seasons.forEach((s) => (st.lpTargets[s] = 140));
        setFixtures(seeded); setSettings(st); setSeason(seasons[seasons.length - 1]);
        await storeSet(KEY, { fixtures: seeded, settings: st });
      }
      setLoaded(true);
    })();
  }, []);

  // debounced persist
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await storeSet(KEY, { fixtures, settings });
      setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1200);
    }, 500);
  }, [fixtures, settings, loaded]);

  // Roost sync: push upcoming fixtures after changes, on open, and when the app comes back
  // to the foreground or online. Fire-and-forget — it never blocks or alters local saving.
  const fixturesRef = useRef(fixtures);
  fixturesRef.current = fixtures;
  useEffect(() => { if (loaded) scheduleSync(fixtures); }, [fixtures, loaded]);
  useEffect(() => {
    if (!loaded || !syncConfigured) return;
    syncNow(fixturesRef.current);
    const wake = () => { if (document.visibilityState !== "hidden") syncNow(fixturesRef.current); };
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("online", wake);
    return () => { document.removeEventListener("visibilitychange", wake); window.removeEventListener("online", wake); };
  }, [loaded]);

  // Inside the Claude artifact sandbox there's no index.html of our own, so set the
  // web-app meta tags here. When self-hosted, index.html already carries these plus the
  // real EOS icons — so we deliberately don't touch document.title or the touch icon,
  // which an earlier build overwrote with a canvas-drawn placeholder.
  useEffect(() => {
    try {
      [["apple-mobile-web-app-capable", "yes"], ["mobile-web-app-capable", "yes"], ["apple-mobile-web-app-status-bar-style", "black-translucent"], ["apple-mobile-web-app-title", "Every Other Saturday"], ["theme-color", "#060E20"]].forEach(([name, content]) => {
        let m = document.querySelector(`meta[name="${name}"]`);
        if (!m) { m = document.createElement("meta"); m.setAttribute("name", name); document.head.appendChild(m); }
        m.setAttribute("content", content);
      });
    } catch (e) {}
  }, []);

  const seasons = useMemo(() => [...new Set(fixtures.map((f) => f.season))].sort(), [fixtures]);
  const seasonFix = useMemo(() => sortFix(fixtures.filter((f) => f.season === season)), [fixtures, season]);
  const seasonLP = useMemo(() => ((settings.lpStart || {})[season] || 0) + (((settings.cupScheme || {})[season]) ? 10 : 0) + seasonFix.reduce((a, f) => a + (earnsLP(f) ? (f.lps || 0) : 0), 0), [seasonFix, settings, season]);
  const detail = useMemo(() => fixtures.find((f) => f.id === detailId) || null, [fixtures, detailId]);

  function upsert(fx) {
    setFixtures((prev) => {
      const i = prev.findIndex((f) => f.id === fx.id);
      if (i === -1) return [...prev, fx];
      const copy = [...prev]; copy[i] = fx; return copy;
    });
  }
  function remove(id) { setFixtures((prev) => prev.filter((f) => f.id !== id)); setDetailId(null); }
  // Saved regulars. Names are compared case-insensitively so "guinness" doesn't end up
  // sitting alongside "Guinness", and an emptied list is left empty rather than re-seeded.
  function addRegular(key, fallback, name) {
    const n = String(name || "").trim(); if (!n) return;
    setSettings((s) => {
      const cur = s[key] || fallback;
      if (cur.some((x) => x.toLowerCase() === n.toLowerCase())) return s;
      return { ...s, [key]: [...cur, n] };
    });
  }
  function dropRegular(key, fallback, name) {
    setSettings((s) => ({ ...s, [key]: (s[key] || fallback).filter((x) => x.toLowerCase() !== String(name).toLowerCase()) }));
  }

  function addFixture() {
    const fx = hydrate({ id: uid(), season, date: null, opposition: "", venue: "H", competition: "Premier League", attending: "going", dateConfirmed: false });
    upsert(fx); setDetailId(fx.id); setMatchdayMode(false);
  }
  function addSeason() {
    const last = seasons[seasons.length - 1];
    const [a] = (last || "25-26").split("-").map(Number);
    const ns = `${a + 1}-${a + 2}`;
    setSettings((s) => ({ ...s, lpTargets: { ...s.lpTargets, [ns]: 140 } }));
    // create a placeholder so the season exists
    const fx = hydrate({ id: uid(), season: ns, opposition: "", venue: "H", competition: "Premier League", attending: "going", dateConfirmed: false });
    upsert(fx); setSeason(ns); setDetailId(fx.id);
  }

  if (!loaded) return (
    <div className="ml-root" style={{ display: "grid", placeItems: "center", minHeight: 400 }}>
      <Style /><div className="font-disp loading-t">Loading the log…</div>
    </div>
  );

  const seasonInProgress = seasonFix.some((f) => f.opposition && !f.result);
  const tabs = [
    { id: "fixtures", label: "Fixtures", icon: CalendarDays },
    { id: "matchday", label: "Matchday", icon: NotebookPen },
    { id: "beer", label: "Beer Tab", icon: Beer },
    { id: "stats", label: "Stats", icon: BarChart3 },
    { id: "wrapped", label: seasonInProgress ? "Season" : "Wrapped", icon: Trophy },
  ];

  const tabIndex = Math.max(0, tabs.findIndex((t) => t.id === tab));
  return (
    <div className="ml-root">
      <Style />
      {/* HEADER — masthead, then the season pill, loyalty chip and actions */}
      <header className="ml-head">
        <div className="mast">
          <span className="ml-eyebrow">the only place to be…</span>
          <span className="font-disp ml-title">{settings.title}</span>
        </div>
        <div className="hdr-row">
          <SeasonPicker seasons={seasons} season={season} setSeason={setSeason} onAdd={addSeason} />
          <div className="hdr-actions">
            <span className="hdr-lp" aria-label={`${seasonLP} loyalty points, ${season}`}><span className="hdr-lp-pts font-disp">{seasonLP}</span> LP</span>
            {tab === "fixtures" && <button className="icon-btn add" onClick={addFixture} aria-label="Add fixture"><Plus size={20} /></button>}
            <button className="icon-btn" onClick={() => setShowSettings(true)} aria-label="Data & settings"><Settings size={18} /></button>
          </div>
        </div>
        <span className={`save-dot ${savedFlash ? "show" : ""}`} aria-live="polite"><Check size={12} /> saved</span>
      </header>

      {/* CONTENT */}
      <main className="ml-main" key={tab}>
        {tab === "fixtures" && <FixturesView list={seasonFix} season={season} onOpen={(id) => { setDetailId(id); setMatchdayMode(false); }} onAdd={addFixture} />}
        {tab === "matchday" && <MatchdayView list={seasonFix} onOpen={(id) => { setDetailId(id); setMatchdayMode(true); }} />}
        {tab === "beer" && <BeerView list={seasonFix} season={season} onOpen={(id) => { setDetailId(id); setMatchdayMode(true); }} />}
        {tab === "stats" && <StatsView list={seasonFix} season={season} settings={settings} setSettings={setSettings} />}
        {tab === "wrapped" && <WrappedView list={seasonFix} season={season} settings={settings} setSettings={setSettings} inProgress={seasonInProgress} allFixtures={fixtures} />}
      </main>

      {/* FLOATING DOCK — the gold pill slides to whichever tab is open */}
      <nav className="dock" aria-label="Main" style={{ "--i": tabIndex, "--n": tabs.length }}>
        <span className="dock-pill" aria-hidden />
        {tabs.map((t) => (
          <button key={t.id} className={`bn ${tab === t.id ? "on" : ""}`} aria-current={tab === t.id ? "page" : undefined} onClick={() => { setTab(t.id); setMatchdayMode(false); }}>
            <t.icon size={21} strokeWidth={1.9} /><span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* DETAIL SHEET */}
      {detail && (
        <FixtureDetail
          key={detail.id}
          fx={detail}
          matchday={matchdayMode}
          regulars={settings.regularPubs || DEFAULT_PUBS}
          onAddRegular={(n) => addRegular("regularPubs", DEFAULT_PUBS, n)}
          onRemoveRegular={(n) => dropRegular("regularPubs", DEFAULT_PUBS, n)}
          mates={settings.regularMates || DEFAULT_MATES}
          onAddMate={(n) => addRegular("regularMates", DEFAULT_MATES, n)}
          onRemoveMate={(n) => dropRegular("regularMates", DEFAULT_MATES, n)}
          beerNames={settings.regularBeers || DEFAULT_BEERS}
          onAddBeerName={(n) => addRegular("regularBeers", DEFAULT_BEERS, n)}
          onRemoveBeerName={(n) => dropRegular("regularBeers", DEFAULT_BEERS, n)}
          groundBeerNames={settings.regularGroundBeers || DEFAULT_GROUND_BEERS}
          onAddGroundBeerName={(n) => addRegular("regularGroundBeers", DEFAULT_GROUND_BEERS, n)}
          onRemoveGroundBeerName={(n) => dropRegular("regularGroundBeers", DEFAULT_GROUND_BEERS, n)}
          onClose={() => setDetailId(null)}
          onSave={(fx) => { upsert(fx); setDetailId(null); }}
          onDelete={() => remove(detail.id)}
        />
      )}

      {/* SETTINGS / DATA */}
      {showSettings && (
        <DataSheet
          fixtures={fixtures} settings={settings} setSettings={setSettings}
          onClose={() => setShowSettings(false)}
          onImport={(data) => { setFixtures(data.fixtures); if (data.settings) setSettings(data.settings); }}
          onReseed={() => { setFixtures(normaliseAttendance(applyFixes(SEED.map(hydrate)))); }}
          onReset={() => setFixtures([])}
        />
      )}
    </div>
  );
}

/* ============================== SEASON PICKER ============================== */
function SeasonPicker({ seasons, season, setSeason, onAdd }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button className="season-btn font-disp" onClick={() => setOpen((o) => !o)} aria-label={`Season ${season}, change season`}>
        <span>SEASON {String(season || "").replace("-", "/")}</span><ChevronDown size={15} strokeWidth={2.4} />
      </button>
      {open && (
        <>
          <div className="overlay-bare" onClick={() => setOpen(false)} />
          <div className="dropdown">
            {seasons.map((s) => (
              <button key={s} className={`dd-item ${s === season ? "on" : ""}`} onClick={() => { setSeason(s); setOpen(false); }}>
                <span className="font-mono">{s}</span>{s === season && <Check size={14} />}
              </button>
            ))}
            <button className="dd-item add" onClick={() => { onAdd(); setOpen(false); }}><Plus size={14} /> New season</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================== FIXTURES ============================== */
function monthKey(f) { return f.date ? f.date.slice(0, 7) : "tbc"; }
function monthLabel(key) {
  if (key === "tbc") return "Date TBC";
  const d = new Date(key + "-01T12:00:00");
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

/* ============================== LEAGUE POINTS + PROJECTION ============================== */
const PL_GAMES = 38;
// Historic points guides for a 38-game season. Positional outcomes are approximated by
// the points totals they typically require — final position still depends on rivals.
// Kept season-neutral: Champions League here means the top-4 places that qualify every
// year. England's occasional 5th place (UEFA European Performance Spot) is re-earned on
// coefficient each season and is NOT guaranteed, so it's flagged in the rules note rather
// than baked into a band.
const LEAGUE_BANDS = [
  { min: 86, key: "Title race",        note: "Champions",   tone: "#E8C15A", bg: "rgba(233,193,90,.16)" },
  { min: 70, key: "Champions League",  note: "Top 4",       tone: "#7FA8F0", bg: "rgba(127,168,240,.16)" },
  { min: 62, key: "Europa League",     note: "≈ 5th",       tone: "#B69BF0", bg: "rgba(182,155,240,.16)" },
  { min: 57, key: "Conference League", note: "≈ 6th–7th",   tone: "#5FD08A", bg: "rgba(95,208,138,.16)" },
  { min: 40, key: "Mid-table",         note: "Safe & sound", tone: "#A7B4D0", bg: "rgba(167,180,208,.14)" },
  { min: 36, key: "Survival scrap",    note: "Sweating it",  tone: "#E4A44A", bg: "rgba(228,164,74,.16)" },
  { min: 0,  key: "Relegation zone",   note: "Bottom 3",     tone: "#E88079", bg: "rgba(232,128,121,.16)" },
];
function bandFor(pts) { return LEAGUE_BANDS.find((b) => pts >= b.min) || LEAGUE_BANDS[LEAGUE_BANDS.length - 1]; }

function LeaguePoints({ list, season, variant = "full" }) {
  const strip = variant === "strip";
  const [open, setOpen] = useState(!strip);
  const [showRules, setShowRules] = useState(false);

  // Only true league games. The `cup` guard drops cup ties that were tagged
  // "Premier League" in older seasons (e.g. "Newcastle Cup", "Wolves - Cup").
  const plAll = list.filter((f) => f.competition === "Premier League" && !/cup/i.test(f.opposition || ""));
  const playedGames = plAll.filter((f) => f.result)
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const played = playedGames.length;
  const rec = { W: 0, D: 0, L: 0 };
  playedGames.forEach((f) => { if (rec[f.result] != null) rec[f.result]++; });
  const pts = rec.W * 3 + rec.D;
  const remaining = Math.max(0, PL_GAMES - played);
  const messy = played > PL_GAMES; // stray cup ties still mislabelled

  const scale = (v) => Math.max(0, Math.min(100, v));
  const ppg = played ? pts / played : 0;
  const projPace = played ? Math.round(pts + ppg * remaining) : null;

  // recent form: last 6 league games
  const formGames = playedGames.slice(-6);
  const formPts = formGames.reduce((a, f) => a + (f.result === "W" ? 3 : f.result === "D" ? 1 : 0), 0);
  const formPpg = formGames.length ? formPts / formGames.length : 0;
  const projForm = played ? Math.round(pts + formPpg * remaining) : null;

  const finished = played > 0 && remaining === 0;
  const paceBand = projPace != null ? bandFor(projPace) : null;
  const formBand = projForm != null ? bandFor(projForm) : null;
  const outcomeBand = finished ? bandFor(pts) : paceBand;

  // ladder rows with upper bounds for display
  const ladder = LEAGUE_BANDS.map((b, i) => ({
    ...b,
    hi: i === 0 ? null : LEAGUE_BANDS[i - 1].min - 1,
  }));

  return (
    <div className={`lp-panel ${strip ? "lp-panelstrip" : ""}`}>
      {strip ? (
        <button className="lp-striphead" onClick={() => setOpen((o) => !o)}>
          <span className="lp-strip-pts font-disp">{pts}</span>
          <span className="lp-strip-lbl">pts</span>
          <span className="lp-strip-proj">
            {played === 0
              ? <span className="lp-strip-muted">awaiting first result</span>
              : <>
                  <span className="lp-strip-rec font-mono">P{played} {rec.W}-{rec.D}-{rec.L}</span>
                  <span className="lp-strip-arrow">{finished ? "final" : `→ ~${projPace}`}</span>
                  <span className="lp-strip-band" style={{ color: outcomeBand.tone }}>{outcomeBand.key}</span>
                </>}
          </span>
          <ChevronDown size={16} className="lp-chev" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>
      ) : (
      <button className="lp-head" onClick={() => setOpen((o) => !o)}>
        <div className="lp-head-l">
          <span className="lp-pts font-disp">{pts}</span>
          <span className="lp-pts-lbl">league pts</span>
        </div>
        <div className="lp-head-m">
          <div className="lp-record font-mono">{played === 0 ? "No PL games played yet" : `P${played} · ${rec.W}W ${rec.D}D ${rec.L}L`}</div>
          {projPace == null
            ? <div className="lp-proj-mini">Projection appears once results are in</div>
            : finished
              ? <div className="lp-proj-mini">Finished on <b>{pts}</b> — <span style={{ color: outcomeBand.tone }}>{outcomeBand.key}</span></div>
              : <div className="lp-proj-mini">On pace for <b>~{projPace}</b> — <span style={{ color: paceBand.tone }}>{paceBand.key}</span></div>}
        </div>
        <ChevronDown size={18} className="lp-chev" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      )}

      {open && (
        <div className="lp-body">
          {messy && (
            <div className="lp-warn">{played} games are tagged “Premier League” this season — more than the 38 in a league campaign, so some cup ties are probably mislabelled. Re-tag them in a fixture's competition field to clean this up. The projection still assumes a 38-game season.</div>
          )}

          {played === 0 ? (
            <div className="lp-empty">Enter some league results and this will track your points total and project where the season's heading — {season === "26-27" ? "the 26/27 fixtures are all loaded and ready." : "based on your current pace and recent form."}</div>
          ) : (
            <>
              {/* projection scale bar */}
              <div className="lp-scale">
                <div className="lp-scale-track">
                  {LEAGUE_BANDS.map((b, i) => {
                    const left = scale(b.min);
                    const right = i === 0 ? 100 : scale(LEAGUE_BANDS[i - 1].min);
                    return <div key={b.key} className="lp-seg" style={{ left: left + "%", width: (right - left) + "%", background: b.bg }} />;
                  })}
                  <div className="lp-mark lp-mark-now" style={{ left: scale(pts) + "%" }} title={`${finished ? "Final" : "Now"}: ${pts}`} />
                  {!finished && projPace != null && <div className="lp-mark lp-mark-proj" style={{ left: scale(projPace) + "%" }} title={`Projected: ${projPace}`} />}
                </div>
                <div className="lp-scale-key">
                  <span><i className="lp-dot now" /> {finished ? "Final" : "Now"} {pts}</span>
                  {!finished && projPace != null && <span><i className="lp-dot proj" /> Projected {projPace}</span>}
                  <span className="lp-scale-max">0 – 100 pts</span>
                </div>
              </div>

              {/* two projections (in-progress only) */}
              {finished ? (
                <div className="lp-final" style={{ color: outcomeBand.tone, background: outcomeBand.bg }}>
                  Season complete · <b>{pts} pts</b> — historically a <b>{outcomeBand.key}</b> total
                </div>
              ) : (
              <div className="lp-proj-grid">
                <div className="lp-proj-card">
                  <div className="lp-proj-lbl">On current pace</div>
                  <div className="lp-proj-val font-disp">{projPace}</div>
                  <div className="lp-proj-sub font-mono">{ppg.toFixed(2)} pts/game · {remaining} left</div>
                  <div className="lp-proj-band" style={{ color: paceBand.tone, background: paceBand.bg }}>{paceBand.key}</div>
                </div>
                <div className="lp-proj-card">
                  <div className="lp-proj-lbl">On last {formGames.length} form</div>
                  <div className="lp-proj-val font-disp">{projForm}</div>
                  <div className="lp-proj-sub font-mono">{formPpg.toFixed(2)} pts/game recently</div>
                  <div className="lp-proj-band" style={{ color: formBand.tone, background: formBand.bg }}>{formBand.key}</div>
                </div>
              </div>
              )}

              {/* outcome ladder */}
              <div className="lp-ladder">
                {ladder.map((b) => {
                  const hit = outcomeBand && outcomeBand.key === b.key;
                  return (
                    <div key={b.key} className={`lp-rung ${hit ? "on" : ""}`} style={hit ? { borderColor: b.tone, background: b.bg } : undefined}>
                      <span className="lp-rung-dot" style={{ background: b.tone }} />
                      <span className="lp-rung-key" style={hit ? { color: b.tone } : undefined}>{b.key}</span>
                      <span className="lp-rung-note">{b.note}</span>
                      <span className="lp-rung-range font-mono">{b.hi == null ? `${b.min}+` : `${b.min}–${b.hi}`}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <button className="lp-rules-head" onClick={() => setShowRules((s) => !s)}>
            <span><Trophy size={13} /> How European qualification works</span>
            <ChevronDown size={15} style={{ transform: showRules ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>
          {showRules && (
            <div className="lp-rules">
              <p><b>Champions League — top 4.</b> Plus any English side that wins the Champions or Europa League qualifies automatically, even from outside the top 4.</p>
              <p><b>Europa League — 5th</b>, plus the <b>FA Cup winners</b>.</p>
              <p><b>Conference League — League Cup (Carabao) winners</b> (≈ 6th–7th if a cup winner has already qualified).</p>
              <p><b>Relegation — bottom 3</b> (18th–20th).</p>
              <p className="lp-rules-note"><b>The 5th place flag:</b> England had a bonus Champions League place (UEFA's European Performance Spot) in 25/26 and 26/27, but it's re‑earned every season on coefficient and isn't guaranteed to continue. These bands assume the standard top‑4 cut. If England keep the 5th spot, everything below the title effectively shifts down a place. Bands are historic points guides — final position depends on how everyone else does.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Kick-off times only ever land on the quarter hour, so the minute picker only offers
   those four. The chips cover the times football actually kicks off at. */
const KICKOFFS = ["12:30", "14:00", "15:00", "16:30", "17:30", "19:00", "19:45", "20:00", "21:00"];
function KickoffField({ value, onChange }) {
  const [h, m] = String(value || "").split(":");
  const set = (hh, mm) => onChange(hh ? `${hh}:${mm || "00"}` : "");
  return (
    <div className="ko-field">
      <div className="ko-selects">
        <select className="inp font-mono ko-sel" value={h || ""} onChange={(e) => set(e.target.value, m)}>
          <option value="">--</option>
          {Array.from({ length: 24 }, (_, i) => pad2(i)).map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        <span className="ko-colon font-mono">:</span>
        <select className="inp font-mono ko-sel" value={m || "00"} onChange={(e) => set(h || "15", e.target.value)}>
          {["00", "15", "30", "45"].map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        {value ? <button className="ko-clear" onClick={() => onChange("")} aria-label="Clear kick-off"><X size={14} /></button> : null}
      </div>
      <div className="ko-quick">
        {KICKOFFS.map((k) => (
          <button key={k} type="button" className={`ko-chip ${value === k ? "on" : ""}`} onClick={() => onChange(value === k ? "" : k)}>{k}</button>
        ))}
      </div>
    </div>
  );
}

/* When a game is finished with, for list purposes. For games Dom was at, a score isn't
   the end of it — the post-match write-up usually lands hours or days later, so a game
   only tucks away once "what actually happened" or "after the final whistle" has been
   written. Anything else, the result is all there is to log, so the result is enough. */
function fxDone(f) {
  if (!f.result) return false;
  if (!scannedIn(f)) return true;
  const j = f.journal;
  return !!(j && ((j.matchFacts && j.matchFacts.trim()) || (j.postNote && j.postNote.trim())));
}

function FixturesView({ list, season, onOpen, onAdd }) {
  const [q, setQ] = useState("");
  const [only, setOnly] = useState("all");
  const [collapsed, setCollapsed] = useState({});
  const [showDone, setShowDone] = useState({});
  const [flash, setFlash] = useState(null);
  const [showTV, setShowTV] = useState(false);
  const filtered = list.filter((f) => {
    if (q && !f.opposition.toLowerCase().includes(q.toLowerCase())) return false;
    if (only === "went" && !attended(f)) return false;
    if (only === "unconfirmed" && f.dateConfirmed) return false;
    return true;
  });
  // A month folds itself away once every game in it has been logged — a result in, or
  // a journal written — so the season already dealt with stops getting in the way.
  function monthLogged(items) {
    return items.length > 0 && items.every((f) => {
      if (f.result) return true;
      const j = f.journal;
      return !!(j && (j.body || j.title || j.mood || j.matchFacts || j.lifeNote || j.postNote || (j.pubs && j.pubs.length)));
    });
  }
  function monthSummary(items) {
    const r = { W: 0, D: 0, L: 0 };
    items.forEach((f) => { if (r[f.result] != null) r[f.result]++; });
    return [r.W ? r.W + "W" : null, r.D ? r.D + "D" : null, r.L ? r.L + "L" : null].filter(Boolean).join(" ");
  }
  // group by month, preserving sorted order
  const groups = [];
  const idx = {};
  filtered.forEach((f) => {
    const k = monthKey(f);
    if (idx[k] === undefined) { idx[k] = groups.length; groups.push({ key: k, items: [] }); }
    groups[idx[k]].items.push(f);
  });
  // An explicit tap always wins; otherwise a fully-logged month defaults to folded.
  const isCollapsed = (g) => (collapsed[g.key] !== undefined ? collapsed[g.key] : monthLogged(g.items));
  function toggle(g) { const now = isCollapsed(g); setCollapsed((c) => ({ ...c, [g.key]: !now })); }
  const allCollapsed = groups.length > 0 && groups.every(isCollapsed);
  function toggleAll() { const v = !allCollapsed; const next = {}; groups.forEach((g) => (next[g.key] = v)); setCollapsed(next); }

  // Jump to the next game — unfolds whatever month it's in, scrolls to it and gives it a
  // flash so it's obvious where you landed. Saves scrolling past a season of folded months.
  const todayISO = new Date().toISOString().slice(0, 10);
  const nextUp = filtered.find((f) => !f.result && (f.date || "9999-99-99") >= todayISO);
  function jumpToNext() {
    if (!nextUp) return;
    const g = groups.find((x) => x.items.some((i) => i.id === nextUp.id));
    if (g) setCollapsed((c) => ({ ...c, [g.key]: false }));
    setTimeout(() => {
      const el = document.getElementById("fx-" + nextUp.id);
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      setFlash(nextUp.id);
      setTimeout(() => setFlash(null), 1900);
    }, 80);
  }

  // The hero always shows the next game of the season, whatever filter is on.
  const heroNext = list.find((f) => f.opposition && !f.result && (f.date || "9999-99-99") >= todayISO);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div>
      {heroNext && <NextGameHero f={heroNext} onOpen={onOpen} />}

      <div className="toolbar">
        <div className="chips">
          <button className={`chip ${only === "all" ? "on" : ""}`} onClick={() => setOnly("all")}>All</button>
          <button className={`chip ${only === "went" ? "on" : ""}`} onClick={() => setOnly(only === "went" ? "all" : "went")}>My games</button>
          <button className={`chip ${only === "unconfirmed" ? "on" : ""}`} onClick={() => setOnly(only === "unconfirmed" ? "all" : "unconfirmed")}><Clock size={12} /> TBC dates</button>
          {nextUp && <button className="chip next" onClick={jumpToNext}><ArrowLeft size={12} style={{ transform: "rotate(-90deg)" }} /> Next game</button>}
          {groups.length > 1 && <button className="chip ghost" onClick={toggleAll}>{allCollapsed ? "Expand all" : "Collapse all"}</button>}
        </div>
        <button className={`chip-icon ${searchOpen || q ? "on" : ""}`} onClick={() => setSearchOpen((o) => !o)} aria-label="Find opponent" aria-expanded={searchOpen || !!q}><Search size={16} /></button>
      </div>
      {(searchOpen || q) && (
        <div className="search">
          <Search size={15} />
          <input placeholder="Find opponent" value={q} onChange={(e) => setQ(e.target.value)} autoFocus={searchOpen && !q} />
          {q ? <button className="search-x" onClick={() => setQ("")} aria-label="Clear search"><X size={14} /></button> : null}
        </div>
      )}

      {season === "26-27" && (
        <div className="tv-panel">
          <button className="tv-head" onClick={() => setShowTV((s) => !s)}>
            <span><Tv size={14} /> When will dates be confirmed?</span>
            <ChevronDown size={16} style={{ transform: showTV ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>
          {showTV && (
            <div className="tv-body">
              <div className="tv-note">Estimated dates the Premier League announces TV‑rescheduled fixtures. Until then, games stay provisional.</div>
              {TV_DATES.map((r, i) => (
                <div key={i} className="tv-row font-mono"><span className="tv-when">{r[2]}</span><span className="tv-per">{r[0]}</span><span className="tv-mw">{r[1]}</span></div>
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <Empty title="No games here yet" line="Add the new season's fixtures to start planning." />
      ) : (
        <div className="fx-groups">
          {groups.map((g) => {
            // Within a part-played month, the games already dealt with tuck behind a strip
            // so the next one is at the top. A month where everything is done keeps the
            // old behaviour — it folds whole, and expanding it shows the lot.
            const done = g.items.filter(fxDone);
            const live = g.items.filter((f) => !fxDone(f));
            const partial = done.length > 0 && live.length > 0;
            const revealed = !!showDone[g.key];
            const rows = partial && !revealed ? live : g.items;
            return (
            <div key={g.key} className={`fx-month ${isCollapsed(g) ? "folded" : ""}`}>
              <button className="fx-month-head" onClick={() => toggle(g)} aria-expanded={!isCollapsed(g)}>
                <span className="fx-month-name font-disp">{monthLabel(g.key)}</span>
                {isCollapsed(g) && monthSummary(g.items) && <span className="fx-month-sum">{monthSummary(g.items)}</span>}
                <span className="fx-month-count">{g.items.length}</span>
                <ChevronDown size={16} className="fx-chev" style={{ transform: isCollapsed(g) ? "rotate(-90deg)" : "none" }} />
              </button>
              {/* Rows stay mounted so the month can fold and unfold smoothly. */}
              <div className={`fx-fold ${isCollapsed(g) ? "" : "open"}`} inert={isCollapsed(g) ? "" : undefined}>
                <div className="fx-fold-in">
                  <div className="fx-list">
                    {partial && (
                      <button className="fx-done-strip" onClick={() => setShowDone((sd) => ({ ...sd, [g.key]: !revealed }))}>
                        <ChevronDown size={13} style={{ transform: revealed ? "rotate(180deg)" : "rotate(-90deg)", transition: "transform .2s" }} />
                        {done.length} done{revealed ? "" : ` · show`}
                        {revealed ? " · hide" : ""}
                      </button>
                    )}
                    {rows.map((f) => <FixtureRow key={f.id} f={f} onOpen={onOpen} flash={flash === f.id} />)}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      <LeaguePoints list={list} season={season} variant="strip" />
    </div>
  );
}

/* Next game hero. The countdown ticks: whole days while it's a way off, then once
   kick-off is under a day away (and the time is known) it counts down to the second. */
function kickoffAt(f) {
  if (!f.date) return null;
  const t = new Date(`${f.date}T${f.kickoff || "12:00"}:00`);
  return isNaN(t) ? null : t;
}
function useNow(stepMs) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), stepMs); return () => clearInterval(id); }, [stepMs]);
  return now;
}
function NextGameHero({ f, onOpen }) {
  const at = kickoffAt(f);
  const close = at && f.kickoff && at - Date.now() < 86400000;
  const now = useNow(close ? 1000 : 60000);
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const days = f.date ? Math.round((new Date(f.date + "T12:00:00") - today - 43200000) / 86400000) : null;
  let big, small;
  if (!f.date) { big = "TBC"; small = f.dateText || "Date TBC"; }
  else if (close && at - now > 0) {
    const s = Math.floor((at - now) / 1000);
    big = `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`;
    small = "to kick-off";
  } else if (days <= 0) { big = "Today"; small = fmtDate(f.date); }
  else if (days === 1) { big = "Tomorrow"; small = fmtDate(f.date); }
  else { big = `${days} days`; small = fmtDate(f.date); }
  const known = ["H", "A", "N"].includes(f.venue);
  const venueWord = f.venue === "H" ? "Home" : f.venue === "A" ? "Away" : f.venue === "N" ? "Neutral" : "Venue TBC";
  const tone = ATT[f.attending]?.tone || "muted";
  return (
    <button className="hero" onClick={() => onOpen(f.id)}>
      <span className="hero-glow" aria-hidden />
      <span className="hero-top">
        <span className="hero-lbl">Next game</span>
        <span className={`hero-status t-${tone}`}>{attLabel(f.attending, true)}</span>
      </span>
      <span className="hero-pre">{f.venue === "A" ? "Away at" : known ? "Chelsea v" : "v"}</span>
      <span className="hero-opp font-disp">{f.opposition}</span>
      <span className="hero-tiles">
        <span className="hero-tile">
          <span key={big} className="hero-k font-disp tick">{big}</span>
          <span className="hero-l">{small}{f.date && !f.dateConfirmed ? " · provisional" : ""}</span>
        </span>
        <span className="hero-tile">
          <span className="hero-k font-disp">{f.kickoff || "TBC"}</span>
          <span className="hero-l">Kick-off{f.broadcaster ? ` · ${f.broadcaster}` : ""}</span>
        </span>
        <span className="hero-tile">
          <span className="hero-k font-disp">{f.lps != null ? `${f.lps} LP` : "—"}</span>
          <span className="hero-l">{venueWord} · {COMP_SHORT[f.competition] || f.competition}</span>
        </span>
      </span>
    </button>
  );
}

function FixtureRow({ f, onOpen, flash }) {
  const cg = chelseaGoals(f);
  const hasNotes = !!(f.journal && (f.journal.body || f.journal.title || f.journal.matchFacts || f.journal.lifeNote || (f.journal.pubs && f.journal.pubs.length)));
  const known = ["H", "A", "N"].includes(f.venue);
  const vcls = known ? f.venue : "q";
  const vchar = known ? f.venue : "?";
  const isFuture = !f.result;
  const tint = COMP_TINT[f.competition] || "";
  // Big day number + weekday on the left when there's a real date; otherwise the
  // free-text date (or TBC) sits there instead.
  const dt = f.date ? new Date(f.date + "T12:00:00") : null;
  const okDate = dt && !isNaN(dt);
  const tone = ATT[f.attending]?.tone || "muted";
  return (
    <button id={`fx-${f.id}`} className={`fx-row ${flash ? "flash" : ""} ${f.result ? "played" : ""}`} onClick={() => onOpen(f.id)}>
      <div className="fx-date">
        {okDate ? (
          <>
            <span className="fx-day font-disp">{dt.getDate()}</span>
            <span className="fx-dow">{dt.toLocaleDateString("en-GB", { weekday: "short" })}</span>
          </>
        ) : <span className="fx-d">{fmtDate(f.date, f.dateText)}</span>}
      </div>
      <div className="fx-mid">
        <div className="fx-top">
          <span className="fx-opp">{f.opposition || "—"}</span>
          {hasNotes && <span className="has-notes" aria-label="Has journal notes"><NotebookPen size={13} /></span>}
        </div>
        <div className="fx-meta">
          <span className={`vchip v-${vcls}`}>{vchar}</span>
          <span className={`comp-tag c-${String(COMP_SHORT[f.competition] || "x").replace("—", "x")}`}>{COMP_SHORT[f.competition] || f.competition}</span>
          {f.kickoff && <span className="fx-ko">{f.kickoff}</span>}
          {f.broadcaster && <span className="fx-bc">{f.broadcaster}</span>}
          {!f.dateConfirmed && <span className="tbc">TBC</span>}
        </div>
        <div className="fx-meta">
          <span className={`att t-${tone}`}><span className="att-dot" />{attLabel(f.attending, isFuture)}</span>
          {f.attendee && <span className="attendee">· {f.attendee}</span>}
        </div>
      </div>
      <div className="fx-right">
        <div className="fx-score font-disp">{f.score || "·"}</div>
        <ResultPill r={f.result} />
        {f.lps != null && <span className="lp-tag">{f.lps} LP</span>}
        {f.lpRequired != null && <span className="need-tag">needs {f.lpRequired}</span>}
      </div>
    </button>
  );
}

/* ============================== MATCHDAY (journal-first list) ============================== */
function JournalCard({ f, onOpen }) {
  const [open, setOpen] = useState(false);
  const j = f.journal || {};
  const pubs = j.pubs || [];
  const firstPub = pubs.find((p) => p.name) || pubs[0];
  const allBeers = fxBeers(f);
  const pints = allBeers.reduce((a, b) => a + (b.qty || 0), 0);
  return (
    <div className={`jr ${open ? "open" : ""}`} onClick={() => setOpen((o) => !o)}>
      <div className="jr-head">
        <span className="font-disp jr-opp">{f.opposition}</span>
        <span className="jr-date font-mono">{fmtDate(f.date, f.dateText)}</span>
      </div>
      {firstPub && firstPub.name && (
        <div className="jr-pub"><MapPin size={12} /> {firstPub.name}{pubs.length > 1 ? ` +${pubs.length - 1}` : ""}{firstPub.pint ? ` · ${firstPub.pint.toFixed(1)}★` : ""}</div>
      )}
      {j.mood && <div className="jr-mood">{j.mood}</div>}
      {!open && j.body && <div className="jr-body">{j.body}</div>}

      {open && (
        <div className="jr-full">
          {pubs.map((p) => (
            <div key={p.id} className="jr-pubrow">
              <span className="jr-pubname">{p.name || "Pub"}
                {p.pint ? <span className="jr-rate"><Beer size={12} aria-label="Pint" /> {p.pint.toFixed(1)}</span> : null}
                {p.ambience ? <span className="jr-rate"><Sparkles size={12} aria-label="Ambience" /> {p.ambience.toFixed(1)}</span> : null}
                {p.special ? <span className="jr-rate gold"><Star size={12} fill="currentColor" aria-label="Special mention" /></span> : null}
              </span>
              {(p.beers || []).length > 0 && <span className="jr-pubbeers font-mono">{(p.beers || []).map((b) => `${b.qty}× ${b.name}`).join(", ")}</span>}
              {p.note && <div className="jr-pubnote">{p.note}</div>}
            </div>
          ))}
          {(f.groundBeers || []).length > 0 && (
            <div className="jr-pubrow"><span className="jr-pubname">Inside the ground</span><span className="jr-pubbeers font-mono">{f.groundBeers.map((b) => `${b.qty}× ${b.name}`).join(", ")}</span></div>
          )}
          {j.withWho && <div className="jr-with">With: {j.withWho}</div>}
          {j.body && <div className="jr-bodyfull">{j.body}</div>}
          {j.matchFacts && <div className="jr-post"><span className="jr-post-lbl">On the pitch</span>{j.matchFacts}</div>}
          {j.postNote && <div className="jr-post"><span className="jr-post-lbl">After the whistle</span>{j.postNote}</div>}
          {j.lifeNote && <div className="jr-post"><span className="jr-post-lbl">Beyond the football</span>{j.lifeNote}</div>}
          {f.rating ? <div className="jr-rating">★ {f.rating}/10 day out</div> : null}
        </div>
      )}

      <div className="jr-foot">
        {pints > 0 && <span className="jr-beers"><Beer size={12} /> {pints} pints</span>}
        <button className="jr-edit" onClick={(e) => { e.stopPropagation(); onOpen(f.id); }}><Pencil size={12} /> Edit</button>
      </div>
    </div>
  );
}

function MatchdayView({ list, onOpen }) {
  const withEntries = list.filter((f) => f.journal && (f.journal.body || f.journal.title || f.journal.mood || f.journal.matchFacts || f.journal.lifeNote || (f.journal.pubs && f.journal.pubs.length)));
  const attendList = list.filter((f) => attended(f) && f.opposition);
  const byDateAsc = (a, b) => (a.date || "9999-99") < (b.date || "9999-99") ? -1 : 1;
  const next = attendList.filter((f) => !f.result).sort(byDateAsc)[0]
    || [...attendList.filter((f) => f.result)].sort(byDateAsc).slice(-1)[0];

  return (
    <div>
      {next && (
        <div className="md-next">
          <div className="md-next-lbl">Next one to log</div>
          <button className="md-next-card" onClick={() => onOpen(next.id)}>
            <div>
              <div className="font-disp md-next-opp">{next.opposition || "TBC"}</div>
              <div className="md-next-sub">{fmtDate(next.date, next.dateText)} · {next.venue === "H" ? "Home" : next.venue === "A" ? "Away" : "Neutral"} · {next.competition}</div>
            </div>
            <NotebookPen size={22} />
          </button>
        </div>
      )}

      <SectionTitle>Journal</SectionTitle>
      {withEntries.length === 0 ? (
        <Empty title="No entries this season" line="Open a game and jot down the pubs, the mood, the pints. That's the whole point." />
      ) : (
        <div className="journal-list">
          {withEntries.map((f) => <JournalCard key={f.id} f={f} onOpen={onOpen} />)}
        </div>
      )}
    </div>
  );
}

/* ============================== BEER TAB ============================== */
/* Pints v Goals. Both bars come from exactly the same games — competitive games you were
   at AND logged pints for — so a half-logged season can't flatter either side. Goals rather
   than points: they work for cup ties too, and land on a similar scale to pints. */
function PintsVsGoals({ list }) {
  const atGames = list.filter((f) => scannedIn(f) && countsToRecord(f) && f.result);
  const games = atGames.filter((f) => fxBeers(f).length > 0);
  const pints = games.reduce((a, f) => a + fxBeers(f).reduce((x, b) => x + (b.qty || 0), 0), 0);
  const goals = games.reduce((a, f) => a + (chelseaGoals(f) || 0), 0);
  const unlogged = atGames.length - games.length;
  if (!games.length) return null;

  const H = 140;
  const max = Math.max(pints, goals, 1);
  const verdict = !goals ? `${pints} pints, not a single goal. Chin up.`
    : pints / goals >= 1.5 ? `${(pints / goals).toFixed(1)} pints per goal. The Guinness is well clear.`
    : pints > goals ? `${(pints / goals).toFixed(1)} pints per goal. The Guinness just edges it.`
    : pints === goals ? "A pint a goal. Perfectly balanced, as all things should be."
    : `${(goals / pints).toFixed(1)} goals per pint — the football's ahead, for now.`;

  return (
    <div className="pvp">
      <div className="pvp-head">
        <span className="font-disp">Pints v Goals</span>
        <span className="pvp-sub">games you were at and logged pints for</span>
      </div>
      <div className="pvp-chart">
        {[{ k: "pints", v: pints, lbl: "Pints" }, { k: "points", v: goals, lbl: "Goals" }].map((c) => (
          <div key={c.k} className="pvp-col">
            <span className="pvp-val font-mono">{c.v}</span>
            <div className={`pvp-bar ${c.k}`} style={{ height: Math.max(4, Math.round((c.v / max) * H)) + "px" }} />
            <span className="pvp-lbl">{c.lbl}</span>
          </div>
        ))}
      </div>
      <div className={`pvp-verdict ${pints > goals ? "beer" : ""}`}>{verdict}</div>
      <div className="pvp-caveat">
        Across {games.length} game{games.length === 1 ? "" : "s"} · {(pints / games.length).toFixed(1)} pints and {(goals / games.length).toFixed(1)} goals a game.
        {unlogged > 0 ? ` Log pints for the other ${unlogged} game${unlogged === 1 ? "" : "s"} you were at and ${unlogged === 1 ? "it joins" : "they join"} in.` : ""}
      </div>
    </div>
  );
}

function BeerView({ list, season, onOpen }) {
  const all = list.flatMap((f) => fxBeers(f).map((b) => ({ ...b, fx: f })));
  const totalPints = all.reduce((a, b) => a + (b.qty || 0), 0);
  const totalSpend = all.reduce((a, b) => a + (b.price || 0) * (b.qty || 0), 0);
  const avg = totalPints ? totalSpend / totalPints : 0;
  const priced = all.filter((b) => b.price > 0);
  const dearest = priced.reduce((m, b) => (b.price > (m ? m.price : -1) ? b : m), null);
  const cheapest = priced.reduce((m, b) => (b.price < (m ? m.price : Infinity) ? b : m), null);
  const ground = all.filter((b) => b.ground);
  const groundPints = ground.reduce((a, b) => a + (b.qty || 0), 0);
  const groundSpend = ground.reduce((a, b) => a + (b.price || 0) * (b.qty || 0), 0);
  // Everything that wasn't bought inside the ground — the pub half of the day.
  const pubOnly = all.filter((b) => !b.ground);
  const pubPints = pubOnly.reduce((a, b) => a + (b.qty || 0), 0);
  const pubSpend = pubOnly.reduce((a, b) => a + (b.price || 0) * (b.qty || 0), 0);
  // Averaged over games you actually logged pints for, not every game in the season —
  // otherwise a season you only half-logged reads as though you barely drank.
  const loggedGames = list.filter((f) => fxBeers(f).length > 0).length;
  const avgPerGame = loggedGames ? totalPints / loggedGames : 0;
  const byPub = {};
  all.forEach((b) => { const k = String(b.pub || "").trim() || "Pub not noted"; byPub[k] = byPub[k] || { pub: k, pints: 0, spend: 0 }; byPub[k].pints += b.qty || 0; byPub[k].spend += (b.price || 0) * (b.qty || 0); });
  const pubs = Object.values(byPub).sort((a, b) => b.pints - a.pints);
  const byBeer = {};
  all.forEach((b) => { const k = b.name || "Unknown"; byBeer[k] = (byBeer[k] || 0) + (b.qty || 0); });
  const topBeers = Object.entries(byBeer).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const ratedPubs = list.flatMap((f) => ((f.journal && f.journal.pubs) || []).map((p) => ({ ...p, fx: f })));
  const ambRated = ratedPubs.filter((p) => p.ambience);
  const pintRated = ratedPubs.filter((p) => p.pint);
  const avgAmb = ambRated.length ? ambRated.reduce((a, p) => a + p.ambience, 0) / ambRated.length : null;
  const avgPint = pintRated.length ? pintRated.reduce((a, p) => a + p.pint, 0) / pintRated.length : null;
  const bestPub = ambRated.slice().sort((a, b) => b.ambience - a.ambience)[0];
  const bestPint = pintRated.slice().sort((a, b) => b.pint - a.pint)[0];
  const specials = ratedPubs.filter((p) => p.special);

  return (
    <div className="beer-view">
      {/* Hero: the two headline numbers, then the averages underneath */}
      <section className="hero beer-hero">
        <span className="hero-glow gold" aria-hidden />
        <span className="hero-lbl">{String(season || "").replace("-", "/")} bar tab</span>
        <div className="bh-pair">
          <div className="bh-big"><span className="bh-k font-disp">{totalPints}</span><span className="bh-l">Pints sunk</span></div>
          <div className="bh-big"><span className="bh-k font-disp gold">{money(totalSpend)}</span><span className="bh-l">Spent on beer</span></div>
        </div>
        <div className="hero-tiles two">
          <span className="hero-tile"><span className="hero-k font-disp">{money2(avg)}</span><span className="hero-l">Avg / pint</span></span>
          <span className="hero-tile"><span className="hero-k font-disp">{avgPerGame ? avgPerGame.toFixed(1) : "—"}</span><span className="hero-l">Avg pints / game</span></span>
        </div>
        {loggedGames > 0 && (
          <div className="beer-note">Averaged across the {loggedGames} game{loggedGames === 1 ? "" : "s"} you've logged pints for this season.</div>
        )}
      </section>

      {/* Pub half v ground half */}
      <div className="split-card">
        <div className="split-row head"><span /><span>Pints</span><span>Spend</span></div>
        <div className="split-row"><span className="split-k"><i className="dot gold" />Pints in pubs</span><span className="font-disp">{pubPints}</span><span className="font-disp gold" aria-label="Pub spend">{money(pubSpend)}</span></div>
        <div className="split-row"><span className="split-k"><i className="dot blue" />Pints inside grounds</span><span className="font-disp">{groundPints}</span><span className="font-disp gold" aria-label="Ground spend">{money(groundSpend)}</span></div>
      </div>

      <PintsVsGoals list={list} />

      {topBeers.length > 0 && (
        <div className="top3">
          <div className="top3-lbl font-disp">Most‑ordered tipples</div>
          <div className="list-card">
            {topBeers.map(([name, qty], i) => (
              <div key={name} className={`top3-row ${i === 0 ? "first" : ""}`}>
                <span className="top3-rank font-disp">{i + 1}</span>
                <span className="top3-mid">
                  <span className="top3-name">{name}</span>
                  <span className="top3-bar"><span style={{ width: (qty / topBeers[0][1] * 100) + "%" }} /></span>
                </span>
                <span className="top3-qty font-disp">{qty}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(avgPint || avgAmb || specials.length > 0) ? (
        <div className="rate-box">
          <div className="rate-metrics">
            <div className="rate-m"><span className="rate-k font-disp">{avgPint ? avgPint.toFixed(1) : "–"}</span><span className="rate-l">Avg pint</span></div>
            <div className="rate-m"><span className="rate-k font-disp">{avgAmb ? avgAmb.toFixed(1) : "–"}</span><span className="rate-l">Avg ambience</span></div>
            <div className="rate-m"><span className="rate-k font-disp">{specials.length}</span><span className="rate-l">Special mentions</span></div>
          </div>
          {bestPint && <div className="rate-best"><span className="rate-best-lbl"><Beer size={14} /> Best pint</span><span className="rate-best-val">{bestPint.name || "?"} <span className="muted">· {bestPint.fx.opposition} · {bestPint.pint.toFixed(1)}</span></span></div>}
          {bestPub && <div className="rate-best"><span className="rate-best-lbl"><Sparkles size={14} /> Best ambience</span><span className="rate-best-val">{bestPub.name || "?"} <span className="muted">· {bestPub.fx.opposition} · {bestPub.ambience.toFixed(1)}</span></span></div>}
          {specials.length > 0 && <div className="rate-specials">{specials.map((p, i) => <span key={i} className="rate-special-chip"><Star size={11} fill="currentColor" /> {p.name || "?"}</span>)}</div>}
        </div>
      ) : (
        <div className="rate-box rate-empty">
          <div className="rate-empty-icon" aria-hidden><Beer size={22} /></div>
          <div className="rate-empty-title font-disp">No pint scores yet</div>
          <div className="rate-empty-sub">Open a game you went to, add a pub in its journal and tap a <b>Pint quality</b> score. Your average pint, best ambience and special mentions will start building here.</div>
        </div>
      )}

      <div className="two-col pint-pair" style={{ marginTop: 14 }}>
        {dearest && (
          <div className="shame">
            <div className="shame-lbl"><Wine size={14} /> Dearest pint</div>
            <div className="shame-row">
              <span className="font-disp shame-price">{money2(dearest.price)}</span>
              <span className="shame-name">{dearest.name} · {dearest.pub || "?"} <span className="muted">({dearest.fx.opposition})</span></span>
            </div>
          </div>
        )}
        {cheapest && (
          <div className="shame cheap">
            <div className="shame-lbl"><Beer size={14} /> Cheapest pint</div>
            <div className="shame-row">
              <span className="font-disp shame-price">{money2(cheapest.price)}</span>
              <span className="shame-name">{cheapest.name} · {cheapest.pub || "?"} <span className="muted">({cheapest.fx.opposition})</span></span>
            </div>
          </div>
        )}
      </div>

      <div className="sec-row"><SectionTitle>The tab, by pub</SectionTitle>{pubs.length > 0 && <span className="sec-aside">{pubs.length} pub{pubs.length === 1 ? "" : "s"}</span>}</div>
      {pubs.length === 0 ? (
        <Empty title="Tab's empty" line="Log a round inside a game and it lands here as a running total." />
      ) : (
        <div className="receipt">
          <div className="receipt-head">{season} SEASON · BAR TAB</div>
          {pubs.map((p) => (
            <div key={p.pub} className="receipt-row">
              <span className="r-name">{p.pub}</span>
              <span className="r-qty">{p.pints}p</span>
              <span className="r-amt">{money(p.spend)}</span>
            </div>
          ))}
          <div className="receipt-row total">
            <span className="r-name font-disp">TOTAL</span>
            <span className="r-qty">{totalPints}p</span><span className="r-amt font-disp">{money(totalSpend)}</span>
          </div>
        </div>
      )}
      {pubs.length > 0 && <div className="receipt-foot">cheers, dom — keep the receipts</div>}
    </div>
  );
}

/* ============================== STATS ============================== */
function StatsView({ list, season, settings, setSettings }) {
  const [showSetup, setShowSetup] = useState(false);
  const went = list.filter((f) => scannedIn(f) && countsToRecord(f));
  const rec = { W: 0, D: 0, L: 0 };
  went.forEach((f) => { if (rec[f.result] != null) rec[f.result]++; });
  const games = rec.W + rec.D + rec.L;
  const lpStart = (settings.lpStart || {})[season] || 0;
  const cupScheme = !!((settings.cupScheme || {})[season]);
  const cupBonus = cupScheme ? 10 : 0;
  const earned = list.reduce((a, f) => a + (earnsLP(f) ? (f.lps || 0) : 0), 0);
  const lpTotal = lpStart + cupBonus + earned;
  const seatUsage = list.filter(seatUsed).length;
  const seatTarget = 13;
  const stCost = (settings.stCost || {})[season] || 0;
  const myCost = list.reduce((a, f) => a + (f.myCost || 0), 0);
  const ticketSpend = stCost + myCost;
  const goals = went.reduce((a, f) => a + (chelseaGoals(f) || 0), 0);
  const costPerWin = rec.W ? ticketSpend / rec.W : 0;
  const costPerGoal = goals ? ticketSpend / goals : 0;
  const batch1 = (settings.batch1 || {})[season];

  const allPlayed = list.filter((f) => f.result && countsToRecord(f));
  const allW = allPlayed.filter((f) => f.result === "W").length;
  const charmWent = games ? Math.round((rec.W / games) * 100) : 0;
  const charmAll = allPlayed.length ? Math.round((allW / allPlayed.length) * 100) : 0;
  const attRate = allPlayed.length ? Math.round((allPlayed.filter(scannedIn).length / allPlayed.length) * 100) : null;
  const preds = list.filter((f) => f.prediction && f.result && parseScore(f.prediction));
  const predHits = preds.filter((f) => autoResult(f.prediction) === f.result).length;
  const predAcc = preds.length ? Math.round((predHits / preds.length) * 100) : null;
  const predExact = preds.filter((f) => f.prediction.replace(/\s/g, "") === (f.score || "").replace(/\s/g, "")).length;

  const byOpp = {};
  went.filter((f) => f.result).forEach((f) => {
    const k = f.opposition.replace(/\s*\(.*?\)|cup|final|semi|replay/gi, "").trim() || f.opposition;
    byOpp[k] = byOpp[k] || { opp: k, W: 0, D: 0, L: 0 };
    byOpp[k][f.result]++;
  });
  const oppRows = Object.values(byOpp).map((o) => ({ ...o, n: o.W + o.D + o.L, pts: o.W * 3 + o.D }))
    .filter((o) => o.n >= 2).sort((a, b) => (b.pts / b.n) - (a.pts / a.n));
  const happy = oppRows.slice(0, 4);
  const bogey = [...oppRows].reverse().slice(0, 4);

  const leagueOrder = list.filter((f) => f.competition === "Premier League" && f.opposition && f.date).sort((a, b) => a.date < b.date ? -1 : 1);
  const gameNo = {}; leagueOrder.forEach((f, i) => (gameNo[f.id] = i + 1));
  const pointsAtSale = (f) => f.saleDate ? lpStart + cupBonus + list.reduce((a, g) => a + ((g.date && g.date < f.saleDate && earnsLP(g)) ? (g.lps || 0) : 0), 0) : lpTotal;
  // Only games actually sold on loyalty points — i.e. ones with a Batch 1 cut-off logged.
  // An allocation or sale date on its own doesn't put a game in here.
  const loyaltySales = list.filter(hasCutoff)
    .sort((a, b) => ((a.saleDate || a.date || "9999") < (b.saleDate || b.date || "9999") ? -1 : 1));
  const todayISO = new Date().toISOString().slice(0, 10);
  // Where the points actually get you. Ranked by how tough the cut-off is rather than by
  // the calendar, so the headline is "what can I get into" not "whatever's next up".
  const withReq = list.filter(hasCutoff);
  const cleared = withReq.filter((f) => lpTotal >= f.lpRequired).sort((a, b) => b.lpRequired - a.lpRequired);
  const missedOut = withReq.filter((f) => lpTotal < f.lpRequired).sort((a, b) => a.lpRequired - b.lpRequired);
  const toughestCleared = cleared[0];
  const nextRung = missedOut[0];
  const withAlloc = withReq.filter((f) => f.allocation != null);
  const allocBands = [
    { lbl: "Big allocations", note: "2,500+", rows: withAlloc.filter((f) => f.allocation >= 2500) },
    { lbl: "Smaller allocations", note: "under 2,500", rows: withAlloc.filter((f) => f.allocation < 2500) },
  ].filter((b) => b.rows.length > 0);
  const nextSale = loyaltySales.find((f) => (f.saleDate || f.date || "") >= todayISO && f.lpRequired != null);
  const nextReq = nextSale ? nextSale.lpRequired : null;
  const pct = nextReq ? Math.min(100, Math.round((lpTotal / nextReq) * 100)) : 0;
  const setStCost = (v) => setSettings((s) => ({ ...s, stCost: { ...(s.stCost || {}), [season]: v } }));
  const setLpStart = (v) => setSettings((s) => ({ ...s, lpStart: { ...(s.lpStart || {}), [season]: v } }));
  const toggleCupScheme = () => setSettings((s) => ({ ...s, cupScheme: { ...(s.cupScheme || {}), [season]: !((s.cupScheme || {})[season]) } }));

  return (
    <div>
      {/* LOYALTY — dynamic */}
      <div className="card lp-card">
        <span className="hero-glow" aria-hidden />
        <div className="card-head">
          <span className="hero-lbl">Loyalty points</span>
          <span className="lp-season-tag">{season}</span>
        </div>
        <div className="lp-big"><span className="font-disp">{lpTotal}</span><span className="lp-of font-disp"> pts</span></div>
        <div className="lp-sub hero-tiles" aria-label={[lpStart ? `${lpStart} carried over` : null, cupBonus ? `${cupBonus} cup scheme` : null, `${earned} earned`].filter(Boolean).join(" + ")}>
          {[lpStart ? [lpStart, "carried over"] : null, cupBonus ? [cupBonus, "cup scheme"] : null, [earned, "earned"]].filter(Boolean).map(([k, l]) => (
            <span key={l} className="hero-tile"><span className="hero-k font-disp">{k}</span><span className="hero-l">{l}</span></span>
          ))}
        </div>
        {withReq.length > 0 && (
          <div className="lp-reach">
            <div className="lp-reach-top">
              <span className="lp-reach-k font-disp">{cleared.length}<span className="lp-reach-of">/{withReq.length}</span></span>
              <span className="lp-reach-l">of the away games you've logged a cut-off for, you'd make Batch 1</span>
            </div>
            <div className="lp-reach-bar">
              {[...cleared].reverse().concat(missedOut).map((f) => (
                <span key={f.id} className={`lp-rb ${lpTotal >= f.lpRequired ? "ok" : ""}`} title={`${f.opposition} · needs ${f.lpRequired}`} />
              ))}
            </div>
            {toughestCleared && (
              <div className="lp-reach-row good"><Check size={12} /> Toughest you'd clear: <b>{toughestCleared.opposition}</b> · {toughestCleared.lpRequired} needed</div>
            )}
            {nextRung && (
              <div className="lp-reach-row"><span className="lp-reach-gap font-mono">{nextRung.lpRequired - lpTotal} short</span> of <b>{nextRung.opposition}</b> · {nextRung.lpRequired} needed — the next rung up</div>
            )}
            {allocBands.length > 0 && (
              <div className="lp-bands">
                {allocBands.map((b) => {
                  const ok = b.rows.filter((f) => lpTotal >= f.lpRequired).length;
                  return (
                    <div key={b.lbl} className="lp-band-row">
                      <span className="lp-band-lbl">{b.lbl} <span className="lp-band-note">{b.note}</span></span>
                      <span className={`lp-band-val font-mono ${ok === b.rows.length ? "good" : ""}`}>{ok}/{b.rows.length}</span>
                      <span className="lp-band-typ font-mono">~{median(b.rows.map((f) => f.lpRequired))} typical cut-off</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {nextSale && nextReq != null ? (
          <div className="lp-next">
            <div className="lp-next-head"><Clock size={12} /> Next on sale{nextSale.saleDate ? ` · ${fmtDate(nextSale.saleDate)}` : ""}</div>
            <div className="lp-bar"><div className="lp-fill" style={{ width: pct + "%" }} /></div>
            <div className={`lp-note ${lpTotal >= nextReq ? "good" : ""}`}>
              {lpTotal >= nextReq ? <><Check size={13} /> In Batch 1 range for {nextSale.opposition} ({nextReq} needed)</> : `${nextReq - lpTotal} short of Batch 1 for ${nextSale.opposition} (${nextReq} needed)`}
            </div>
          </div>
        ) : withReq.length === 0 ? (
          <div className="lp-note">Add a Batch 1 cut-off and sale date to any away game below, and this works out which ones you'd actually get into.</div>
        ) : null}
      </div>

      {season === "26-27" && (
        <div className="seat-card">
          <div className="seat-head">
            <span className="seat-lbl">Season ticket seat usage</span>
            <span className={`seat-count font-mono ${seatUsage >= seatTarget ? "good" : ""}`}>{seatUsage}<span className="seat-of">/{seatTarget}</span></span>
          </div>
          <div className="seat-bar"><div className={`seat-fill ${seatUsage >= seatTarget ? "good" : ""}`} style={{ width: Math.min(100, (seatUsage / seatTarget) * 100) + "%" }} /></div>
          <div className="seat-note">{seatUsage >= seatTarget
            ? "Renewal requirement met — your seat's been used at 13+ league games."
            : `${seatTarget - seatUsage} more league home games to go. The club can refuse renewal if your seat isn't used at 13, so passing it on counts too.`}</div>
        </div>
      )}

      {/* LOYALTY TICKET SALES */}
      <SectionTitle small>Loyalty ticket sales</SectionTitle>
      {loyaltySales.length === 0 ? (
        <div className="hint-card"><span className="hint-ic" aria-hidden><Ticket size={17} /></span><span>Add a Batch 1 points cut-off to any game sold on loyalty points and it shows here, with a tick if you'd have had the points by its sale date.</span></div>
      ) : (
        <div className="sale-list">
          {loyaltySales.map((f) => <SaleRow key={f.id} f={f} gno={gameNo[f.id]} pas={pointsAtSale(f)} lpTotal={lpTotal} />)}
        </div>
      )}

      {/* RECORD */}
      <div className="sec-row"><SectionTitle>Your record</SectionTitle><span className="sec-aside">games you were at</span></div>
      <div className="rec-card">
        <div className="rec-nums">
          <div className="rec-num win"><span className="font-disp">{rec.W}</span><span>Won</span></div>
          <div className="rec-num draw"><span className="font-disp">{rec.D}</span><span>Drawn</span></div>
          <div className="rec-num loss"><span className="font-disp">{rec.L}</span><span>Lost</span></div>
        </div>
        <div className="rec-bar" aria-label={`${rec.W}W ${rec.D}D ${rec.L}L`}>
          <div className="rec-seg win" style={{ flex: rec.W || 0.01 }} />
          <div className="rec-seg draw" style={{ flex: rec.D || 0.01 }} />
          <div className="rec-seg loss" style={{ flex: rec.L || 0.01 }} />
        </div>
      </div>

      <div className="stat-grid">
        <Metric big value={charmWent + "%"} label="Win rate when you're there" tone="blue" />
        <Metric big value={charmAll + "%"} label="Win rate (all games)" />
        <Metric value={attRate == null ? "—" : attRate + "%"} label="Attendance rate" />
        <Metric value={predAcc == null ? "—" : predAcc + "%"} label={`Prediction accuracy${preds.length ? ` (${preds.length})` : ""}`} tone="amber" />
        <Metric value={money(costPerWin)} label="Cost per win (inc. ST)" />
        <Metric value={money(costPerGoal)} label="Cost per goal seen" />
      </div>
      {preds.length > 0 && <div className="charm-line" style={{ marginTop: 10 }}>You've nailed the result {predHits}/{preds.length} times{predExact ? `, with ${predExact} spot-on scoreline${predExact > 1 ? "s" : ""}` : ""}.</div>}
      <div className={`charm-line callout ${charmWent > charmAll ? "good" : charmWent < charmAll ? "bad" : ""}`}>
        <span className="callout-ic" aria-hidden>{charmWent > charmAll ? <TrendingUp size={17} /> : charmWent < charmAll ? <TrendingDown size={17} /> : <Equal size={17} />}</span>
        <span>{charmWent > charmAll
          ? `You're a lucky charm — Chelsea win ${charmWent - charmAll} pts more often with you in the ground.`
          : charmWent < charmAll ? `Tough watch — they do slightly better without you (${charmAll - charmWent} pts).`
            : "Dead even whether you're there or not."}</span>
      </div>

      <div className="opp-cols">
        <div>
          <SectionTitle small>Can we play you every week?</SectionTitle>
          <OppList rows={happy} good />
        </div>
        <div>
          <SectionTitle small>Bogey teams</SectionTitle>
          <OppList rows={bogey} />
        </div>
      </div>
      {(happy.length > 0 || bogey.length > 0) && <div className="opp-key">Won – drawn – lost, teams you've seen twice or more</div>}

      {/* SEASON SETUP — tucked away, one-off entry per season */}
      <button className="setup-toggle" onClick={() => setShowSetup((s) => !s)}>
        <Settings size={13} /> Season setup
        <ChevronDown size={14} style={{ marginLeft: "auto", transform: showSetup ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {showSetup && (
        <>
        <div className="setup-row">
          <div className="setup-item"><span className="setup-lbl">Season ticket</span><MiniEdit value={stCost} prefix="£" onChange={setStCost} /></div>
          <div className="setup-item"><span className="setup-lbl">Starting points</span><MiniEdit value={lpStart} onChange={setLpStart} /></div>
        </div>
        <button className={`cup-toggle ${cupScheme ? "on" : ""}`} onClick={toggleCupScheme}>
          <span className="cup-toggle-box">{cupScheme ? <Check size={13} /> : null}</span>
          <span className="cup-toggle-txt"><b>In the Cup Scheme</b> — adds 10 bonus points, and reserves your seat for home cup ties. Worth confirming with the club before relying on it.</span>
        </button>
        </>
      )}
    </div>
  );
}
function hasCutoff(f) { return f.lpRequired != null && f.lpRequired !== "" && Number(f.lpRequired) > 0; }
/* Tap to open. The summary line wraps rather than truncating, and the full breakdown —
   allocation, cut-off, what you'd have had on the day — lives inside. */
function SaleRow({ f, gno, pas, lpTotal }) {
  const [open, setOpen] = useState(false);
  const req = f.lpRequired;
  const ok = req != null && pas >= req;
  const known = ["H", "A", "N"].includes(f.venue);
  const v = known ? f.venue : "?";
  return (
    <div className={`sale-row ${open ? "open" : ""}`}>
      <button className="sale-top" onClick={() => setOpen((o) => !o)}>
        <div className="sale-line1">
          {gno ? <span className="sale-gno font-mono">G{gno}</span> : null}
          <span className="sale-opp font-disp">{f.opposition || "—"}</span>
          <span className={`vchip v-${known ? f.venue : "q"}`}>{v}</span>
          {req != null
            ? <span className={`sale-badge ${ok ? "ok" : "no"}`}>{ok ? "✓ Batch 1" : `${req - pas} short`}</span>
            : <span className="sale-badge pending">log pts</span>}
          <ChevronDown size={15} className="sale-chev" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </div>
        <div className="sale-line2 font-mono">
          {f.saleDate ? `on sale ${fmtDate(f.saleDate)}` : "sale date TBC"}
          {f.allocation != null ? ` · ${f.allocation} tickets` : ""}
          {req != null ? ` · needs ${req} pts` : ""}
          {req != null && f.saleDate ? ` · you'd have had ${pas}` : ""}
        </div>
      </button>
      {open && (
        <div className="sale-detail">
          <div className="sale-d-row"><span>Match</span><b>Chelsea v {f.opposition || "—"}{known ? ` (${v})` : ""}</b></div>
          <div className="sale-d-row"><span>Competition</span><b>{f.competition}</b></div>
          <div className="sale-d-row"><span>Kick-off</span><b>{fmtDate(f.date, f.dateText)}{f.kickoff ? ` · ${f.kickoff}` : ""}{f.dateConfirmed ? "" : " (provisional)"}</b></div>
          <div className="sale-d-row"><span>Tickets on sale</span><b>{f.saleDate ? fmtDate(f.saleDate) : "TBC"}</b></div>
          <div className="sale-d-row"><span>Away allocation</span><b>{f.allocation != null ? `${f.allocation} tickets` : "not logged"}</b></div>
          <div className="sale-d-row"><span>Batch 1 cut-off</span><b>{req != null ? `${req} points` : "not logged"}</b></div>
          <div className="sale-d-row"><span>{f.saleDate ? "Your points that day" : "Your points today"}</span><b>{pas} pts</b></div>
          {req != null && (
            <div className={`sale-verdict ${ok ? "ok" : "no"}`}>
              {ok ? `In range — ${pas - req} points to spare.` : `${req - pas} points short at that sale date.`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OppList({ rows, good }) {
  if (!rows.length) return <div className="muted small" style={{ padding: "6px 2px" }}>Not enough games yet.</div>;
  return (
    <div className={`opp-list ${good ? "good" : "bad"}`}>
      {rows.map((o) => (
        <div key={o.opp} className="opp-row">
          <span className="opp-name">{o.opp}</span>
          <span className="opp-rec font-mono">{o.W}-{o.D}-{o.L}</span>
        </div>
      ))}
    </div>
  );
}
function MiniEdit({ value, onChange, prefix = "", dark = false }) {
  const [edit, setEdit] = useState(false);
  const [v, setV] = useState(value);
  if (!edit) return <button className={`mini-edit ${dark ? "dark" : ""}`} onClick={() => { setV(value); setEdit(true); }}>{value === "" || value == null ? <span className="mini-add"><Pencil size={11} /> set</span> : <span>{prefix}{value} <Pencil size={11} /></span>}</button>;
  return (
    <span className="flex items-center gap-1">
      <input className="mini-input font-mono" type="number" value={v} onChange={(e) => setV(e.target.value)} style={{ width: 64 }} autoFocus />
      <button className="icon-btn sm" onClick={() => { onChange(v === "" ? null : Number(v) || 0); setEdit(false); }}><Check size={14} /></button>
    </span>
  );
}

/* ============================== WRAPPED ============================== */
function ordNum(s) { const m = String(s || "").match(/\d+/); return m ? parseInt(m[0]) : null; }
const PRED_BLUES = [["cfcPos", "League finish", "4th"], ["topScorer", "Top scorer", "Palmer"], ["player", "Player of the season", "Palmer"], ["faCup", "FA Cup run", "Winners / Semis…"], ["carabao", "Carabao run", "Final / R4…"]];
const PRED_BIG = [["champions", "Champions", "Arsenal"], ["relegated1", "Relegated", "Team 1"], ["relegated2", "Relegated", "Team 2"], ["relegated3", "Relegated", "Team 3"], ["faWinner", "FA Cup winners", ""], ["carabaoWinner", "Carabao winners", ""], ["clWinner", "Champions League winners", ""]];
const PRED_ALL = [...PRED_BLUES.map((f) => f[0]), ...PRED_BIG.map((f) => f[0])];
const PRED_LABEL = Object.fromEntries([...PRED_BLUES, ...PRED_BIG].map((f) => [f[0], f[1]]));

function OptDial({ value, onChange }) {
  return (
    <div className="opt-dial">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <button key={n} type="button" className={`opt-dot ${value >= n ? "on" : ""}`} onClick={() => onChange(n)}>{n}</button>
      ))}
    </div>
  );
}

function Predictor({ season, list, settings, setSettings, inProgress, perf }) {
  const [showSum, setShowSum] = useState(false);
  const real = list.filter((f) => f.opposition);
  const total = real.length || 1;
  const played = real.filter((f) => f.result).length;
  const halfway = played >= total / 2;
  const P = (settings.predictions || {})[season] || {};
  const pre = P.pre || {}, mid = P.mid || {}, scored = P.scored || {};
  function update(patch) { setSettings((s) => { const preds = { ...(s.predictions || {}) }; preds[season] = { ...(preds[season] || {}), ...patch }; return { ...s, predictions: preds }; }); }
  const setPre = (patch) => update({ pre: { ...pre, ...patch } });
  const setMid = (patch) => update({ mid: { ...mid, ...patch } });
  const setScored = (patch) => update({ scored: { ...scored, ...patch } });

  if (!pre.locked) {
    const ready = pre.cfcPos || pre.champions;
    return (
      <div className="oracle">
        <div className="oracle-head"><Sparkles size={16} /> Pre‑season oracle</div>
        <div className="oracle-intro">Make your calls before a ball's kicked. Lock them in and we'll see how daft you were come May.</div>
        <div className="oracle-grp-lbl">The Blues</div>
        <div className="oracle-grid">
          {PRED_BLUES.map(([k, lbl]) => (
            <label key={k} className="pred-field"><span>{lbl}</span><input className="inp" value={pre[k] || ""} onChange={(e) => setPre({ [k]: e.target.value })} /></label>
          ))}
        </div>
        <div className="oracle-grp-lbl">The bigger picture</div>
        <div className="oracle-grid">
          {PRED_BIG.map(([k, lbl]) => (
            <label key={k} className="pred-field"><span>{lbl}</span><input className="inp" value={pre[k] || ""} onChange={(e) => setPre({ [k]: e.target.value })} /></label>
          ))}
        </div>
        <div className="oracle-grp-lbl">Your gut</div>
        <label className="pred-field"><span>Bold / wildcard call</span><textarea className="inp ta" rows={2} value={pre.bold || ""} onChange={(e) => setPre({ bold: e.target.value })} /></label>
        <div className="pred-field" style={{ marginTop: 10 }}><span>How optimistic are you? (1–10)</span><OptDial value={pre.optimism || 0} onChange={(v) => setPre({ optimism: v })} /></div>
        <button className="lock-btn" disabled={!ready} onClick={() => { let go = true; try { go = window.confirm("Lock these in for the season? You can still see them, but it's more fun if you don't change them."); } catch (e) {} if (go) setPre({ locked: true }); }}>Lock in my predictions</button>
      </div>
    );
  }

  const posPred = ordNum(pre.cfcPos), posAct = ordNum(perf.leaguePos);
  const scorable = [...PRED_BLUES, ...PRED_BIG].filter(([k]) => k !== "cfcPos" && pre[k]);
  const correct = (posPred && posAct && posPred === posAct ? 1 : 0) + scorable.filter(([k]) => scored[k]).length;
  const totalScorable = (posPred && posAct ? 1 : 0) + scorable.length;
  const rating = totalScorable ? Math.round((correct / totalScorable) * 100) : null;

  return (
    <div className="pred-wrap">
      {inProgress ? (
        <div className="pred-summary">
          <button className="pred-sum-head" onClick={() => setShowSum((s) => !s)}>
            <span><Sparkles size={14} /> Your pre‑season calls</span>
            <ChevronDown size={15} style={{ transform: showSum ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>
          {showSum && (
            <div className="pred-sum-body">
              {PRED_ALL.filter((k) => pre[k]).map((k) => (
                <div key={k} className="pred-sum-row"><span className="pred-sum-lbl">{PRED_LABEL[k]}</span><span className="pred-sum-val">{pre[k]}</span></div>
              ))}
              {pre.bold && <div className="pred-sum-bold">"{pre.bold}"</div>}
              {pre.optimism && <div className="pred-sum-row"><span className="pred-sum-lbl">Optimism</span><span className="pred-sum-val">{pre.optimism}/10</span></div>}
            </div>
          )}
        </div>
      ) : (
        <div className="pred-reck">
          <div className="reck-head font-disp">The reckoning</div>
          {posPred && posAct && (
            <div className={`reck-pos ${posPred === posAct ? "spot" : ""}`}>
              <div>You said <b>{pre.cfcPos}</b> · they finished <b>{perf.leaguePos}</b></div>
              <div className="reck-verdict">{posPred === posAct ? <>Spot on! <Target size={18} /></> : `${Math.abs(posPred - posAct)} place${Math.abs(posPred - posAct) > 1 ? "s" : ""} off`}</div>
            </div>
          )}
          <div className="reck-list">
            {scorable.map(([k, lbl]) => (
              <div key={k} className="reck-row">
                <div className="reck-info"><span className="reck-lbl">{lbl}</span><span className="reck-val">{pre[k]}</span></div>
                <div className="reck-toggle">
                  <button className={`rt ${scored[k] === true ? "hit" : ""}`} onClick={() => setScored({ [k]: scored[k] === true ? null : true })}>✓</button>
                  <button className={`rt ${scored[k] === false ? "miss" : ""}`} onClick={() => setScored({ [k]: scored[k] === false ? null : false })}>✗</button>
                </div>
              </div>
            ))}
          </div>
          {pre.bold && <div className="reck-bold">Bold call: "{pre.bold}"</div>}
          <div className="reck-arc"><span>Optimism: pre‑season <b>{pre.optimism || "–"}</b>{mid.optimism ? <> → midway <b>{mid.optimism}</b></> : null}</span></div>
          {rating != null && <div className="forecaster"><span>Forecaster rating</span><span className="forecaster-num font-disp">{rating}%</span></div>}
        </div>
      )}

      {inProgress && halfway && !mid.locked && (
        <div className="oracle mid">
          <div className="oracle-head"><Sparkles size={16} /> Mid‑season check‑in</div>
          <div className="oracle-intro">Halfway there. Still backing your calls, or hedging?</div>
          <div className="oracle-grid">
            <label className="pred-field"><span>Revised league finish</span><input className="inp" placeholder="4th" value={mid.pos || ""} onChange={(e) => setMid({ pos: e.target.value })} /></label>
          </div>
          <label className="pred-field"><span>How's it actually going?</span><textarea className="inp ta" rows={2} placeholder="Better/worse than I feared because…" value={mid.note || ""} onChange={(e) => setMid({ note: e.target.value })} /></label>
          <div className="pred-field" style={{ marginTop: 10 }}><span>Optimism now (1–10)</span><OptDial value={mid.optimism || 0} onChange={(v) => setMid({ optimism: v })} /></div>
          <button className="lock-btn" onClick={() => setMid({ locked: true })}>Save check‑in</button>
        </div>
      )}
    </div>
  );
}

function SeasonSoFar({ list, allFixtures, season }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString().slice(0, 10);
  const real = list.filter((f) => f.opposition);
  const total = real.length;
  const played = real.filter((f) => f.result);
  const seen = played.filter(scannedIn); // "Was there" only — a ticket held isn't a game seen
  const pintsOf = (f) => fxBeers(f).reduce((x, b) => x + (b.qty || 0), 0);
  const spendOf = (f) => fxBeers(f).reduce((x, b) => x + (b.price || 0) * (b.qty || 0), 0);
  const pints = list.reduce((a, f) => a + pintsOf(f), 0);
  const beerSpend = list.reduce((a, f) => a + spendOf(f), 0);
  const plannedAttend = list.filter(attended).length;

  const upcoming = real.filter((f) => f.date && f.date >= todayISO && !f.result).sort((a, b) => a.date < b.date ? -1 : 1);
  const next = upcoming[0];
  // Midday on the match date minus midnight today is n days and a half; take the half off
  // before rounding, or every countdown reads a day long.
  const daysTo = next ? Math.round((new Date(next.date + "T12:00:00") - today - 43200000) / 86400000) : null;

  const pct = total ? played.length / total : 0;
  const R = 46, C = 2 * Math.PI * R;

  const form = [...seen].sort((a, b) => (a.date || "") < (b.date || "") ? -1 : 1).slice(-5);
  let run = 0, runType = null;
  for (let i = form.length - 1; i >= 0; i--) {
    if (i === form.length - 1) { runType = form[i].result; run = 1; }
    else if (form[i].result === runType) run++; else break;
  }
  const runWord = runType === "W" ? "winning" : runType === "L" ? "losing" : "drawing";

  const attendedPlayed = seen.length;
  const factor = attendedPlayed ? plannedAttend / attendedPlayed : 0;
  const projPints = Math.round(pints * factor);
  const projBeer = Math.round(beerSpend * factor);
  const showProj = attendedPlayed >= 2 && plannedAttend > attendedPlayed;

  const awayGrounds = new Set(seen.filter((f) => f.venue === "A").map((f) => f.opposition)).size;
  const wins = seen.filter((f) => f.result === "W");
  const beatSpurs = wins.some((f) => /spurs|tottenham/i.test(f.opposition));
  const beatBig = wins.some((f) => /arsenal|man utd|manchester utd|man united|manchester united|liverpool|man city|manchester city/i.test(f.opposition));
  const ms = [
    { l: "First 10★ day", d: list.some((f) => f.rating >= 10) },
    { l: "25 pints", d: pints >= 25 },
    { l: "50 pints", d: pints >= 50 },
    { l: "75 pints", d: pints >= 75 },
    { l: "100 pints", d: pints >= 100 },
    { l: "5 away grounds", d: awayGrounds >= 5 },
    { l: "Beat Spurs", d: beatSpurs },
    { l: "Beat a big team", d: beatBig },
  ];

  const seasons = [...new Set(allFixtures.map((f) => f.season))].sort();
  const prevKey = seasons[seasons.indexOf(season) - 1];
  let pace = null;
  if (prevKey && attendedPlayed >= 3) {
    const prev = allFixtures.filter((f) => f.season === prevKey && attended(f) && f.result).sort((a, b) => (a.date || "") < (b.date || "") ? -1 : 1).slice(0, attendedPlayed);
    const prevPints = prev.reduce((a, f) => a + pintsOf(f), 0);
    pace = { prevKey, diff: pints - prevPints };
  }

  return (
    <div className="ssf">
      <div className="ssf-top">
        <div className="ssf-ring">
          <svg width="118" height="118" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r={R} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="8" />
            <circle cx="55" cy="55" r={R} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 55 55)" />
            <text x="55" y="52" textAnchor="middle" style={{ fontFamily: "Bebas Neue", fontSize: "30px", fill: "#fff" }}>{played.length}</text>
            <text x="55" y="70" textAnchor="middle" style={{ fontFamily: "JetBrains Mono", fontSize: "11px", fill: "rgba(255,255,255,.7)" }}>of {total}</text>
          </svg>
        </div>
        <div className="ssf-next">
          <div className="ssf-seen">You've been to <b>{seen.length}</b> so far</div>
          {next ? (
            <div className="ssf-count">
              <div className="ssf-days">{daysTo === 0 ? "Today!" : daysTo === 1 ? "Tomorrow" : `${daysTo} days`}</div>
              <div className="ssf-nextopp">to {next.opposition} <span className="ssf-venue">{next.venue === "H" ? "(H)" : next.venue === "A" ? "(A)" : ""}</span></div>
              {!next.dateConfirmed && <div className="ssf-prov">date still provisional</div>}
            </div>
          ) : <div className="ssf-count"><div className="ssf-nextopp">No upcoming dated games</div></div>}
        </div>
      </div>

      {form.length > 0 && (
        <div className="ssf-form">
          <span className="ssf-form-lbl">Your form</span>
          <div className="ssf-pills">{form.map((f, i) => <span key={i} className={`form-pill ${f.result === "W" ? "win" : f.result === "L" ? "loss" : "draw"}`}>{f.result}</span>)}</div>
          {run >= 2 && <span className="ssf-run">{run} {runWord} in person</span>}
        </div>
      )}

      {showProj && (
        <div className="ssf-proj">
          <div className="ssf-proj-lbl">On current pace, full season</div>
          <div className="ssf-proj-row">
            <span><b>~{projPints}</b> pints</span><span><b>£{projBeer}</b> on beer</span><span><b>{plannedAttend}</b> games seen</span>
          </div>
        </div>
      )}

      <div className="ssf-ms">
        {ms.map((m, i) => <div key={i} className={`ms ${m.d ? "done" : ""}`}>{m.d ? <Check size={13} /> : <Star size={13} />} {m.l}</div>)}
      </div>

      {pace && (
        <div className="ssf-pace">{pace.diff === 0 ? `Bang on last season's pace at this stage.` : `${Math.abs(pace.diff)} ${pace.diff > 0 ? "more" : "fewer"} pints than this time in ${pace.prevKey}.`}</div>
      )}
    </div>
  );
}

function WrappedView({ list, season, settings, setSettings, inProgress, allFixtures }) {
  // Only games you actually turned up to. A ticket you held but didn't scan doesn't count.
  const went = list.filter(scannedIn);
  const played = went.filter((f) => f.result && countsToRecord(f));
  const rec = { W: 0, D: 0, L: 0 }; played.forEach((f) => rec[f.result]++);
  const beers = list.flatMap((f) => fxBeers(f));
  const pints = beers.reduce((a, b) => a + (b.qty || 0), 0);
  const beerSpend = beers.reduce((a, b) => a + (b.price || 0) * (b.qty || 0), 0);
  const myCost = list.reduce((a, f) => a + (f.myCost || 0), 0);
  const stCost = (settings.stCost || {})[season] || 0;
  const ticketSpend = stCost + myCost;
  const combined = ticketSpend + beerSpend;
  const aways = went.filter((f) => f.venue === "A").length;
  const bigWin = played.filter((f) => f.result === "W").reduce((m, f) => {
    const p = parseScore(f.score); if (!p) return m; const diff = p[0] - p[1];
    return !m || diff > m.diff ? { f, diff } : m;
  }, null);
  const bigLoss = played.filter((f) => f.result === "L").reduce((m, f) => {
    const p = parseScore(f.score); if (!p) return m; const diff = p[1] - p[0];
    return !m || diff > m.diff ? { f, diff } : m;
  }, null);
  const rated = list.filter((f) => f.rating);
  const best = rated.reduce((m, f) => (!m || f.rating > m.rating ? f : m), null);
  const worst = rated.reduce((m, f) => (!m || f.rating < m.rating ? f : m), null);
  const comps = {}; went.forEach((f) => comps[f.competition] = (comps[f.competition] || 0) + 1);
  const wrPubs = list.flatMap((f) => ((f.journal && f.journal.pubs) || []).map((p) => ({ ...p, fx: f })));
  const wrBestPint = wrPubs.filter((p) => p.pint).sort((a, b) => b.pint - a.pint)[0];
  const wrBestPub = wrPubs.filter((p) => p.ambience).sort((a, b) => b.ambience - a.ambience)[0];
  const wrSpecials = wrPubs.filter((p) => p.special);
  const perf = (settings.seasonPerf || {})[season] || {};
  const setPerf = (patch) => setSettings((s) => ({ ...s, seasonPerf: { ...(s.seasonPerf || {}), [season]: { ...((s.seasonPerf || {})[season] || {}), ...patch } } }));

  const review = (settings.reviews || {})[season] || "";
  const setReview = (v) => setSettings((s) => ({ ...s, reviews: { ...(s.reviews || {}), [season]: v } }));
  const [showTone, setShowTone] = useState(false);
  const tone = settings.toneGuide != null ? settings.toneGuide : DEFAULT_TONE;
  const setTone = (v) => setSettings((s) => ({ ...s, toneGuide: v }));
  const [exportMsg, setExportMsg] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoBusy, setPhotoBusy] = useState(false);
  const photoInput = useRef(null);
  useEffect(() => { let alive = true; photosForSeason(season).then((p) => { if (alive) setPhotos(p); }); return () => { alive = false; }; }, [season]);
  async function addPhotos(files) {
    if (!idbOK) { alert("Photo saving isn't available in this browser."); return; }
    setPhotoBusy(true);
    for (const file of Array.from(files || [])) {
      if (!file.type || !file.type.startsWith("image/")) continue;
      try {
        const dataUrl = await compressImage(file);
        await photoPut({ id: `${season}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, season, dataUrl, ts: Date.now() });
      } catch (e) {}
    }
    setPhotos(await photosForSeason(season));
    setPhotoBusy(false);
  }
  async function removePhoto(id) { if (!confirm("Remove this photo?")) return; await photoDelete(id); setPhotos(await photosForSeason(season)); }

  return (
    <div className="wrapped">
      <div className="wr-hero">
        <div className="wr-eyebrow font-mono">SEASON {season}</div>
        <div className="font-disp wr-title">{inProgress ? "SEASON SO FAR" : "YOUR SEASON, WRAPPED"}</div>
        <div className="wr-line">{went.length} game{went.length === 1 ? "" : "s"} · {aways} away day{aways === 1 ? "" : "s"} · {rec.W}W {rec.D}D {rec.L}L</div>
      </div>

      <LeaguePoints list={list} season={season} variant="full" />

      <Predictor season={season} list={list} settings={settings} setSettings={setSettings} inProgress={inProgress} perf={perf} />

      {inProgress && <SeasonSoFar list={list} allFixtures={allFixtures} season={season} />}

      <div className="wr-grid">
        <WrCard k={went.length} l="Games you were at" />
        <WrCard k={aways} l="Away days" />
        <WrCard k={pints} l="Pints" tone="amber" />
        <WrCard k={money(beerSpend)} l="Beer spend" tone="amber" />
        <WrCard k={money(ticketSpend)} l="Total ticket spend" />
        <WrCard k={rec.W ? money(ticketSpend / rec.W) : "—"} l="Cost per win" />
      </div>
      <div className="wr-combined">
        <span className="wr-comb-lbl">Total damage — tickets + beer</span>
        <span className="font-disp wr-comb-k">{money(combined)}</span>
      </div>
      <div className="two-col">
        {bigWin && (
          <div className="wr-feature win">
            <div className="wr-feat-lbl">Biggest win seen live</div>
            <div className="font-disp wr-feat-big">{bigWin.f.opposition} {bigWin.f.score}</div>
            <div className="wr-feat-sub">{fmtDate(bigWin.f.date, bigWin.f.dateText)} · {bigWin.f.venue === "H" ? "The Bridge" : "Away"}</div>
          </div>
        )}
        {bigLoss && (
          <div className="wr-feature loss">
            <div className="wr-feat-lbl">Heaviest defeat endured</div>
            <div className="font-disp wr-feat-big">{bigLoss.f.opposition} {bigLoss.f.score}</div>
            <div className="wr-feat-sub">{fmtDate(bigLoss.f.date, bigLoss.f.dateText)} · {bigLoss.f.venue === "H" ? "The Bridge" : "Away"}</div>
          </div>
        )}
      </div>
      <div className="two-col">
        {best && <div className="wr-rate"><div className="wr-rate-lbl">Best day out ★{best.rating}</div><div className="font-disp">{best.opposition}</div></div>}
        {worst && best && worst.id !== best.id && <div className="wr-rate bad"><div className="wr-rate-lbl">Worst ★{worst.rating}</div><div className="font-disp">{worst.opposition}</div></div>}
      </div>
      <div className="wr-comps">
        {Object.entries(comps).map(([c, n]) => <span key={c} className="wr-comp"><b>{n}</b> {COMP_SHORT[c] || c}</span>)}
      </div>

      {/* SEASON PERFORMANCE */}
      {(wrBestPint || wrBestPub || wrSpecials.length > 0) && (
        <div className="wr-pubs">
          <div className="wr-pubs-head font-disp">Pub of the season</div>
          {wrBestPint && <div className="wr-pub-row"><span className="wr-pub-tag"><Beer size={13} /> Best pint</span><span className="wr-pub-name">{wrBestPint.name || "?"}</span><span className="wr-pub-score font-mono">{wrBestPint.pint.toFixed(1)}</span></div>}
          {wrBestPub && <div className="wr-pub-row"><span className="wr-pub-tag"><Sparkles size={13} /> Best ambience</span><span className="wr-pub-name">{wrBestPub.name || "?"}</span><span className="wr-pub-score font-mono">{wrBestPub.ambience.toFixed(1)}</span></div>}
          {wrSpecials.length > 0 && (
            <div className="wr-specials">
              <span className="wr-specials-lbl"><Star size={12} fill="currentColor" /> Special mentions</span>
              <div className="wr-specials-chips">{wrSpecials.map((p, i) => <span key={i} className="rate-special-chip">{p.name || "?"}</span>)}</div>
            </div>
          )}
        </div>
      )}

      <div className="wr-perf">
        <div className="wr-perf-head font-disp">How the Blues got on</div>
        {[["leaguePos", "League finish", "e.g. 4th"], ["faCup", "FA Cup", "e.g. Lost final to Man City"], ["leagueCup", "Carabao Cup", "e.g. Out R4 to Newcastle"], ["europe", "Europe", "e.g. Not in Europe"]].map(([k, lbl, ph]) => (
          <div key={k} className="wr-perf-row">
            <span className="wr-perf-lbl">{lbl}</span>
            <input className="wr-perf-inp" placeholder={ph} value={perf[k] || ""} onChange={(e) => setPerf({ [k]: e.target.value })} />
          </div>
        ))}
      </div>

      <div className="wr-tone">
        <button className="wr-tone-head" onClick={() => setShowTone((s) => !s)}>
          <span><Feather size={13} /> Tone of voice for write-ups</span>
          <ChevronDown size={15} style={{ transform: showTone ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>
        {showTone && (
          <div className="wr-tone-body">
            <div className="wr-tone-note">This gets baked into the export so Claude writes in your voice. Tweak it whenever — it applies to every season.</div>
            <textarea className="wr-tone-box" value={tone} onChange={(e) => setTone(e.target.value)} />
            {settings.toneGuide != null && settings.toneGuide !== DEFAULT_TONE && <button className="wr-tone-reset" onClick={() => setTone(DEFAULT_TONE)}>Reset to default</button>}
          </div>
        )}
      </div>

      <button className="wr-export" onClick={async () => {
        const md = seasonReviewMD(list, season, settings);
        const r = await shareOrSave(`every-other-saturday-${season}-review.md`, md, "text/markdown");
        if (r === "failed") { const c = await copyText(md); setExportMsg(c ? "Couldn't save a file — copied to the clipboard instead." : "Couldn't save or copy. Try the Copy button below."); }
        else if (r === "saved") setExportMsg("Saved to your downloads.");
      }}>
        <Download size={15} /> Export this season for a write-up
      </button>
      <button className="wr-export alt" onClick={async () => {
        const ok = await copyText(seasonReviewMD(list, season, settings));
        setExportMsg(ok ? "Copied — paste it straight into a new Claude chat." : "Copy didn't work on this browser.");
      }}>
        <Feather size={15} /> Copy it to the clipboard instead
      </button>
      {exportMsg ? <div className="wr-export-msg">{exportMsg}</div> : null}
      <div className="wr-export-note">Downloads a markdown file of {season} — every game you attended, with journals, pub notes and stats, and the writing brief and your tone-of-voice guide already baked in.
        <span className="wr-steps">To turn it into your write-ups: <b>1.</b> tap above to save or share the file. <b>2.</b> Open Claude (claude.ai or the app) in a fresh chat. <b>3.</b> Attach the file and say “write these up”. It'll hand back a short entry for <i>every game</i> plus a full season wrap. <b>4.</b> Paste the wrap into the box below and drop each game's entry into its journal — and add a few photo highlights.</span>
      </div>

      <div className="wr-review">
        <div className="wr-review-head font-disp">Your {season} season review</div>
        <div className="wr-review-note">Paste the review Claude writes for you here — it's saved with the season and you can edit it any time.</div>
        <textarea className="wr-review-box" placeholder="Paste your finished season review here…" value={review} onChange={(e) => setReview(e.target.value)} />

        <div className="wr-photos-head font-disp">Photo highlights</div>
        <div className="wr-photos-grid">
          {photos.map((p) => (
            <div key={p.id} className="wr-photo" style={{ backgroundImage: `url(${p.dataUrl})` }}>
              <button className="wr-photo-del" onClick={() => removePhoto(p.id)} aria-label="Remove photo"><X size={13} /></button>
            </div>
          ))}
          {idbOK && (
            <button className="wr-photo-add" onClick={() => photoInput.current && photoInput.current.click()} disabled={photoBusy}>
              {photoBusy ? <span className="wr-photo-adding">Adding…</span> : <><Plus size={20} /><span>Add</span></>}
            </button>
          )}
          <input ref={photoInput} type="file" accept="image/*" multiple hidden onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />
        </div>
        <div className="wr-review-note">{idbOK
          ? "Photos are shrunk to save space and stored on this device. They're included in your Export backup — so back up after adding photos to keep them safe and get them onto your other devices."
          : "Photo saving isn't supported in this browser, but your written review above still saves fine."}</div>
      </div>
    </div>
  );
}
function WrCard({ k, l, tone }) {
  return <div className={`wr-card ${tone === "amber" ? "amber" : ""}`}><div className="font-disp wr-k">{k}</div><div className="wr-l">{l}</div></div>;
}

/* ============================== FIXTURE DETAIL / EDITOR ============================== */
/* A textarea that grows as it fills, so a long note stays readable in one go instead of
   scrolling past inside a fixed box. Resizes on mount and on every change. */
function AutoTextarea({ value, onChange, className = "", minRows = 2, ...rest }) {
  const ref = useRef(null);
  const fit = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(el.scrollHeight, 34) + "px";
  };
  useEffect(fit, [value]);
  return (
    <textarea ref={ref} className={`inp ta auto-ta ${className}`} rows={minRows}
      value={value || ""} onChange={(e) => { onChange(e); requestAnimationFrame(fit); }} {...rest} />
  );
}

/* Saved regulars — pubs, mates or pints. Tapping a tag uses it; the Edit toggle turns the
   row into remove mode so a tag can be dropped without ever being one mis-tap away during
   normal use. `current` is whatever's typed in the related field: if it isn't already a
   regular, the save prompt appears. */
function TagRow({ names = [], current = "", isOn, onPick, onSave, onRemove, className = "", empty }) {
  const [editing, setEditing] = useState(false);
  const cur = String(current || "").trim();
  const known = names.some((n) => n.toLowerCase() === cur.toLowerCase());
  if (!names.length && !cur) return empty ? <div className="tag-empty">{empty}</div> : null;
  return (
    <>
      {names.length > 0 && (
        <div className={`pub-tags ${className}`}>
          {names.map((n) => (
            <button key={n} type="button"
              className={`pub-tag ${!editing && isOn && isOn(n) ? "on" : ""} ${editing ? "rm" : ""}`}
              onClick={() => (editing ? onRemove(n) : onPick(n))}
              aria-label={editing ? `Remove ${n} from regulars` : n}>
              {n}{editing ? <X size={11} /> : null}
            </button>
          ))}
          {onRemove && (
            <button type="button" className={`tag-edit ${editing ? "on" : ""}`} onClick={() => setEditing((e) => !e)}>
              {editing ? <><Check size={11} /> Done</> : <><Pencil size={11} /> Edit</>}
            </button>
          )}
        </div>
      )}
      {editing && names.length > 0 && <div className="tag-hint">Tap a tag to drop it from your regulars.</div>}
      {cur && !known && onSave ? (
        <button className="pub-save-reg" onClick={() => onSave(cur)}><Star size={12} /> Save "{cur}" as a regular</button>
      ) : null}
    </>
  );
}

function PubCard({ pub, index, onChange, onRemove, regulars = [], onAddRegular, onRemoveRegular, beerNames = [], onAddBeerName, onRemoveBeerName }) {
  const [bn, setBn] = useState("");
  const [bp, setBp] = useState("");
  const beers = pub.beers || [];
  function addBeer() {
    if (!bn && !bp) return;
    onChange({ beers: [...beers, { id: uid(), name: bn || "Pint", price: parseFloat(bp) || 0, qty: 1 }] });
    setBn(""); setBp("");
  }
  function beerQty(id, delta) {
    onChange({ beers: beers.map((b) => b.id === id ? { ...b, qty: Math.max(0, (b.qty || 0) + delta) } : b).filter((b) => b.qty > 0) });
  }
  const pints = beers.reduce((a, b) => a + (b.qty || 0), 0);
  const spend = beers.reduce((a, b) => a + (b.price || 0) * (b.qty || 0), 0);
  const name = (pub.name || "").trim();
  const suggestions = regulars.filter(Boolean);
  return (
    <div className="pub-card">
      <div className="pub-card-head">
        <span className="pub-num font-disp">{index + 1}</span>
        <input className="pub-name-inp" placeholder="Pub name — The Lillie Langtry…" value={pub.name || ""} onChange={(e) => onChange({ name: e.target.value })} aria-label="Pub name" />
        {spend > 0 && <span key={spend} className="pub-tab font-disp pop" aria-label={`${money2(spend)} spent here`}>{money(spend)}</span>}
        <button className="pub-remove" onClick={onRemove} aria-label="Remove pub"><X size={16} /></button>
      </div>
      <TagRow names={suggestions} current={name}
        isOn={(r) => r.toLowerCase() === name.toLowerCase()}
        onPick={(r) => onChange({ name: r })}
        onSave={onAddRegular} onRemove={onRemoveRegular} />
      <span className="lbl">Pints here</span>
      <TagRow names={beerNames} current={bn} className="beer-tags" onPick={setBn} onSave={onAddBeerName} onRemove={onRemoveBeerName} />
      <div className="beer-add">
        <input className="inp" placeholder="Beer (Guinness…)" value={bn} onChange={(e) => setBn(e.target.value)} />
        <input className="inp font-mono" type="number" placeholder="£/pint" value={bp} onChange={(e) => setBp(e.target.value)} style={{ maxWidth: 90 }} />
        <button className="add-beer" onClick={addBeer}><Plus size={16} /></button>
      </div>
      {beers.length > 0 && (
        <div className="beer-rows">
          {beers.map((b) => (
            <div key={b.id} className="beer-row">
              <span className="b-name">{b.name}</span>
              <span className="b-price font-mono">{money2(b.price)}</span>
              <div className="qty">
                <button onClick={() => beerQty(b.id, -1)} aria-label={`One fewer ${b.name}`}>–</button>
                <span key={b.qty} className="font-disp bounce">{b.qty}</span>
                <button className="plus" onClick={() => beerQty(b.id, 1)} aria-label={`One more ${b.name}`}>+</button>
              </div>
            </div>
          ))}
          <div className="beer-tot font-mono">{pints} pints · {money2(spend)}</div>
        </div>
      )}
      <div className="pub-rate">
        <span className="lbl">Ambience</span>
        <HalfStars value={pub.ambience || 0} onChange={(v) => onChange({ ambience: v })} />
      </div>
      <div className="pub-rate">
        <div className="pub-rate-lbl-row">
          <span className="lbl">Pint quality</span>
          <button className={`special-star ${pub.special ? "on" : ""}`} onClick={() => onChange({ special: !pub.special })} aria-label="Special mention">
            <Star size={13} fill={pub.special ? "var(--amber)" : "none"} stroke={pub.special ? "var(--amber)" : "var(--muted)"} /> Special mention
          </button>
        </div>
        <HalfStars value={pub.pint || 0} onChange={(v) => onChange({ pint: v })} />
      </div>
      <AutoTextarea className="pub-note" placeholder="Notes on this pub — it'll grow as you write…" value={pub.note || ""} onChange={(e) => onChange({ note: e.target.value })} />
    </div>
  );
}

function FixtureDetail({ fx, matchday, onClose, onSave, onDelete, regulars = [], onAddRegular, onRemoveRegular, mates = [], onAddMate, onRemoveMate, beerNames = [], onAddBeerName, onRemoveBeerName, groundBeerNames = [], onAddGroundBeerName, onRemoveGroundBeerName }) {
  const [d, setD] = useState(() => JSON.parse(JSON.stringify(fx)));
  const [gbn, setGbn] = useState("");
  const [gbp, setGbp] = useState("");
  const j = d.journal || {};
  const pubs = (d.journal && d.journal.pubs) || [];
  const groundBeers = d.groundBeers || [];
  function setJ(patch) { setD((s) => ({ ...s, journal: { ...(s.journal || {}), ...patch } })); }
  function set(patch) { setD((s) => ({ ...s, ...patch })); }
  // score is composed from a base scoreline + how it was decided (90'/AET/pens)
  const initDec = parseDecider(fx.score);
  const initBase = (() => { const p = parseScore(fx.score); return p ? `${p[0]}-${p[1]}` : ""; })();
  const [baseScore, setBaseScore] = useState(initBase);
  const [decider, setDecider] = useState(initDec.decider);
  const [pens, setPens] = useState(initDec.pens);
  function recompose(base, dec, pen) {
    const score = composeScore(base, dec, pen);
    const derived = composeResult(base, dec, pen);
    setD((s) => ({ ...s, score, result: derived != null ? derived : s.result }));
  }
  function onBase(v) { setBaseScore(v); recompose(v, decider, pens); }
  function changeDecider(v) { const nv = decider === v ? "normal" : v; setDecider(nv); recompose(baseScore, nv, pens); }
  function changePens(v) { setPens(v); recompose(baseScore, decider, v); }
  function autoLP() { set({ lps: lpDefault(d.venue, d.competition, d.opposition) }); }
  function addPub() { setD((s) => { const jj = s.journal || {}; return { ...s, journal: { ...jj, pubs: [...(jj.pubs || []), { id: uid(), name: "", ambience: null, note: "", beers: [] }] } }; }); }
  function updatePub(id, patch) { setD((s) => { const jj = s.journal || {}; return { ...s, journal: { ...jj, pubs: (jj.pubs || []).map((p) => p.id === id ? { ...p, ...patch } : p) } }; }); }
  function removePub(id) { setD((s) => { const jj = s.journal || {}; return { ...s, journal: { ...jj, pubs: (jj.pubs || []).filter((p) => p.id !== id) } }; }); }
  function addGroundBeer() { if (!gbn && !gbp) return; setD((s) => ({ ...s, groundBeers: [...(s.groundBeers || []), { id: uid(), name: gbn || "Pint", price: parseFloat(gbp) || 0, qty: 1 }] })); setGbn(""); setGbp(""); }
  function groundQty(id, delta) { setD((s) => ({ ...s, groundBeers: (s.groundBeers || []).map((b) => b.id === id ? { ...b, qty: Math.max(0, (b.qty || 0) + delta) } : b).filter((b) => b.qty > 0) })); }

  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className={`sheet ${matchday ? "md" : ""}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-label={matchday ? "Matchday" : "Fixture"}>
        <div className="sheet-head">
          <button className="icon-btn" onClick={onClose} aria-label="Back"><ArrowLeft size={18} /></button>
          <span className="sheet-titles">
            <span className="font-disp sheet-title">{matchday ? "Matchday" : "Fixture"}</span>
            <span className="sheet-sub">{fmtDate(d.date, d.dateText)} · {d.competition}</span>
          </span>
          <span className="sheet-head-sp" />
        </div>

        <div className="sheet-body">
          {/* HERO: a scoreboard — opponent + score, then the result chips */}
          <div className="ed-hero">
            <span className="hero-glow low" aria-hidden />
            <div className="sb-teams">
              <span className="sb-team font-disp">CHELSEA</span>
              <input className="ed-score font-disp flip" placeholder="0-0" value={baseScore} onChange={(e) => onBase(e.target.value)} aria-label="Score, Chelsea first" inputMode="numeric" />
              <input className="ed-opp font-disp" placeholder="Opponent" value={d.opposition} onChange={(e) => set({ opposition: e.target.value })} aria-label="Opponent" />
            </div>
            <div className="ed-score-row">
              <div className="seg res">
                {["W", "D", "L"].map((r) => <button key={r} className={`seg-b ${d.result === r ? "on " + (r === "W" ? "win" : r === "L" ? "loss" : "draw") : ""}`} onClick={() => set({ result: d.result === r ? null : r })}>{r}</button>)}
              </div>
              <label className="vsel-wrap">
                <select className="vsel" value={d.venue} onChange={(e) => set({ venue: e.target.value })} aria-label="Home or away">
                  <option value="H">H</option><option value="A">A</option><option value="N">N</option><option value="">?</option>
                </select>
              </label>
              <span className={`att t-${ATT[d.attending]?.tone || "muted"} chip-like`}><span className="att-dot" />{attLabel(d.attending, !d.result)}</span>
            </div>
            <div className="ed-hint">Chelsea's score first (e.g. 3‑0 = a Chelsea win, home or away)</div>
            {d.competition !== "Premier League" && d.competition !== "Friendly" && (
              <div className="ed-decider">
                <span className="ed-decider-lbl">Decided in</span>
                <div className="seg">
                  {[["normal", "90 mins"], ["aet", "Extra time"], ["pens", "Penalties"]].map(([v, l]) => (
                    <button key={v} className={`seg-b ${decider === v ? "on blue" : ""}`} onClick={() => changeDecider(v)}>{l}</button>
                  ))}
                </div>
                {decider === "pens" && (
                  <div className="ed-pens">
                    <input className="ed-pens-inp font-mono" placeholder="4-2" value={pens} onChange={(e) => changePens(e.target.value)} />
                    <span className="ed-pens-hint">shootout, Chelsea first — sets the win/loss</span>
                  </div>
                )}
              </div>
            )}
            <div className="ed-pred">
              <span className="ed-pred-lbl">Your pre-match call</span>
              <input className="ed-pred-inp font-mono" placeholder="2-1" value={d.prediction || ""} onChange={(e) => set({ prediction: e.target.value })} />
              {d.prediction && d.result && parseScore(d.prediction) && (
                <span className={`ed-pred-tag ${autoResult(d.prediction) === d.result ? "hit" : "miss"}`}>{autoResult(d.prediction) === d.result ? "called the result" : "missed"}</span>
              )}
            </div>
          </div>

          {/* CORE GRID */}
          {!matchday && (
            <div className="ed-grid">
              <Field label="Date"><input type="date" className="inp font-mono" value={d.date || ""} onChange={(e) => set({ date: e.target.value, dateText: "" })} /></Field>
              <Field label="Competition">
                <select className="inp" value={d.competition} onChange={(e) => set({ competition: e.target.value })}>{COMPS.map((c) => <option key={c}>{c}</option>)}</select>
              </Field>
              <div className="span2">
                <span className="lbl">Kick-off</span>
                <KickoffField value={d.kickoff} onChange={(v) => set({ kickoff: v })} />
              </div>
              <div className="span2">
                <span className="lbl">On TV</span>
                <div className="seg full wrap">
                  {["Sky Sports", "TNT", "Amazon", "BBC", "ITV", "Not televised"].map((opt) => (
                    <button key={opt} className={`seg-b ${d.broadcaster === opt ? "on blue" : ""}`} onClick={() => set({ broadcaster: d.broadcaster === opt ? "" : opt })}>{opt}</button>
                  ))}
                </div>
              </div>
              <div className="span2">
                <span className="lbl">Date status</span>
                <div className="seg full">
                  <button className={`seg-b ${d.dateConfirmed ? "on win" : ""}`} onClick={() => set({ dateConfirmed: true })}><Check size={13} /> Confirmed</button>
                  <button className={`seg-b ${!d.dateConfirmed ? "on draw" : ""}`} onClick={() => set({ dateConfirmed: false })}><Clock size={13} /> Provisional</button>
                </div>
              </div>
              <div className="span2">
                <span className="lbl">Attending</span>
                <div className="seg full wrap">
                  {Object.entries(ATT).map(([k, v]) => <button key={k} className={`seg-b ${d.attending === k ? "on blue" : ""}`} onClick={() => set({ attending: k })}>{attLabel(k, !d.result)}</button>)}
                </div>
              </div>
              {(d.attending === "sourced") && <div className="span2"><Field label="Sourced for"><input className="inp" placeholder="Who's using the ticket" value={d.attendee} onChange={(e) => set({ attendee: e.target.value })} /></Field></div>}
              <Field label={<span>Points earned <button className="auto-btn" onClick={autoLP}>auto</button></span>}>
                <input type="number" className="inp font-mono" value={d.lps ?? ""} onChange={(e) => set({ lps: e.target.value === "" ? null : Number(e.target.value) })} />
              </Field>
              {d.venue !== "H" && <Field label="Points needed (Batch 1)"><input type="number" className="inp font-mono" value={d.lpRequired ?? ""} onChange={(e) => set({ lpRequired: e.target.value === "" ? null : Number(e.target.value) })} /></Field>}
              {d.venue !== "H" && <Field label="Away allocation"><input type="number" className="inp font-mono" value={d.allocation ?? ""} onChange={(e) => set({ allocation: e.target.value === "" ? null : Number(e.target.value) })} /></Field>}
              {d.venue !== "H" && <Field label="Tickets on sale (date)"><input type="date" className="inp font-mono" value={d.saleDate || ""} onChange={(e) => set({ saleDate: e.target.value })} /></Field>}
              <Field label="Cost (£)"><input type="number" className="inp font-mono" value={d.myCost ?? ""} onChange={(e) => set({ myCost: e.target.value === "" ? null : Number(e.target.value) })} /></Field>
              <div className="span2 ed-note">Filled in from the club's 26/27 policy: <b>1</b> for Arsenal, Liverpool, Man City, Man Utd and Spurs (home or away), <b>3</b> for other league games, <b>5</b> for cup ties, <b>0</b> for the League Cup final and FA Cup semi/final. Home points land when you mark this <b>Was there</b>; away points count from buying the ticket, so they still stand if you pass it on.</div>
            </div>
          )}

          {d.date && (
            <button className="cal-btn" onClick={() => shareOrSave(`chelsea-${(d.opposition || "fixture").toLowerCase().replace(/\s+/g, "-")}.ics`, makeICS([d]), "text/calendar")}>
              <CalendarPlus size={15} /> Add to calendar{!d.dateConfirmed ? " (provisional date)" : ""}
            </button>
          )}

          {/* PUBS & PINTS (high up — first thing logged) */}
          <div className="ed-section">
            <div className="ed-sec-head"><Beer size={15} /> Pubs &amp; pints</div>
            <div className="ed-grid" style={{ marginBottom: 14 }}>
              <div className="span2">
                <span className="lbl">Who with</span>
                <div className="seg full">
                  <button className={`seg-b ${j.solo === true ? "on blue" : ""}`} onClick={() => setJ({ solo: true })}>Solo</button>
                  <button className={`seg-b ${j.solo === false ? "on blue" : ""}`} onClick={() => setJ({ solo: false })}>With others</button>
                </div>
              </div>
              {j.solo === false && (
                <div className="span2">
                  <span className="lbl">Who with you?</span>
                  {(() => {
                    const cur = (j.withWho || "").split(",").map((x) => x.trim()).filter(Boolean);
                    const newOne = cur.find((x) => !mates.some((m) => m.toLowerCase() === x.toLowerCase()));
                    return (
                      <>
                        <TagRow names={mates} current={newOne || ""}
                          isOn={(m) => cur.some((x) => x.toLowerCase() === m.toLowerCase())}
                          onPick={(m) => {
                            const on = cur.some((x) => x.toLowerCase() === m.toLowerCase());
                            const next = on ? cur.filter((x) => x.toLowerCase() !== m.toLowerCase()) : [...cur, m];
                            setJ({ withWho: next.join(", ") });
                          }}
                          onSave={onAddMate} onRemove={onRemoveMate} />
                        <input className="inp" value={j.withWho || ""} onChange={(e) => setJ({ withWho: e.target.value })} />
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
            {pubs.length === 0 && <div className="muted small" style={{ marginBottom: 10 }}>Add the first pub of the day — pints go in first.</div>}
            {pubs.map((p, i) => <PubCard key={p.id} pub={p} index={i} regulars={regulars} onAddRegular={onAddRegular} onRemoveRegular={onRemoveRegular} beerNames={beerNames} onAddBeerName={onAddBeerName} onRemoveBeerName={onRemoveBeerName} onChange={(patch) => updatePub(p.id, patch)} onRemove={() => removePub(p.id)} />)}
            <button className="add-pub" onClick={addPub}><Plus size={16} /> Add pub</button>

            {/* The pre-match ponder sits with the pubs, because that's where you are when
                you're writing it. It used to live further down and got missed. */}
            <div className="ed-subhead"><NotebookPen size={13} /> Before kick-off</div>
            <div className="ed-grid" style={{ marginBottom: 16 }}>
              <div className="span2"><Field label="Pre-match mood"><input className="inp" placeholder="Buzzing / dread / hungover…" value={j.mood || ""} onChange={(e) => setJ({ mood: e.target.value })} /></Field></div>
              <div className="span2"><Field label="The entry"><AutoTextarea minRows={6} placeholder="Sat with a pint, jotting…" value={j.body || ""} onChange={(e) => setJ({ body: e.target.value })} /></Field></div>
              <div className="span2"><Field label={<span>Life beyond the football <span className="fld-hint">optional — a line for the memory bank</span></span>}><AutoTextarea placeholder="Mum &amp; dad on Frey duty, Holly out for Becky's birthday…" value={j.lifeNote || ""} onChange={(e) => setJ({ lifeNote: e.target.value })} /></Field></div>
            </div>

            <div className="ground-box">
              <div className="ground-head"><Building2 size={15} /> Inside the ground</div>
              <TagRow names={groundBeerNames} current={gbn} className="beer-tags"
                onPick={setGbn} onSave={onAddGroundBeerName} onRemove={onRemoveGroundBeerName}
                empty="Save whatever's actually on at the ground and it'll be waiting here next time." />
              <div className="beer-add">
                <input className="inp" placeholder="Beer (Camden…)" value={gbn} onChange={(e) => setGbn(e.target.value)} />
                <input className="inp font-mono" type="number" placeholder="£/pint" value={gbp} onChange={(e) => setGbp(e.target.value)} style={{ maxWidth: 90 }} />
                <button className="add-beer" onClick={addGroundBeer}><Plus size={16} /></button>
              </div>
              {groundBeers.length > 0 && (
                <div className="beer-rows">
                  {groundBeers.map((b) => (
                    <div key={b.id} className="beer-row">
                      <span className="b-name">{b.name}</span>
                      <span className="b-price font-mono">{money2(b.price)}</span>
                      <div className="qty">
                        <button onClick={() => groundQty(b.id, -1)} aria-label={`One fewer ${b.name}`}>–</button>
                        <span key={b.qty} className="font-disp bounce">{b.qty}</span>
                        <button className="plus" onClick={() => groundQty(b.id, 1)} aria-label={`One more ${b.name}`}>+</button>
                      </div>
                    </div>
                  ))}
                  <div className="beer-tot font-mono">{groundBeers.reduce((a, b) => a + b.qty, 0)} pints · {money2(groundBeers.reduce((a, b) => a + b.price * b.qty, 0))}</div>
                </div>
              )}
            </div>

            {/* ...and the post-match half sits under the ground, where the day ends up. */}
            <div className="ed-subhead"><NotebookPen size={13} /> After the whistle</div>
            <div className="ed-grid">
              <div className="span2"><Field label={<span>What actually happened <span className="fld-hint">the goals, cards, turning point</span></span>}><AutoTextarea placeholder="Sánchez off after 5, attackers all hooked, gifted them the points…" value={j.matchFacts || ""} onChange={(e) => setJ({ matchFacts: e.target.value })} /></Field></div>
              <div className="span2"><Field label="After the final whistle"><AutoTextarea placeholder="The comedown / the glory…" value={j.postNote || ""} onChange={(e) => setJ({ postNote: e.target.value })} /></Field></div>
              <div className="span2">
                <span className="lbl">Rate the day out</span>
                <HalfStars value={d.rating || 0} onChange={(v) => set({ rating: v })} />
              </div>
            </div>
          </div>

          <button className="del-btn" onClick={onDelete}><Trash2 size={14} /> Delete this fixture</button>
        </div>
        <div className="sheet-foot">
          <button className="save-btn" onClick={() => onSave(d)}>{matchday ? "Save matchday" : "Save fixture"}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== DATA SHEET ============================== */
function DataSheet({ fixtures, settings, setSettings, onClose, onImport, onReseed, onReset }) {
  const [title, setTitle] = useState(settings.title || "EVERY OTHER SATURDAY");
  const fileRef = useRef();
  async function doExport() {
    let photos = [];
    try { photos = await photosAll(); } catch (e) {}
    await shareOrSave("every-other-saturday-backup.json", JSON.stringify({ fixtures, settings, photos }, null, 2), "application/json");
  }
  function doImport(e) {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = async () => { try { const data = JSON.parse(r.result); if (data.fixtures) { if (Array.isArray(data.photos)) { try { await photosBulkPut(data.photos); } catch (err) {} } onImport(data); onClose(); } else alert("That file didn't look like an Every Other Saturday backup."); } catch (err) { alert("That file didn't look like an Every Other Saturday backup."); } };
    r.readAsText(file);
  }
  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet narrow" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
          <span className="font-disp sheet-title">Data & settings</span><span />
        </div>
        <div className="sheet-body">
          <Field label="App title"><input className="inp" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => setSettings((s) => ({ ...s, title }))} /></Field>
          <div className="data-cap">The name shown at the top of the app. Change it to whatever you fancy.</div>

          <div className="data-note">{hasWinStore
            ? "Everything saves automatically as you go and syncs across devices you're signed into. Still worth keeping your own Export backup — it's the one copy nothing can wipe."
            : "Everything saves automatically to this device. It won't sync to other devices on its own, so keep an Export backup and Import it wherever else you need it."}</div>

          {syncConfigured && <RoostSync fixtures={fixtures} />}

          <button className="data-btn" onClick={doExport}><Download size={16} /> Export backup (JSON)</button>
          <div className="data-cap">Saves your whole log — fixtures, results, journals, beer notes, season reviews, photo highlights, every season — to one file on your device. Do this every month or so and pop the file in your email or files. This is your safety net if a phone's lost.</div>

          <button className="data-btn" onClick={() => fileRef.current.click()}><Upload size={16} /> Import backup</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={doImport} />
          <div className="data-cap">Loads an exported file back in. Use it to move everything to a new phone, or to restore after a wipe. Heads up: it replaces what's currently in the app.</div>

          <div className="data-tip">
            <div className="data-tip-h"><RotateCcw size={13} /> Syncing across your devices</div>
            Save your Export into your OneDrive folder and it'll turn up on your other devices on its own. On another device, tap <b>Import</b> to catch up. One golden rule: only edit on one device at a time — <b>Export</b> when you finish, <b>Import</b> before you start elsewhere — so nothing gets overwritten. Your phone's the main one; treat the laptop/iPad as a copy you refresh.
          </div>

          {(() => {
            const conf = fixtures.filter((f) => f.dateConfirmed && f.date);
            return conf.length
              ? <>
                  <button className="data-btn" onClick={() => shareOrSave("every-other-saturday-fixtures.ics", makeICS(conf), "text/calendar")}><CalendarPlus size={16} /> Export confirmed fixtures (.ics)</button>
                  <div className="data-cap">Drops your confirmed-date fixtures into Apple/Google Calendar or TimeTree. Only games with a locked-in date go in — provisional (TBC) ones are left out until they're confirmed.</div>
                </>
              : <div className="data-cap">Once you've got fixtures with confirmed dates, a button appears here to send them to your calendar.</div>;
          })()}

          <hr className="hr" />
          <div className="data-cap">The two below make big changes — read before tapping.</div>

          <button className="data-btn warn" onClick={() => { if (confirm("Re-import the original 5 seasons from the spreadsheet? This replaces everything, including journal entries you've added.")) { onReseed(); onClose(); } }}><RotateCcw size={16} /> Re-import original history</button>
          <div className="data-cap">Resets the log back to the original five seasons it shipped with. Wipes anything you've added since — journals, results, new seasons. You'll rarely need this; Import a backup instead if you're trying to recover something.</div>

          <button className="data-btn danger" onClick={() => { if (confirm("Wipe everything and start from an empty log?")) { onReset(); onClose(); } }}><Trash2 size={16} /> Clear all data</button>
          <div className="data-cap">Empties the log completely for a clean start. Can't be undone — so Export a backup first if there's any chance you'll want this lot back.</div>

          <div className="ver-note">Every Other Saturday · v{APP_VERSION}<br /><span className="ver-sub">If a device shows an older version than another after an update, close and reopen it once or twice.</span></div>
        </div>
      </div>
    </div>
  );
}

/* Sign-in for the Roost sync. One-off per phone: email + password, then the 6-digit code
   from the authenticator (the same login as The Nest and The Roost). */
function RoostSync({ fixtures }) {
  const [user, setUser] = useState(undefined);
  const [step, setStep] = useState("idle"); // idle | form | code
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [st, setSt] = useState(getSyncStatus());
  useEffect(() => onSyncStatus(setSt), []);
  async function refresh() { const u = await currentUser(); setUser(u); if (u && u.needsCode) setStep("code"); return u; }
  useEffect(() => { refresh(); }, []);
  async function doSignIn(e) {
    e.preventDefault(); setBusy(true); setErr("");
    try { const r = await signIn(email, pw); setPw(""); if (r.needsCode) setStep("code"); else { setStep("idle"); await refresh(); syncNow(fixtures); } }
    catch (x) { setErr(x.message); }
    setBusy(false);
  }
  async function doCode(e) {
    e.preventDefault(); setBusy(true); setErr("");
    try { await verifyCode(code); setCode(""); setStep("idle"); await refresh(); syncNow(fixtures); }
    catch (x) { setErr(x.message); setCode(""); }
    setBusy(false);
  }
  const signedIn = user && !user.needsCode;
  const when = st.lastOk ? new Date(st.lastOk).toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" }) : null;
  return (
    <div className="sync-card">
      <div className="sync-head">
        <span className="sync-title font-disp">The Roost</span>
        <span className={`sync-state ${signedIn ? (st.error ? "warn" : "ok") : ""}`}>{user === undefined ? "…" : signedIn ? (st.error ? "Not synced" : "Synced") : "Off"}</span>
      </div>
      <div className="sync-line">Sends your upcoming fixtures and whether you're going, so The Roost's calendar can show the games you're <b>Going</b> to — that's all your partner sees. Results, journals, pints and everything else stay on this phone, and EOS works the same whether this is on or off.</div>
      {signedIn ? (
        <>
          <div className="sync-meta">Signed in as {user.email}{when ? ` · last synced ${when}` : ""}{st.count != null && when ? ` · ${st.count} upcoming` : ""}</div>
          {st.error && <div className="sync-err">Last try didn't go through ({st.error}). It'll try again by itself.</div>}
          <div className="sync-actions">
            <button className="data-btn slim" onClick={() => syncNow(fixtures)}><RotateCcw size={15} /> Sync now</button>
            <button className="data-btn slim ghost" onClick={async () => { await signOut(); setUser(null); }}>Sign out</button>
          </div>
        </>
      ) : step === "code" ? (
        <form className="sync-form" onSubmit={doCode}>
          <label className="lbl" htmlFor="eos-code">6-digit code</label>
          <input id="eos-code" className="inp" inputMode="numeric" autoComplete="one-time-code" maxLength={7} value={code} onChange={(e) => setCode(e.target.value)} placeholder="From the Passwords app" />
          {err && <div className="sync-err" role="alert">{err}</div>}
          <button className="data-btn primary" disabled={busy || code.replace(/\s/g, "").length < 6}>{busy ? "Checking…" : "Turn on sync"}</button>
          <button type="button" className="data-btn slim ghost" onClick={async () => { await signOut(); setStep("idle"); setUser(null); }}>Cancel</button>
        </form>
      ) : step === "form" ? (
        <form className="sync-form" onSubmit={doSignIn}>
          <label className="lbl" htmlFor="eos-email">Email</label>
          <input id="eos-email" className="inp" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="lbl" htmlFor="eos-pw">Password</label>
          <input id="eos-pw" className="inp" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <div className="sync-meta">Same login as The Nest and The Roost.</div>
          {err && <div className="sync-err" role="alert">{err}</div>}
          <button className="data-btn primary" disabled={busy || !email || !pw}>{busy ? "Signing in…" : "Continue"}</button>
        </form>
      ) : (
        <button className="data-btn primary" onClick={() => setStep("form")}>Sign in to share fixtures</button>
      )}
    </div>
  );
}

/* ============================== SHARED BITS ============================== */
function SectionTitle({ children, small }) { return <div className={`sec-title ${small ? "sm" : ""}`}>{children}</div>; }
function Empty({ title, line }) { return <div className="empty"><div className="font-disp empty-t">{title}</div><div className="empty-l">{line}</div></div>; }
function Metric({ value, label, big, small, tone }) {
  return (
    <div className={`metric ${tone || ""}`}>
      <div className={`font-${small ? "body" : "disp"} m-val ${big ? "big" : ""} ${small ? "small" : ""}`}>{value}</div>
      <div className="m-lbl">{label}</div>
    </div>
  );
}

/* ============================== STYLES ============================== */
/* The Floodlights stylesheet lives in floodlights.css (bundled into app.css). This stays
   as a no-op so the components that render <Style /> don't need touching. */
function Style() { return null; }
