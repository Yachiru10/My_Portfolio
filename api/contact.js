// POST /api/contact
// 1. Checks the form data
// 2. Blocks spam (hidden field + max 3 messages per email every 10 minutes)
// 3. Saves the message in Supabase
// 4. Emails you a copy (only if Gmail is set up in the environment variables)

import nodemailer from 'nodemailer';
import { getSupabase } from './_lib/supabase.js';
import { validateContact } from './_lib/validate.js';

const LIMIT = 3; // messages
const WINDOW_MINUTES = 10;

async function emailMe(message) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return; // email is optional

  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  await transporter.sendMail({
    from: `"Portfolio" <${user}>`,
    to: user,
    replyTo: message.email,
    subject: `New portfolio message from ${message.name}`,
    text: [
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      `Company: ${message.company || '(none)'}`,
      '',
      message.message,
    ].join('\n'),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel usually turns JSON into an object for us, but handle text too
  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid request.' });
    }
  }

  // Spam trap: real people never fill in the hidden "website" field.
  // Pretend it worked so the bot does not try again.
  if (body.website) {
    return res.status(200).json({ ok: true });
  }

  const { data, errors, ok } = validateContact(body);
  if (!ok) {
    return res.status(400).json({ error: Object.values(errors)[0], fields: errors });
  }

  try {
    const supabase = getSupabase();

    // Rate limit: count recent messages from the same email
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('email', data.email)
      .gte('created_at', since);

    if (countError) throw countError;
    if (count >= LIMIT) {
      return res.status(429).json({ error: 'You sent a few messages already. Please wait a few minutes and try again.' });
    }

    const { error: insertError } = await supabase.from('messages').insert({
      name: data.name,
      email: data.email,
      company: data.company || null,
      message: data.message,
    });
    if (insertError) throw insertError;

    // The message is already saved, so an email problem should not show an error to the visitor
    try {
      await emailMe(data);
    } catch (mailError) {
      console.error('Saved the message, but the email copy failed:', mailError);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('POST /api/contact failed:', error);
    return res.status(500).json({ error: 'Sorry, the message could not be sent. Please email me directly.' });
  }
}
