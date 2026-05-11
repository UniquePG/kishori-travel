import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, isNull, desc, and, inArray } from "drizzle-orm";
import { verifyToken, hashPassword } from "@/lib/auth";
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
    // Get members
    const members = await db.query.users.findMany({
      where: and(
        inArray(schema.users.role, ["member", "manager"]),
        isNull(schema.users.deletedAt)
      ),
      orderBy: [desc(schema.users.createdAt)],
    });

    // Get assigned lead counts for these members
    const membersWithCounts = await Promise.all(members.map(async (member) => {
      const leads = await db.query.leads.findMany({
        where: and(
          eq(schema.leads.assignedTo, member.id),
          isNull(schema.leads.deletedAt)
        ),
        columns: {
          id: true
        }
      });
      return {
        ...member,
        assignedLeadsCount: leads.length
      };
    }));

    return NextResponse.json(membersWithCounts);
  } catch (error) {

    console.error("Fetch members error:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, email, phone, password, role } = await request.json();
    
    // Check if user already exists
    const existing = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const passwordHash = await hashPassword(password);
    
    const [member] = await db.insert(schema.users).values({
      name,
      email,
      phone,
      passwordHash,
      role: role || "member",
    }).returning();
    
    return NextResponse.json(member);
  } catch (error) {
    console.error("Member create error:", error);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}

export async function PUT(request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, name, email, phone, password, role, is_active } = await request.json();
    
    const updateData = { name, email, phone, role, isActive: is_active };
    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }

    const [member] = await db.update(schema.users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    
    return NextResponse.json(member);
  } catch (error) {
    console.error("Member update error:", error);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    await db.update(schema.users)
      .set({ deletedAt: new Date(), isActive: false })
      .where(eq(schema.users.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Member delete error:", error);
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
