import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { and, count, eq, isNull, ne, sum } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload && payload.role === "admin" ? payload : null;
}

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const base = isNull(schema.bookings.deletedAt);

    const [totalRow] = await db
      .select({ value: count() })
      .from(schema.bookings)
      .where(base);

    const [confirmedRow] = await db
      .select({ value: count() })
      .from(schema.bookings)
      .where(and(base, eq(schema.bookings.bookingStatus, "confirmed")));

    const [pendingRow] = await db
      .select({ value: count() })
      .from(schema.bookings)
      .where(and(base, eq(schema.bookings.bookingStatus, "pending")));

    const [cancelledRow] = await db
      .select({ value: count() })
      .from(schema.bookings)
      .where(and(base, eq(schema.bookings.bookingStatus, "cancelled")));

    const [valueRow] = await db
      .select({ total: sum(schema.bookings.totalAmount) })
      .from(schema.bookings)
      .where(and(base, ne(schema.bookings.bookingStatus, "cancelled")));

    const bookedValue = valueRow?.total != null ? String(valueRow.total) : "0";

    return NextResponse.json({
      total: totalRow?.value ?? 0,
      confirmed: confirmedRow?.value ?? 0,
      pending: pendingRow?.value ?? 0,
      cancelled: cancelledRow?.value ?? 0,
      bookedValue,
    });
  } catch (error) {
    console.error("Admin bookings stats error:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
