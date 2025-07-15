import { ApiResponseHandler } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { brandSchema } from "@/lib/validations/brand";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      return ApiResponseHandler.error(
        "Brand not found",
        404,
        "Brand with the specified ID does not exist"
      );
    }

    // return ApiResponseHandler.success(brand, "Brand retrieved successfully");
    return NextResponse.json(brand, { status: 200 });
  } catch (error) {
    return ApiResponseHandler.error(
      "Failed to fetch brand",
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

    const brand = await prisma.brand.update({
      where: { id },
      data: body,
    });

    return ApiResponseHandler.success(brand, "Brand updated successfully");
  } catch (error) {
    return ApiResponseHandler.error(
      "Failed to update brand",
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
    await prisma.brand.delete({
      where: { id },
    });

    return ApiResponseHandler.success({}, "Brand deleted successfully", 200);
  } catch (error) {
    return ApiResponseHandler.error(
      "Failed to delete brand",
      400,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
