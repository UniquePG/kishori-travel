import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export async function GET() {
  try {
    const packages = await db.query.packages.findMany({
      where: and(isNull(schema.packages.deletedAt), eq(schema.packages.isActive, true)),
      columns: {
        location: true,
        durationDays: true,
        packageType: true,
      },
    });

    // Extract unique locations, durations, and types
    const destinations = [...new Set(packages.map(p => p.location))].filter(Boolean).slice(0, 10);
    const durations = [...new Set(packages.map(p => p.durationDays))].filter(Boolean).sort((a, b) => a - b).slice(0, 10);
    const packageTypes = [...new Set(packages.map(p => p.packageType))].filter(Boolean).sort().slice(0, 10);

    return NextResponse.json({
      destinations,
      durations,
      packageTypes,
    });
  } catch (error) {
    console.error("Fetch filters error:", error);
    return NextResponse.json({ error: "Failed to fetch filter data" }, { status: 500 });
  }
}
