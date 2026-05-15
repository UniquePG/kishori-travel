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

function parseOptionalDate(value) {
  if (value == null || value === "") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeRoomSharingOptions(body) {
  const rows = body.roomSharingOptions;
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r, index) => {
      const label = (r?.label ?? "").toString().trim();
      const n = Number(r?.price);
      if (!label || !Number.isFinite(n) || n < 0) return null;
      return { label, price: n.toString(), sortOrder: index };
    })
    .filter(Boolean);
}

const packageRelationsQuery = {
  inclusions: true,
  itinerary: true,
  images: true,
  terms: true,
  roomSharingOptions: {
    orderBy: (row, { asc }) => [asc(row.sortOrder)],
  },
};

async function fetchPackageWithRelations(packageId) {
  return db.query.packages.findFirst({
    where: eq(schema.packages.id, packageId),
    with: packageRelationsQuery,
  });
}

export async function PUT(request, { params }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const packageId = parseInt(String(id), 10);
  if (!Number.isFinite(packageId)) {
    return NextResponse.json({ error: "Invalid package id" }, { status: 400 });
  }

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

    const roomRows = normalizeRoomSharingOptions(body);

    await db.transaction(async (tx) => {
      const [updatedPackage] = await tx
        .update(schema.packages)
        .set({
          title: body.title,
          slug: body.slug,
          packageType: body.packageType,
          description: body.description,
          location: body.location,
          durationDays: parseInt(body.durationDays, 10),
          currentPrice: body.currentPrice.toString(),
          oldPrice: body.oldPrice ? body.oldPrice.toString() : null,
          thumbnail,
          isFeatured: body.isFeatured,
          isActive: body.isActive,
          isUpcoming: body.isUpcoming ?? false,
          upcomingLabel: body.upcomingLabel?.trim() || null,
          expectedLaunchAt: parseOptionalDate(body.expectedLaunchAt),
          offerTitle: body.offerTitle?.trim() || null,
          offerDescription: body.offerDescription?.trim() || null,
          offerValidUntil: parseOptionalDate(body.offerValidUntil),
          updatedAt: new Date(),
        })
        .where(eq(schema.packages.id, packageId))
        .returning();

      if (!updatedPackage) throw new Error("Package not found");

      await tx.delete(schema.packageInclusions).where(eq(schema.packageInclusions.packageId, packageId));
      if (body.inclusions && body.inclusions.length > 0) {
        await tx.insert(schema.packageInclusions).values(
          body.inclusions.map((inc, index) => ({
            packageId,
            type: inc.type,
            title: inc.title,
            sortOrder: index,
          }))
        );
      }

      await tx.delete(schema.packageItinerary).where(eq(schema.packageItinerary.packageId, packageId));
      if (body.itinerary && body.itinerary.length > 0) {
        await tx.insert(schema.packageItinerary).values(
          body.itinerary.map((item) => ({
            packageId,
            dayNumber: item.dayNumber,
            title: item.title,
            description: item.description,
          }))
        );
      }

      await tx.delete(schema.packageTerms).where(eq(schema.packageTerms.packageId, packageId));
      if (body.terms && body.terms.length > 0) {
        await tx.insert(schema.packageTerms).values(
          body.terms.map((term, index) => ({
            packageId,
            content: term,
            sortOrder: index,
          }))
        );
      }

      await tx
        .delete(schema.packageRoomSharingOptions)
        .where(eq(schema.packageRoomSharingOptions.packageId, packageId));
      if (roomRows.length > 0) {
        await tx.insert(schema.packageRoomSharingOptions).values(
          roomRows.map((row, index) => ({
            packageId,
            label: row.label,
            price: row.price,
            sortOrder: index,
          }))
        );
      }
    });

    const full = await fetchPackageWithRelations(packageId);
    return NextResponse.json(full);
  } catch (error) {
    console.error("Package update error:", error);
    return NextResponse.json({ error: "Failed to update package: " + error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const packageId = parseInt(String(id), 10);
  if (!Number.isFinite(packageId)) {
    return NextResponse.json({ error: "Invalid package id" }, { status: 400 });
  }

  try {
    await db
      .update(schema.packages)
      .set({ deletedAt: new Date(), isActive: false })
      .where(eq(schema.packages.id, packageId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Package delete error:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
