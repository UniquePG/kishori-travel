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

export async function PUT(request, { params }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const { customerName, review, location, imageUrl, rating, isActive } = await request.json();
    const [item] = await db.update(schema.testimonials)
      .set({
        customerName,
        review,
        location,
        imageUrl,
        rating: Number(rating),
        isActive: isActive,
        updatedAt: new Date()
      })
      .where(eq(schema.testimonials.id, id))
      .returning();

    
    if (!item) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Testimonial update error:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    // Soft delete
    await db.update(schema.testimonials)
      .set({ deletedAt: new Date(), isActive: false })
      .where(eq(schema.testimonials.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial delete error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
