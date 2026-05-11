import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { comparePassword, signToken, hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Special check for initial admin setup (Demo purposes)
    if (email === "admin" && password === "admin123") {
      let admin = await db.query.users.findFirst({
        where: and(
          eq(schema.users.role, "admin"),
          eq(schema.users.email, "admin@kishoritravels.com")
        )
      });

      if (!admin) {
        const hashedPassword = await hashPassword("admin123");
        const [newAdmin] = await db.insert(schema.users).values({
          name: "Admin",
          email: "admin@kishoritravels.com",
          passwordHash: hashedPassword,
          role: "admin"
        }).returning();
        admin = newAdmin;
      }

      const token = await signToken({
        id: admin.id,
        email: admin.email,
        role: admin.role,
        name: admin.name
      });

      const response = NextResponse.json({
        success: true,
        user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
      });

      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return response;
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });

    if (!user || !user.isActive || user.deletedAt) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // More secure for auth tokens
      path: "/",
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
