import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, isNull, desc, and } from "drizzle-orm";
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
    const leads = await db.query.leads.findMany({
      where: isNull(schema.leads.deletedAt),
      with: {
        assignee: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [desc(schema.leads.createdAt)],
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Fetch leads error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    
    const [lead] = await db.insert(schema.leads).values({
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      destinationInterest: body.destinationInterest,
      travelDate: body.travelDate ? new Date(body.travelDate) : null,
      numberOfPeople: body.numberOfPeople ? parseInt(body.numberOfPeople) : null,
      budget: body.budget ? body.budget.toString() : null,
      message: body.message,
      source: body.source || "phone",
      status: body.status || "new",
      assignedTo: body.assignee_to ? parseInt(body.assignee_to) : null,
    }).returning();

    // Drizzle returning doesn't include relations, so we fetch again or handle manually
    const leadWithAssignee = await db.query.leads.findFirst({
      where: eq(schema.leads.id, lead.id),
      with: {
        assignee: {
          columns: { id: true, name: true }
        }
      }
    });

    if (body.assignee_to) {
      await db.insert(schema.leadAssignments).values({
        leadId: lead.id,
        assignedTo: parseInt(body.assignee_to),
        note: "Initial assignment on creation",
      });
    }

    return NextResponse.json(leadWithAssignee);
  } catch (error) {
    console.error("Lead create error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

export async function PUT(request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  console.log("admin ", admin)

  try {
    const body = await request.json();
    const { id, ...data } = body;
    const leadId = parseInt(id);
    console.log("leadId ", leadId, id, data)

    const oldLead = await db.query.leads.findFirst({
      where: eq(schema.leads.id, leadId)
    });

    if (!oldLead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
     console.log("oldLead: ", oldLead)
    const newAssigneeId = data.assignee_to ? parseInt(data.assignee_to) : null;

    await db.update(schema.leads)
      .set({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        destinationInterest: data.destinationInterest,
        travelDate: data.travelDate ? new Date(data.travelDate) : null,
        numberOfPeople: data.numberOfPeople ? parseInt(data.numberOfPeople) : null,
        budget: data.budget ? data.budget.toString() : null,
        message: data.message,
        source: data.source,
        status: data.status,
        assignedTo: newAssigneeId,
        updatedAt: new Date(),
      })
      .where(eq(schema.leads.id, leadId));

    const updatedLead = await db.query.leads.findFirst({
      where: eq(schema.leads.id, leadId),
      with: {
        assignee: {
          columns: { id: true, name: true }
        }
      }
    });

    console.log("newAssigneeId: ", newAssigneeId)

    // Track assignment change
    if (newAssigneeId !== oldLead.assignedTo) {
      await db.insert(schema.leadAssignments).values({
        leadId: leadId,
        assignedFrom: oldLead.assignedTo,
        assignedTo: newAssigneeId,
        note: "Lead re-assigned by admin",
      });
    }

    // Track status change
    if (data.status !== oldLead.status) {
      await db.insert(schema.leadStatusHistory).values({
        leadId: leadId,
        oldStatus: oldLead.status,
        newStatus: data.status,
        changedBy: parseInt(admin.id),
        note: "Status updated by admin",
      });
    }

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Lead update error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const leadId = parseInt(id);
    if (isNaN(leadId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    await db.update(schema.leads)
      .set({ deletedAt: new Date() })
      .where(eq(schema.leads.id, leadId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead delete error:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
