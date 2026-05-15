import { db } from "@/db";
import * as schema from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

/**
 * When a lead becomes `won`, create or refresh a booking row from lead + package.
 * Requires `destination_interest` (package) on the lead — otherwise skips (logs warning).
 *
 * @param {number} leadId
 * @returns {Promise<{ bookingId: number | null; skipped?: string }>}
 */
export async function syncBookingFromWonLead(leadId) {
  const lead = await db.query.leads.findFirst({
    where: and(eq(schema.leads.id, leadId), isNull(schema.leads.deletedAt)),
    with: {
      destinationInterest: {
        columns: { id: true, currentPrice: true, title: true },
      },
    },
  });

  if (!lead || lead.status !== "won") {
    return { bookingId: null, skipped: "not_won_or_missing_lead" };
  }

  const packageId = lead.destinationInterest?.id;
  if (!packageId) {
    console.warn("[bookings] Won lead has no destination package; cannot create booking.", { leadId });
    return { bookingId: null, skipped: "no_package" };
  }

  const budgetStr =
    lead.budget != null && String(lead.budget).trim() !== ""
      ? String(lead.budget)
      : String(lead.destinationInterest?.currentPrice ?? "0");

  const travelStartDate = lead.travelDate ?? new Date();
  const travelersCount = lead.numberOfPeople != null && lead.numberOfPeople > 0 ? lead.numberOfPeople : 1;

  const existing = await db.query.bookings.findFirst({
    where: and(eq(schema.bookings.leadId, leadId), isNull(schema.bookings.deletedAt)),
  });

  const base = {
    packageId,
    customerName: lead.fullName,
    customerPhone: lead.phone,
    customerEmail: lead.email || null,
    travelStartDate,
    travelersCount,
    totalAmount: budgetStr,
    notes: lead.message || null,
    updatedAt: new Date(),
  };

  if (existing) {
    await db
      .update(schema.bookings)
      .set({
        ...base,
        // Keep existing booking + payment status unless this was a stale row
        bookingStatus: existing.bookingStatus,
        paymentStatus: existing.paymentStatus,
      })
      .where(eq(schema.bookings.id, existing.id));
    return { bookingId: existing.id };
  }

  const [inserted] = await db
    .insert(schema.bookings)
    .values({
      leadId,
      ...base,
      bookingStatus: "pending",
      paymentStatus: "pending",
    })
    .returning();

  return { bookingId: inserted?.id ?? null };
}
