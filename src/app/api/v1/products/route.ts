import { ApiResponseHandler } from "@/libs/api-response";
import { prisma } from "@/libs/prisma";
import { productSchema } from "@/libs/validations/product";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return ApiResponseHandler.success(
      products,
      "Products retrieved successfully"
    );
  } catch (error) {
    return ApiResponseHandler.error(
      "Failed to fetch products",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = productSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponseHandler.error(
        "Invalid product data",
        400,
        validationResult.error.errors
          .map((e) => `${e.path}: ${e.message}`)
          .join(", ")
      );
    }

    const product = await prisma.product.create({
      data: {
        name: validationResult.data.name,
        description: validationResult.data.description,
        price: validationResult.data.price,
        stock: validationResult.data.stock,
        category: {
          connect: {
            id: validationResult.data.categoryId,
          },
        },
      },
    });

    return ApiResponseHandler.success(
      product,
      "Product created successfully",
      201
    );
  } catch (error) {
    return ApiResponseHandler.error(
      "Failed to create product",
      400,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
