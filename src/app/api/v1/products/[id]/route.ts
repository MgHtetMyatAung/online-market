/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiResponseHandler } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { productUpdateSchema } from "@/lib/validations/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        promotion: true,
        variants: {
          select: {
            id: true,
            sku: true,
            price: true,
            stock: true,
            attributes: {
              include: {
                attributeValue: {
                  include: {
                    attribute: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json("Product not found", { status: 404 });
    }

    const productWithVariants = {
      ...product,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        price: variant.price.toNumber(), // Convert Decimal to a number
        stock: variant.stock,
        attributes: variant.attributes.map((attr) => ({
          attributeId: attr.attributeValue.attribute.id,
          attributeValueId: attr.attributeValue.id,
          value: attr.attributeValue.value,
        })),
      })),
    };

    return NextResponse.json(productWithVariants, { status: 200 });
  } catch (error) {
    return NextResponse.json("Failed to fetch product", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = productUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponseHandler.error(
        "Invalid product data",
        400,
        validationResult.error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", "),
      );
    }

    const {
      name,
      slug,
      description,
      basePrice,
      categoryId,
      brandId,
      imageUrls,
      isFeatured,
      isActive,
      isDeleted,
      promotionId,
      howToUse,
      youtubeVideo,
      specification,
      variants,
    } = validationResult.data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        basePrice,
        imageUrls,
        howToUse,
        youtubeVideo,
        specification,
        isFeatured,
        isActive,
        isDeleted,
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
        ...(brandId && {
          brand: {
            connect: { id: brandId },
          },
        }),
        ...(promotionId && {
          promotion: {
            connect: { id: promotionId },
          },
        }),
        ...(variants &&
          variants.length > 0 && {
            variants: {
              deleteMany: {}, // Remove existing variants
              createMany: {
                data: variants.map((v) => ({
                  sku: v.sku,
                  price: v.price,
                  stock: v.stock,
                  attributes: v.attributes,
                  // isActive: v.isActive ?? true,
                  // isDeleted: v.isDeleted ?? false
                })),
              },
            },
          }),
      },
      include: {
        category: true,
        brand: true,
        promotion: true,
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    let errorMessage = "Failed to update product";
    let statusCode = 400;

    if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
      errorMessage = "Product slug must be unique.";
      statusCode = 409;
    } else if (error.code === "P2025") {
      errorMessage = "Associated category, brand, or promotion not found.";
      statusCode = 404;
    }

    return ApiResponseHandler.error(
      errorMessage,
      statusCode,
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json("Product deleted successfully", { status: 200 });
  } catch (error) {
    return ApiResponseHandler.error(
      "Failed to delete product",
      400,
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}
