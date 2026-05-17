import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
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
    const leads = await db.query.leads.findMany({
      where: and(
        eq(schema.leads.assignedTo, user.id),
        isNull(schema.leads.deletedAt)
      ),
      orderBy: [desc(schema.leads.updatedAt)],
      with: {
        assignee: true,
        destinationInterest: {
          id: true,
          title: true,
          slug: true,
          isFeatured: true,
          isUpcoming: true,
          currentPrice: true,
          packageType: true,
          location: true
        }

      }

    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Fetch member leads error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
