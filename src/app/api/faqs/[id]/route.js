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
    const { question, answer, sort_order, is_active } = await request.json();
    const [faq] = await db.update(schema.faqs)
      .set({
        question,
        answer,
        sortOrder: Number(sort_order),
        isActive: is_active,
        updatedAt: new Date()
      })
      .where(eq(schema.faqs.id, id))
      .returning();
    return NextResponse.json(faq);
  } catch (error) {
    console.error("FAQ update error:", error);
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    // Soft delete
    await db.update(schema.faqs)
      .set({ deletedAt: new Date() })
      .where(eq(schema.faqs.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FAQ delete error:", error);
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
