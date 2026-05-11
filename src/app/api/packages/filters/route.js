import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { isNull, sql } from "drizzle-orm";

export async function GET() {
  try {
    const packages = await db.query.packages.findMany({
      where: isNull(schema.packages.deletedAt),
      columns: {
        location: true,
        durationDays: true,
      }
    });

    // Extract unique locations and durations
    const destinations = [...new Set(packages.map(p => p.location))].filter(Boolean).slice(0, 10);
    const durations = [...new Set(packages.map(p => p.durationDays))].filter(Boolean).sort((a, b) => a - b).slice(0, 10);

    return NextResponse.json({
      destinations,
      durations,
    });
  } catch (error) {
    console.error("Fetch filters error:", error);
    return NextResponse.json({ error: "Failed to fetch filter data" }, { status: 500 });
  }
}
