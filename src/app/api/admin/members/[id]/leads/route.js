import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload && payload.role === "admin" ? payload : null;
}

export async function GET(request, { params }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const leads = await db.query.leads.findMany({
      where: and(
        eq(schema.leads.assignedTo, parseInt(id)),
        isNull(schema.leads.deletedAt)
      ),
      with: {
        destinationInterest: true,
      },
      orderBy: [desc(schema.leads.createdAt)],
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Fetch member leads error:", error);
    return NextResponse.json({ error: "Failed to fetch leads for this member" }, { status: 500 });
  }
}
