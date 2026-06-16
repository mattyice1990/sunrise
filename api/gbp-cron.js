/**
 * Daily prompt + reminder cron.
 * Scheduled by Vercel (see vercel.json `crons`) to run every 3 hours.
 * - First fire of the day (8 AM Tucson) -> sends the "send today's photos" prompt.
 * - Later fires (11, 2, 5, 8) -> sends a reminder, but ONLY if no photos have
 *   come in yet today. Once a submission lands, it goes quiet for the day.
 * - Outside 8 AM–9 PM Tucson, it does nothing.
 *
 * Stateless: "did the crew respond?" is derived from data/gbp/posts.json,
 * so there's no extra state file to commit.
 */
import { GBP } from '../config/gbp.js';
import { readPosts } from '../lib/gbp/store.js';
import { sendWhatsApp } from '../lib/gbp/twilio.js';

export const config = { maxDuration: 30 };

function phoenix(date) {
  // Shift a Date into Tucson wall-clock (no DST) using the configured offset.
  return new Date(date.getTime() + GBP.promptTimezoneOffset * 3600 * 1000);
}
function phxDateStr(date) {
  return phoenix(date).toISOString().slice(0, 10); // YYYY-MM-DD in Tucson
}

export default async function handler(req, res) {
  // Allow Vercel Cron (sets x-vercel-cron) or a manual call with ?secret=.
  const isVercelCron = !!req.headers['x-vercel-cron'];
  const secretOk = req.query?.secret && req.query.secret === process.env.GBP_OAUTH_STATE_SECRET;
  if (!isVercelCron && !secretOk) return res.status(403).json({ error: 'Forbidden' });

  const now = new Date();
  const hour = phoenix(now).getUTCHours();
  const today = phxDateStr(now);

  // Outside the daily window -> nothing to do.
  if (hour < GBP.promptStartHour || hour > GBP.promptEndHour) {
    return res.status(200).json({ action: 'skip', reason: 'outside window', hour });
  }

  // Already got photos today? Stay quiet.
  let posts = [];
  try {
    posts = await readPosts();
  } catch (e) {
    return res.status(500).json({ error: `readPosts failed: ${e.message}` });
  }
  const submittedToday = posts.some((p) => p.createdAt && phxDateStr(new Date(p.createdAt)) === today);
  if (submittedToday) {
    return res.status(200).json({ action: 'skip', reason: 'already submitted today' });
  }

  // 8 AM = first prompt; later fires = reminder.
  const isFirst = hour === GBP.promptStartHour;
  const body = isFirst ? GBP.dailyPromptText : GBP.reminderText;

  try {
    const sid = await sendWhatsApp(GBP.promptRecipient, body);
    return res.status(200).json({ action: isFirst ? 'prompt' : 'reminder', hour, messageSid: sid });
  } catch (e) {
    return res.status(502).json({ error: `send failed: ${e.message}` });
  }
}
