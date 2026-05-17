import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { and, desc, eq, gte, ilike, isNull, lte, or } from "drizzle-orm";
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

function parseOptionalDate(value) {
  if (value == null || value === "") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Valid room-sharing rows for insert (label + numeric price). */
function normalizeRoomSharingOptions(body) {
  const rows = body.roomSharingOptions;
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r, index) => {
      const label = (r?.label ?? "").toString().trim();
      const raw = r?.price;
      const priceStr =
        raw != null && raw !== "" ? Number(raw).toString() : "";
      if (!label || priceStr === "" || Number.isNaN(Number(priceStr))) return null;
      return { label, price: priceStr, sortOrder: index };
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get("destination");
    const duration = searchParams.get("duration");
    const budget = searchParams.get("budget");
    const type = searchParams.get("type");
    const activeOnly = searchParams.get("activeOnly") === "1";

    const conditions = [isNull(schema.packages.deletedAt)];

    if (activeOnly) {
      conditions.push(
        or(eq(schema.packages.isActive, true), eq(schema.packages.isUpcoming, true))
      );
    }

    if (destination) {
      conditions.push(ilike(schema.packages.location, `%${destination}%`));
    }

    if (duration) {
      conditions.push(eq(schema.packages.durationDays, parseInt(duration, 10)));
    }

    if (budget) {
      const [min, max] = budget.split("-").map(Number);
      if (!Number.isNaN(min)) conditions.push(gte(schema.packages.currentPrice, min.toString()));
      if (!Number.isNaN(max)) conditions.push(lte(schema.packages.currentPrice, max.toString()));
    }

    if (type) {
      conditions.push(ilike(schema.packages.packageType, `%${type}%`));
    }

    const packages = await db.query.packages.findMany({
      where: and(...conditions),
      orderBy: [desc(schema.packages.createdAt)],
      with: packageRelationsQuery,
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
    const roomRows = normalizeRoomSharingOptions(body);

    const newPackage = await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(schema.packages)
        .values({
          title: body.title,
          slug,
          packageType: body.packageType,
          description: body.description,
          location: body.location,
          durationDays: parseInt(body.durationDays, 10),
          currentPrice: body.currentPrice.toString(),
          oldPrice: body.oldPrice ? body.oldPrice.toString() : null,
          thumbnail,
          isFeatured: body.isFeatured ?? false,
          isActive: body.isActive ?? true,
          isUpcoming: body.isUpcoming ?? false,
          upcomingLabel: body.upcomingLabel?.trim() || null,
          expectedLaunchAt: parseOptionalDate(body.expectedLaunchAt),
          offerTitle: body.offerTitle?.trim() || null,
          offerDescription: body.offerDescription?.trim() || null,
          offerValidUntil: parseOptionalDate(body.offerValidUntil),
          createdBy: parseInt(String(admin.id), 10),
        })
        .returning();

      if (body.inclusions && body.inclusions.length > 0) {
        await tx.insert(schema.packageInclusions).values(
          body.inclusions.map((inc, index) => ({
            packageId: inserted.id,
            type: inc.type,
            title: inc.title,
            sortOrder: index,
          }))
        );
      }

      if (body.itinerary && body.itinerary.length > 0) {
        await tx.insert(schema.packageItinerary).values(
          body.itinerary.map((item) => ({
            packageId: inserted.id,
            dayNumber: item.dayNumber,
            title: item.title,
            description: item.description,
          }))
        );
      }

      if (body.terms && body.terms.length > 0) {
        await tx.insert(schema.packageTerms).values(
          body.terms.map((term, index) => ({
            packageId: inserted.id,
            content: term,
            sortOrder: index,
          }))
        );
      }

      if (roomRows.length > 0) {
        await tx.insert(schema.packageRoomSharingOptions).values(
          roomRows.map((row, index) => ({
            packageId: inserted.id,
            label: row.label,
            price: row.price,
            sortOrder: index,
          }))
        );
      }

      return inserted;
    });

    const full = await fetchPackageWithRelations(newPackage.id);
    return NextResponse.json(full ?? newPackage, { status: 201 });
  } catch (error) {
    console.error("Package create error:", error);
    return NextResponse.json({ error: "Failed to create package: " + error.message }, { status: 500 });
  }
}
