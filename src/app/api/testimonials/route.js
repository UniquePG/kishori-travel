import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, isNull, desc } from "drizzle-orm";
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
  try {
    const items = await db.query.testimonials.findMany({
      where: isNull(schema.testimonials.deletedAt),
      orderBy: [desc(schema.testimonials.createdAt)]
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Fetch testimonials error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { customerName, review, imageUrl, rating, location, isActive } = await request.json();
    const [item] = await db.insert(schema.testimonials).values({
      customerName: customerName,
      review: review,
      location: location,
      rating: Number(rating) || 5,
      imageUrl: imageUrl,
      isActive: isActive ?? true
    }).returning();

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Testimonial create error:", error);
    return NextResponse.json({ error: "Failed to add testimonial" }, { status: 500 });
  }
}
