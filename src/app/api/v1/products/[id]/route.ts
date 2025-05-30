import { ApiResponseHandler } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return ApiResponseHandler.error(
        "Product not found",
        404,
        "Product with the specified ID does not exist"
      );
    }

    return ApiResponseHandler.success(
      product,
      "Product retrieved successfully"
    );
  } catch (error) {
    return ApiResponseHandler.error(
      "Failed to fetch product",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data: body,
    });

    return ApiResponseHandler.success(product, "Product updated successfully");
  } catch (error) {
    return ApiResponseHandler.error(
      "Failed to update product",
      400,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.product.delete({
      where: { id },
    });

    return ApiResponseHandler.success(
      null,
      "Product deleted successfully",
      204
    );
  } catch (error) {
    return ApiResponseHandler.error(
      "Failed to delete product",
      400,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
