/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { ApiResponseHandler } from "@/lib/api-response";
import { z } from "zod";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Zod schema for validating category creation data
const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  slug: z.string().min(1, "Category slug is required"),
  isActive: z.boolean().default(true).optional(),
  parentId: z.string().optional().nullable(), // Optional for top-level categories
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const parentId = searchParams.get("parentId");

    let whereClause: any = {};

    if (type === "main") {
      whereClause = { parentId: null };
    } else if (type === "sub") {
      whereClause = { parentId: { not: null }, parent: { parentId: null } };
    } else if (type === "last") {
      whereClause = {
        parentId: { not: null },
        parent: { parentId: { not: null } },
      };
    } else if (parentId) {
      whereClause = { parentId: parentId };
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        children: true, // Include subcategories
        parent: {
          include: {
            parent: true, // Include the parent's parent
          },
        }, // Include parent category
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    // return ApiResponseHandler.success(
    //   categories,
    //   "Categories fetched successfully",
    //   200
    // );
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return ApiResponseHandler.error(
      "Failed to fetch categories",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      // return ApiResponseHandler.error(
      //   "Invalid request body",
      //   400,
      //   validation.error.message
      // );
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, description, image, slug, isActive, parentId } =
      validation.data;

    // Check if a category with the same slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: slug },
    });

    if (existingCategory) {
      // return ApiResponseHandler.error(
      //   "Category with this slug already exists",
      //   409
      // );
      return NextResponse.json(
        { message: "Category with this slug already exists" },
        { status: 409 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        image,
        slug,
        isActive,
        parentId,
      },
    });

    // return ApiResponseHandler.success(
    //   newCategory,
    //   "Category created successfully",
    //   201
    // );
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);
    return ApiResponseHandler.error(
      "Failed to create category",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
