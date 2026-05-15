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
    detailRow("Lead created", ctx.createdAt),
    detailRow("Last updated", ctx.updatedAt),
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
    `Updated: ${ctx.updatedAt}`,
    "",
    "Message:",
    ctx.message || "—",
    "",
    `Previously handled by: ${ctx.previousAssigneeName}`,
    "",
    `Open in CRM: ${ctx.leadUrl}`,
  ].join("\n");
}

/**
 * @param {{ memberName: string; lead: object; leadUrl: string; previousAssigneeName: string }} params
 */
export function buildLeadReassignedToYouEmail({
  memberName,
  lead,
  leadUrl,
  previousAssigneeName,
}) {
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
    updatedAt: formatDateTimeISO(lead.updatedAt),
    message: lead.message || "",
    leadUrl,
    previousAssigneeName,
  };

  const subject = `Lead reassigned to you: ${lead.fullName}`;
  const preheader = `This inquiry was reassigned from ${previousAssigneeName} — ${lead.fullName}`;

  const bodyHtml = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;font-weight:700;">Lead reassigned to you</h1>
    <p style="margin:0 0 12px;font-size:15px;color:#475569;line-height:1.55;">Hi ${escapeHtml(memberName)}, an existing lead has been reassigned to you by the admin team.</p>
    <p style="margin:0 0 20px;padding:12px 14px;background:#fff7ed;border-left:4px solid #ea580c;border-radius:0 8px 8px 0;font-size:14px;color:#9a3412;line-height:1.5;">
      <strong>Previously assigned to:</strong> ${escapeHtml(previousAssigneeName)}
    </p>
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
      "This lead was transferred to you in Kishori Travels CRM. Review history in the dashboard if available.",
  });

  const text = [
    `Hi ${memberName},`,
    "",
    `An existing lead has been reassigned to you (previously: ${previousAssigneeName}).`,
    "",
    plainTextBlock(ctx),
    "",
    "— Kishori Travels",
  ].join("\n");

  return { subject, html, text };
}
