/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponseHandler } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product"; // Ensure this Zod schema is updated
import { NextRequest, NextResponse } from "next/server"; // Import UserRole enum

// GET all products (for admin view, including relations)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");
    const categoryId = searchParams.get("categoryId");
    const promotionId = searchParams.get("promotionId");

    const where: any = {};

    if (brandId) {
      where.brandId = brandId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (promotionId) {
      where.promotionId = promotionId;
    }

    const products = await prisma.product.findMany({
      where, // Add the dynamic where clause here
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        promotion: {
          // Include the linked promotion details
          select: {
            id: true,
            name: true,
            type: true,
            value: true,
            startDate: true,
            endDate: true,
            isActive: true,
            couponCode: true,
          },
        },
        variants: true, // Include product variants
      },
      orderBy: {
        createdAt: "desc", // Order by creation date, newest first
      },
    });

    // return ApiResponseHandler.success(
    //   products,
    //   "Products retrieved successfully"
    // );
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch products:", error); // Log the error for debugging
    return ApiResponseHandler.error(
      "Failed to fetch products",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

// POST a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    // Ensure productSchema in lib/validations/product.ts includes:
    // slug, name, description, price, stock, categoryId, brandId, imageUrls, isFeatured, isActive, promotionId
    const validationResult = productSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Product validation error:", validationResult.error.errors);
      return ApiResponseHandler.error(
        "Invalid product data",
        400,
        validationResult.error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`) // Join path for better error message
          .join(", ")
      );
    }

    const {
      name,
      slug, // New field
      description,
      price,
      stock,
      categoryId,
      brandId, // New field
      imageUrls, // New field
      isFeatured, // New field
      isActive, // New field
      promotionId, // New field
      variants, // Assuming variants can be created with the product
    } = validationResult.data;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        imageUrls,
        isFeatured: isFeatured ?? false, // Default to false if not provided
        isActive: isActive ?? true, // Default to true if not provided
        category: {
          connect: {
            id: categoryId,
          },
        },
        // Conditionally connect brand if brandId is provided
        ...(brandId && {
          brand: {
            connect: {
              id: brandId,
            },
          },
        }),
        // Conditionally connect promotion if promotionId is provided
        ...(promotionId && {
          promotion: {
            connect: {
              id: promotionId,
            },
          },
        }),
        // Create nested variants if provided
        ...(variants &&
          variants.length > 0 && {
            variants: {
              createMany: {
                data: variants.map((v) => ({
                  name: v.name,
                  value: v.value,
                  variantStock: v.variantStock, // Ensure variantStock is handled
                })),
              },
            },
          }),
      },
      include: {
        // Include created relations in the response
        category: true,
        brand: true,
        promotion: true,
        variants: true,
      },
    });

    return ApiResponseHandler.success(
      product,
      "Product created successfully",
      201
    );
  } catch (error: any) {
    console.error("Failed to create product:", error); // Log the error for debugging
    let errorMessage = "Failed to create product";
    let statusCode = 400; // Default to 400 for validation/input issues

    if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
      errorMessage = "Product slug must be unique.";
      statusCode = 409; // Conflict
    } else if (error.code === "P2025") {
      // Foreign key constraint failed (e.g., categoryId not found)
      errorMessage = "Associated category, brand, or promotion not found.";
      statusCode = 404; // Not Found
    } else if (error instanceof Error) {
      errorMessage = error.message;
      statusCode = 500; // Internal server error for unexpected errors
    }

    return ApiResponseHandler.error(
      errorMessage,
      statusCode,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

// Add the authorizeMiddleware to both GET and POST
// This route should be located at `app/api/admin/products/route.ts` as per your structure
