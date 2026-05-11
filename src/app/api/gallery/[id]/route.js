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

    const [item] = await db.update(schema.gallery)
      .set({
        title,
        description,
        mediaUrl,
        mediaType,
        thumbnailUrl,
        category,
        isActive,
        updatedAt: new Date()
      })
      .where(eq(schema.gallery.id, id))
      .returning();
    
    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Gallery update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update gallery item" }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    // Soft delete
    await db.update(schema.gallery)
      .set({ deletedAt: new Date(), isActive: false })
      .where(eq(schema.gallery.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
