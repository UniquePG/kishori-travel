import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, isNull, asc } from "drizzle-orm";
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
    const faqs = await db.query.faqs.findMany({
      where: isNull(schema.faqs.deletedAt),
      orderBy: [asc(schema.faqs.sortOrder)]
    });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Fetch FAQs error:", error);
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { question, answer, sort_order, is_active } = await request.json();
    const [faq] = await db.insert(schema.faqs).values({
      question,
      answer,
      sortOrder: Number(sort_order) || 0,
      isActive: is_active ?? true
    }).returning();
    return NextResponse.json(faq);
  } catch (error) {
    console.error("FAQ create error:", error);
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
