import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, isNull, desc } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

import { uploadToCloudinary } from "@/lib/cloudinary";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload && payload.role === "admin" ? payload : null;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function GET() {
  try {
    const packages = await db.query.packages.findMany({
      where: isNull(schema.packages.deletedAt),
      orderBy: [desc(schema.packages.createdAt)],
      with: {
        inclusions: true,
        itinerary: true,
        images: true,
      }
    });
    return NextResponse.json(packages);
  } catch (error) {
    console.error("Fetch packages error:", error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const contentType = request.headers.get("content-type") || "";
    let body;
    let thumbnail = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const dataStr = formData.get("data");
      body = JSON.parse(dataStr);
      
      const file = formData.get("thumbnail");
      if (file && typeof file !== "string") {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
        thumbnail = await uploadToCloudinary(base64Image);
      } else if (body.thumbnail) {
        thumbnail = body.thumbnail;
      }
    } else {
      body = await request.json();
      thumbnail = body.thumbnail;
    }

    const slug = body.slug || slugify(body.title);
    
    // Start a transaction to ensure all related data is created
    const result = await db.transaction(async (tx) => {
      const [newPackage] = await tx.insert(schema.packages).values({
        title: body.title,
        slug: slug,
        shortDescription: body.shortDescription,
        description: body.description,
        location: body.location,
        durationDays: parseInt(body.durationDays),
        currentPrice: body.currentPrice.toString(),
        oldPrice: body.oldPrice ? body.oldPrice.toString() : null,
        thumbnail: thumbnail,
        isFeatured: body.isFeatured ?? false,
        isActive: body.isActive ?? true,
        createdBy: admin.id,
      }).returning();

      if (body.inclusions && body.inclusions.length > 0) {
        await tx.insert(schema.packageInclusions).values(
          body.inclusions.map((inc, index) => ({
            packageId: newPackage.id,
            type: inc.type,
            title: inc.title,
            sortOrder: index,
          }))
        );
      }

      if (body.itinerary && body.itinerary.length > 0) {
        await tx.insert(schema.packageItinerary).values(
          body.itinerary.map((item) => ({
            packageId: newPackage.id,
            dayNumber: item.dayNumber,
            title: item.title,
            description: item.description,
          }))
        );
      }

      return newPackage;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Package create error:", error);
    return NextResponse.json({ error: "Failed to create package: " + error.message }, { status: 500 });
  }
}
