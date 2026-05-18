import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";

export async function POST(request) {
  try {
    const body = await request.json();

    const destinationInterested = body.destinationInterest === '0' ? null : parseInt(body.destinationInterest);
    const days = body.days ? parseInt(body.days) : null;
    const night = body.night ? parseInt(body.night) : null;
    
    const [lead] = await db.insert(schema.leads).values({
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      destinationInterest: destinationInterested,
      numberOfPeople: body.numberOfPeople ? parseInt(body.numberOfPeople) : null,
      budget: body.budget ? body.budget.toString() : null,
      message: body.message,
      days: days,
      night: night,
      source: "website",
      status: "new",
    }).returning();

    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    console.error("Public lead create error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
