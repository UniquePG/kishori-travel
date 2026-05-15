import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendMail } from "./sendMail";
import { buildNewLeadAssignedEmail } from "./templates/newLeadAssigned";
import { buildLeadReassignedToYouEmail } from "./templates/leadReassignedToYou";

function baseUrl() {
  const raw = process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

/**
 * Loads lead + package title and assignee email, then sends the appropriate template.
 * Never throws — logs and returns so API routes stay reliable if mail fails.
 *
 * @param {{ leadId: number; assigneeUserId: number; kind: 'new' | 'reassigned'; previousAssigneeUserId?: number | null }} params
 */
export async function notifyMemberOfLeadAssignment({
  leadId,
  assigneeUserId,
  kind,
  previousAssigneeUserId,
}) {
  try {
    const [assignee, lead] = await Promise.all([
      db.query.users.findFirst({
        where: eq(schema.users.id, assigneeUserId),
        columns: { id: true, name: true, email: true, isActive: true },
      }),
      db.query.leads.findFirst({
        where: eq(schema.leads.id, leadId),
        with: {
          destinationInterest: { columns: { id: true, title: true } },
        },
      }),
    ]);

    if (!assignee?.email) {
      console.warn("[mail] No assignee email; skip lead assignment notify.", { assigneeUserId });
      return;
    }
    if (!assignee.isActive) {
      console.warn("[mail] Assignee inactive; skip lead assignment notify.", { assigneeUserId });
      return;
    }
    if (!lead) {
      console.warn("[mail] Lead not found; skip notify.", { leadId });
      return;
    }

    const leadUrl = `${baseUrl()}/member/leads/${lead.id}`;

    let payload;
    if (kind === "reassigned" && previousAssigneeUserId) {
      const prev = await db.query.users.findFirst({
        where: eq(schema.users.id, previousAssigneeUserId),
        columns: { name: true },
      });
      const previousName = prev?.name?.trim() || "Another team member";
      payload = buildLeadReassignedToYouEmail({
        memberName: assignee.name,
        lead,
        leadUrl,
        previousAssigneeName: previousName,
      });
    } else {
      payload = buildNewLeadAssignedEmail({
        memberName: assignee.name,
        lead,
        leadUrl,
      });
    }

    const result = await sendMail({
      to: assignee.email,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    if (result.error) {
      console.error("[mail] notifyMemberOfLeadAssignment send failed", { leadId, result });
    }
    console.log("[mail] Send notify memeber mail successfully", result)
  } catch (err) {
    console.error("[mail] notifyMemberOfLeadAssignment error:", err?.message || err);
  }
}
