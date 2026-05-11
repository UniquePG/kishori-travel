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

export async function GET() {
  try {
    const items = await db.query.gallery.findMany({
      where: isNull(schema.gallery.deletedAt),
      orderBy: [desc(schema.gallery.createdAt)]
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Fetch gallery error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    let { title, description, mediaUrl, mediaType, thumbnailUrl, category, isActive } = body;

    // Handle Cloudinary upload for mediaUrl if it's a data URI
    if (mediaUrl && mediaUrl.startsWith('data:')) {
      mediaUrl = await uploadToCloudinary(mediaUrl, 'gallery');
    }

    // Handle Cloudinary upload for thumbnailUrl if it's a data URI
    if (thumbnailUrl && thumbnailUrl.startsWith('data:')) {
      thumbnailUrl = await uploadToCloudinary(thumbnailUrl, 'gallery/thumbnails');
    }

    const [item] = await db.insert(schema.gallery).values({
      title,
      description,
      mediaUrl,
      mediaType,
      thumbnailUrl,
      category,
      isActive: isActive ?? true
    }).returning();

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Gallery create error:", error);
    return NextResponse.json({ error: error.message || "Failed to add gallery item" }, { status: 500 });
  }
}

