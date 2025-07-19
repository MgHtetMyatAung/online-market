/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiResponseHandler } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { brandSchema } from "@/lib/validations/brand";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.brand.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Order by creation date, newest first
      },
    });

    // return ApiResponseHandler.success(
    //   products,
    //   "Brands retrieved successfully"
    // );
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch brands:", error); // Log the error for debugging
    return ApiResponseHandler.error(
      "Failed to fetch brands",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = brandSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Brand validation error:", validationResult.error.errors);
      return ApiResponseHandler.error(
        "Invalid brand data",
        400,
        validationResult.error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`) // Join path for better error message
          .join(", ")
      );
    }

    const { slug } = validationResult.data;

    const brandDetail = await prisma.brand.findUnique({ where: { slug } });

    if (brandDetail) {
      // return ApiResponseHandler.error(
      //   "Brand already exist !",
      //   400,
      //   "Brand already exist !"
      // );
      return NextResponse.json(
        { message: "Brand already exist!" },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: body,
    });

    // return ApiResponseHandler.success(brand, "Brand created successfully", 201);
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return ApiResponseHandler.error("Server error", 500, "");
  }
}
