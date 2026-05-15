import { createTransporter, isMailConfigured } from "./transporter";

function resolveFromAddress() {
  const addr =
    process.env.SMTP_FROM_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim();
  const name =
    process.env.SMTP_FROM_NAME?.trim() ||
    process.env.MAIL_FROM_NAME?.trim() ||
    "Kishori Travels";
  if (!addr) return null;
  return `"${name}" <${addr}>`;
}

/**
 * @param {{ to: string; subject: string; html: string; text: string }} opts
 * @returns {Promise<{ skipped?: boolean; messageId?: string; error?: string }>}
 */
export async function sendMail({ to, subject, html, text }) {
  if (!isMailConfigured()) {
    console.warn(
      "[mail] Skipped send: set SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL (and SMTP_PORT / SMTP_SECURE if needed), or MAIL_ENABLED=false."
    );
    return { skipped: true };
  }
  const transporter = createTransporter();
  const from = resolveFromAddress();
  if (!transporter || !from) {
    return { skipped: true };
  }
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    return { messageId: info.messageId };
  } catch (err) {
    console.error("[mail] sendMail failed:", err?.message || err);
    return { error: err?.message || String(err) };
  }
}
