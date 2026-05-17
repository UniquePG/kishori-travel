import { db } from "@/db";
import { gallery, leads, packages, testimonials } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { count, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    const user = await verifyToken(token);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get counts
    const [leadsCount] = await db.select({ value: count() }).from(leads).where(isNull(leads.deletedAt));
    const [packagesCount] = await db.select({ value: count() }).from(packages).where(isNull(packages.deletedAt));
    const [galleryCount] = await db.select({ value: count() }).from(gallery).where(isNull(gallery.deletedAt));
    const [testimonialsCount] = await db.select({ value: count() }).from(testimonials).where(isNull(testimonials.deletedAt));

    // Get recent leads for the dashboard table
    const recentLeads = await db.query.leads.findMany({
      where: isNull(leads.deletedAt),
      orderBy: (leads, { desc }) => [desc(leads.createdAt)],
      limit: 5,
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

    // Get recent packages for the dashboard table
    const recentPackages = await db.query.packages.findMany({
      where: isNull(packages.deletedAt),
      orderBy: (packages, { desc }) => [desc(packages.createdAt)],
      limit: 5
    });

    return NextResponse.json({
      stats: [
        { title: "Total Leads", value: leadsCount.value, icon: "Target" },
        { title: "Packages", value: packagesCount.value, icon: "Package" },
        { title: "Media Items", value: galleryCount.value, icon: "ImageIcon" },
        { title: "Testimonials", value: testimonialsCount.value, icon: "MessageSquare" }
      ],
      recentLeads,
      recentPackages
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
