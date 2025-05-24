/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import bcrypt from "bcrypt"; // Ensure you have bcryptjs installed
import { prisma } from "@/lib/prisma";
import { ApiResponseHandler } from "@/lib/api-response";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    // Basic validation for email/password registration
    if (!email || !password || !name) {
      return ApiResponseHandler.error(
        "Email, password, and name are required for registration.",
        400,
        "Validation Error"
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return ApiResponseHandler.error(
        "User with this email already exists.",
        400,
        "Validation Error"
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // Create new user in the database with default role USER
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.USER, // Assign the default USER role
      },
    });

    // Don't send the password back
    const { password: _, ...userWithoutPassword } = newUser;

    return ApiResponseHandler.success(
      userWithoutPassword,
      "User registered successfully",
      201
    );
  } catch (error) {
    console.error("Registration error:", error);
    return ApiResponseHandler.error(
      "An error occurred during registration.",
      500,
      "Internal Server Error"
    );
  }
}
