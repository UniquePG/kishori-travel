import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload && payload.role === "admin" ? payload : null;
}

const bookingWith = {
  lead: {
    with: {
      assignee: {
        columns: { id: true, name: true, email: true, phone: true },
      },
      destinationInterest: { columns: { id: true, title: true } },
    },
  },
  package: { columns: { id: true, title: true, slug: true } },
};

export async function PATCH(request, { params }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const bookingId = parseInt(String(id), 10);
  if (!Number.isFinite(bookingId)) {
    return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const allowed = ["pending", "confirmed", "cancelled"];
    if (!body.bookingStatus || !allowed.includes(body.bookingStatus)) {
      return NextResponse.json({ error: "Invalid bookingStatus" }, { status: 400 });
    }

    const paymentAllowed = ["pending", "partial", "paid"];
    const patch = {
      bookingStatus: body.bookingStatus,
      updatedAt: new Date(),
    };
    if (body.paymentStatus && paymentAllowed.includes(body.paymentStatus)) {
      patch.paymentStatus = body.paymentStatus;
    }

    const [updated] = await db
      .update(schema.bookings)
      .set(patch)
      .where(eq(schema.bookings.id, bookingId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const full = await db.query.bookings.findFirst({
      where: eq(schema.bookings.id, bookingId),
      with: bookingWith,
    });

    return NextResponse.json(full);
  } catch (error) {
    console.error("Booking PATCH error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
