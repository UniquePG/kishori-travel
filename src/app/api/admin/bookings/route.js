import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { and, desc, eq, gte, ilike, isNull, lte, or } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload && payload.role === "admin" ? payload : null;
}

export async function GET(request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q")?.trim();
    const travelFrom = searchParams.get("travelFrom");
    const travelTo = searchParams.get("travelTo");
    const packageId = searchParams.get("packageId");

    const conditions = [isNull(schema.bookings.deletedAt)];

    if (status && ["pending", "confirmed", "cancelled"].includes(status)) {
      conditions.push(eq(schema.bookings.bookingStatus, status));
    }

    if (packageId && !Number.isNaN(parseInt(packageId, 10))) {
      conditions.push(eq(schema.bookings.packageId, parseInt(packageId, 10)));
    }

    if (q) {
      const like = `%${q}%`;
      conditions.push(
        or(
          ilike(schema.bookings.customerName, like),
          ilike(schema.bookings.customerEmail, like),
          ilike(schema.bookings.customerPhone, like)
        )
      );
    }

    if (travelFrom) {
      const d = new Date(travelFrom);
      if (!Number.isNaN(d.getTime())) conditions.push(gte(schema.bookings.travelStartDate, d));
    }
    if (travelTo) {
      const d = new Date(travelTo);
      if (!Number.isNaN(d.getTime())) conditions.push(lte(schema.bookings.travelStartDate, d));
    }

    const rows = await db.query.bookings.findMany({
      where: and(...conditions),
      orderBy: [desc(schema.bookings.createdAt)],
      with: {
        lead: {
          with: {
            assignee: {
              columns: { id: true, name: true, email: true, phone: true },
            },
            destinationInterest: { columns: { id: true, title: true } },
          },
        },
        package: {
          columns: { id: true, title: true, slug: true },
        },
      },
    });

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Admin bookings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
