import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, isNull, desc } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { notifyMemberOfLeadAssignment } from "@/lib/mail/notifyLeadAssignment";
import { syncBookingFromWonLead } from "@/lib/bookings/syncBookingFromWonLead";

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
            email: true,
            phone: true,
          },
        },
        destinationInterest: {
          id: true,
          title: true,
          slug: true,
          isFeatured: true,
          isUpcoming: true,
          currentPrice: true,
          packageType: true,
          location: true
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
      days: body.days ? parseInt(body.days) : null,
      night: body.night ? parseInt(body.night) : null,
      source: body.source || "phone",
      status: body.status || "new",
      assignedTo: body.assignee_to ? parseInt(body.assignee_to) : null,
    }).returning();

    // Drizzle returning doesn't include relations, so we fetch again or handle manually
    const leadWithAssignee = await db.query.leads.findFirst({
      where: eq(schema.leads.id, lead.id),
      with: {
        assignee: {
          columns: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (body.assignee_to) {
      const assigneeId = parseInt(body.assignee_to, 10);
      await db.insert(schema.leadAssignments).values({
        leadId: lead.id,
        assignedTo: assigneeId,
        note: "Initial assignment on creation",
      });
      await notifyMemberOfLeadAssignment({
        leadId: lead.id,
        assigneeUserId: assigneeId,
        kind: "new",
      });
    }

    if (leadWithAssignee?.status === "won") {
      await syncBookingFromWonLead(lead.id);
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

  try {
    const body = await request.json();
    const { id, ...data } = body;
    const leadId = parseInt(id);
    console.log("leadId ", leadId, id, data)

    const oldLead = await db.query.leads.findFirst({
      where: eq(schema.leads.id, leadId)
    });

    if (!oldLead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    
    let newAssigneeId = null;
    if (data.assignedTo && data.assignedTo !== "0" && data.assignedTo !== 0) {
      newAssigneeId = parseInt(data.assignedTo);
    }
    
    await db.update(schema.leads)
      .set({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        destinationInterest: data.destinationInterest?.id,
        travelDate: data.travelDate ? new Date(data.travelDate) : null,
        numberOfPeople: data.numberOfPeople ? parseInt(data.numberOfPeople) : null,
        budget: data.budget ? data.budget.toString() : null,
        message: data.message,
        days: data.days ? parseInt(data.days) : null,
        night: data.night ? parseInt(data.night) : null,
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
          columns: { id: true, name: true, email: true, phone: true },
        },
      },
    });


    // Track assignment change (assigned_to is NOT NULL on lead_assignments — skip row when unassigning)
    if (newAssigneeId && newAssigneeId !== oldLead.assignedTo) {
      await db.insert(schema.leadAssignments).values({
        leadId: leadId,
        assignedFrom: oldLead.assignedTo,
        assignedTo: newAssigneeId,
        note: "Lead re-assigned by admin",
      });
      const kind = oldLead.assignedTo ? "reassigned" : "new";
      void notifyMemberOfLeadAssignment({
        leadId,
        assigneeUserId: newAssigneeId,
        kind,
        previousAssigneeUserId: oldLead.assignedTo ?? undefined,
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

    if (data.status === "won" && oldLead.status !== "won") {
      await syncBookingFromWonLead(leadId);
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
