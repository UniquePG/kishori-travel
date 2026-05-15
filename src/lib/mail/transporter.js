import nodemailer from "nodemailer";

function parsePort() {
  const raw = process.env.SMTP_PORT?.trim();
  if (!raw) return 587;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 587;
}

/** When unset: `true` if port is 465 (implicit SSL), else `false` (STARTTLS on 587 etc.). */
function parseSecure(port) {
  const raw = process.env.SMTP_SECURE?.trim().toLowerCase();
  if (raw === "true" || raw === "1" || raw === "yes") return true;
  if (raw === "false" || raw === "0" || raw === "no") return false;
  return port === 465;
}

export function isMailConfigured() {
  if (process.env.MAIL_ENABLED === "false") return false;
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM_EMAIL?.trim() || user;
  return Boolean(host && user && pass && from);
}

export function createTransporter() {
  if (!isMailConfigured()) return null;
  const port = parsePort();
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST.trim(),
    port,
    secure: parseSecure(port),
    auth: {
      user: process.env.SMTP_USER.trim(),
      pass: process.env.SMTP_PASS.trim(),
    },
  });
}
