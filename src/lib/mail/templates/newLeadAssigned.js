import {
  formatDateISO,
  formatDateTimeISO,
  formatLeadSource,
  formatLeadStatus,
  formatMoney,
} from "../formatLeadContext";
import {
  detailRow,
  detailRowMultiline,
  escapeHtml,
  leadDetailsTableHtml,
  wrapEmailLayout,
} from "./emailLayout";

function buildRows(ctx) {
  return [
    detailRow("Lead ID", `#${ctx.leadId}`),
    detailRow("Customer name", ctx.fullName),
    detailRow("Phone", ctx.phone),
    detailRow("Email", ctx.email || "—"),
    detailRow("Destination interest", ctx.packageTitle || "—"),
    detailRow("Travel date", ctx.travelDate),
    detailRow("Travelers", ctx.numberOfPeople),
    detailRow("Budget", ctx.budget),
    detailRow("Source", ctx.source),
    detailRow("Pipeline status", ctx.status),
    detailRow("Created", ctx.createdAt),
    detailRowMultiline("Message / notes", ctx.message),
  ];
}

function plainTextBlock(ctx) {
  return [
    `Lead #${ctx.leadId}`,
    `Customer: ${ctx.fullName}`,
    `Phone: ${ctx.phone}`,
    `Email: ${ctx.email || "—"}`,
    `Destination: ${ctx.packageTitle || "—"}`,
    `Travel date: ${ctx.travelDate}`,
    `Travelers: ${ctx.numberOfPeople}`,
    `Budget: ${ctx.budget}`,
    `Source: ${ctx.source}`,
    `Status: ${ctx.status}`,
    `Created: ${ctx.createdAt}`,
    "",
    "Message:",
    ctx.message || "—",
    "",
    `Open in CRM: ${ctx.leadUrl}`,
  ].join("\n");
}

/**
 * @param {{ memberName: string; lead: object; leadUrl: string }} params
 */
export function buildNewLeadAssignedEmail({ memberName, lead, leadUrl }) {
  const ctx = {
    leadId: lead.id,
    fullName: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    packageTitle: lead.destinationInterest?.title,
    travelDate: formatDateISO(lead.travelDate),
    numberOfPeople: lead.numberOfPeople != null ? String(lead.numberOfPeople) : "—",
    budget: formatMoney(lead.budget),
    source: formatLeadSource(lead.source),
    status: formatLeadStatus(lead.status),
    createdAt: formatDateTimeISO(lead.createdAt),
    message: lead.message || "",
    leadUrl,
  };

  const subject = `New lead assigned: ${lead.fullName}`;
  const preheader = `You have a new inquiry — ${lead.fullName} · ${ctx.phone}`;

  const bodyHtml = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;font-weight:700;">New lead assigned to you</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.55;">Hi ${escapeHtml(memberName)}, a new travel lead has been assigned to you. Please follow up from your member dashboard.</p>
    <p style="margin:0 0 16px;">
      <a href="${escapeHtml(leadUrl)}" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:8px;">View lead in dashboard</a>
    </p>
    ${leadDetailsTableHtml(buildRows(ctx))}
  `;

  const html = wrapEmailLayout({
    title: subject,
    preheader,
    bodyHtml,
    footerNote:
      "You are receiving this because a lead was assigned to your account in Kishori Travels CRM. If anything looks wrong, contact your administrator.",
  });

  const text = [
    `Hi ${memberName},`,
    "",
    "A new travel lead has been assigned to you.",
    "",
    plainTextBlock(ctx),
    "",
    "— Kishori Travels",
  ].join("\n");

  return { subject, html, text };
}
