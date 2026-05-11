import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, isNull, count } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function checkMember() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload && (payload.role === "member" || payload.role === "manager" || payload.role === "admin") ? payload : null;
}

export async function GET() {
  const user = await checkMember();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [totalLeads] = await db
      .select({ count: count() })
      .from(schema.leads)
      .where(and(eq(schema.leads.assignedTo, user.id), isNull(schema.leads.deletedAt)));

    const [pendingLeads] = await db
      .select({ count: count() })
      .from(schema.leads)
      .where(
        and(
          eq(schema.leads.assignedTo, user.id),
          isNull(schema.leads.deletedAt),
          eq(schema.leads.status, "contacted")
        )
      );

    const [completedLeads] = await db
      .select({ count: count() })
      .from(schema.leads)
      .where(
        and(
          eq(schema.leads.assignedTo, user.id),
          isNull(schema.leads.deletedAt),
          eq(schema.leads.status, "won")
        )
      );

    const [newLeads] = await db
      .select({ count: count() })
      .from(schema.leads)
      .where(
        and(
          eq(schema.leads.assignedTo, user.id),
          isNull(schema.leads.deletedAt),
          eq(schema.leads.status, "new")
        )
      );

    return NextResponse.json({
      total: totalLeads.count,
      pending: pendingLeads.count,
      completed: completedLeads.count,
      new: newLeads.count
    });
  } catch (error) {
    console.error("Fetch member stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
