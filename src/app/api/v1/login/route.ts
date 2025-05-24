// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateToken } from "../../../../lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiResponseHandler } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return ApiResponseHandler.error(
        "Email and password are required for login.",
        400,
        "Validation Error"
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return ApiResponseHandler.error("User not found.", 404, "User Not Found");
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return ApiResponseHandler.error(
        "Invalid credentials.",
        401,
        "Invalid Credentials"
      );
    }

    // Generate JWT
    const token = generateToken({ id: user.id.toString(), email: user.email });

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    // Set HttpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
      sameSite: "lax", // Or 'strict' for stronger protection against CSRF
    });

    return ApiResponseHandler.success({ token }, "Login successful", 200);
  } catch (error) {
    console.error("Login error:", error);
    return ApiResponseHandler.error(
      "Internal Server Error",
      500,
      "Internal Server Error"
    );
  }
}
