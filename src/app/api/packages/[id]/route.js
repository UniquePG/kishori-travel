import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
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

export async function PUT(request, { params }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

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
      } else {
        thumbnail = body.thumbnail;
      }
    } else {
      body = await request.json();
      thumbnail = body.thumbnail;
    }

    const result = await db.transaction(async (tx) => {
      const [updatedPackage] = await tx.update(schema.packages)
        .set({
          title: body.title,
          slug: body.slug,
          shortDescription: body.shortDescription,
          description: body.description,
          location: body.location,
          durationDays: parseInt(body.durationDays),
          currentPrice: body.currentPrice.toString(),
          oldPrice: body.oldPrice ? body.oldPrice.toString() : null,
          thumbnail: thumbnail,
          isFeatured: body.isFeatured,
          isActive: body.isActive,
          updatedAt: new Date()
        })
        .where(eq(schema.packages.id, id))
        .returning();
      
      if (!updatedPackage) throw new Error("Package not found");

      // Sync inclusions: Delete old and insert new
      await tx.delete(schema.packageInclusions).where(eq(schema.packageInclusions.packageId, id));
      if (body.inclusions && body.inclusions.length > 0) {
        await tx.insert(schema.packageInclusions).values(
          body.inclusions.map((inc, index) => ({
            packageId: id,
            type: inc.type,
            title: inc.title,
            sortOrder: index,
          }))
        );
      }

      // Sync itinerary: Delete old and insert new
      await tx.delete(schema.packageItinerary).where(eq(schema.packageItinerary.packageId, id));
      if (body.itinerary && body.itinerary.length > 0) {
        await tx.insert(schema.packageItinerary).values(
          body.itinerary.map((item) => ({
            packageId: id,
            dayNumber: item.dayNumber,
            title: item.title,
            description: item.description,
          }))
        );
      }

      // Sync terms
      await tx.delete(schema.packageTerms).where(eq(schema.packageTerms.packageId, id));
      if (body.terms && body.terms.length > 0) {
        await tx.insert(schema.packageTerms).values(
          body.terms.map((term, index) => ({
            packageId: id,
            content: term,
            sortOrder: index,
          }))
        );
      }

      return updatedPackage;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Package update error:", error);
    return NextResponse.json({ error: "Failed to update package: " + error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    // Soft delete
    await db.update(schema.packages)
      .set({ deletedAt: new Date(), isActive: false })
      .where(eq(schema.packages.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Package delete error:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
