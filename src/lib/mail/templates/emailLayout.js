/**
 * Shared HTML shell for transactional mail (inline styles for clients).
 */
export function wrapEmailLayout({ title, preheader, bodyHtml, footerNote }) {
  const safePreheader = preheader
    ? `<div style="display:none;font-size:1px;color:#f4f4f5;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  ${safePreheader}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#ea580c 0%,#c2410c 100%);padding:20px 24px;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.02em;">Kishori Travels</p>
              <p style="margin:6px 0 0;font-size:13px;color:#ffedd5;opacity:0.95;">Team CRM notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 8px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 28px;">
              <p style="margin:20px 0 0;font-size:12px;color:#64748b;line-height:1.5;">${footerNote}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function detailRow(label, value) {
  const v = value == null || value === "" ? "—" : String(value);
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;font-weight:500;vertical-align:top;">${escapeHtml(v)}</td>
  </tr>`;
}

/** Preserves line breaks for inquiry notes / messages. */
export function detailRowMultiline(label, value) {
  const raw = value == null || value === "" ? "—" : String(value);
  const inner = raw === "—" ? "—" : escapeHtml(raw).replace(/\n/g, "<br/>");
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;font-weight:500;vertical-align:top;">${inner}</td>
  </tr>`;
}

export function leadDetailsTableHtml(rows) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:8px;">
    ${rows.join("")}
  </table>`;
}
