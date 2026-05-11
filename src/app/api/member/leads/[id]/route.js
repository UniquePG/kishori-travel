import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function checkMember() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload;
}

export async function PUT(request, { params }) {
  const user = await checkMember();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const { status, note } = await request.json();

    const oldLead = await db.query.leads.findFirst({
      where: eq(schema.leads.id, id)
    });

    if (!oldLead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    // Verify it belongs to this member (unless admin/manager)
    if (oldLead.assignedTo !== user.id && user.role === 'member') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [lead] = await db.update(schema.leads)
      .set({ 
        status,
        message: note ? `${oldLead.message || ""}\n\n[Note ${new Date().toLocaleDateString()}]: ${note}` : oldLead.message,
        updatedAt: new Date()
      })
      .where(eq(schema.leads.id, id))
      .returning();

    // Track status change
    if (status !== oldLead.status) {
      await db.insert(schema.leadStatusHistory).values({
        leadId: id,
        oldStatus: oldLead.status,
        newStatus: status,
        changedBy: user.id,
        note: note || "Status updated by member"
      });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Member lead update error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
