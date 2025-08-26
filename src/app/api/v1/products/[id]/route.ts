/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiResponseHandler } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { productSchema, productUpdateSchema } from "@/lib/validations/product";
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: productId } = await params;
  try {
    const body = await request.json();

    // Validate the incoming data
    const validationResult = productSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Product validation error:", validationResult.error.errors);
      return NextResponse.json(
        {
          message: validationResult.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", "),
        },
        { status: 400 },
      );
    }

    const {
      name,
      slug,
      description,
      basePrice,
      stock,
      categoryId,
      brandId,
      imageUrls,
      isFeatured,
      isActive,
      promotionId,
      variants,
      howToUse,
      youtubeVideo,
      specification,
      isDeleted,
      // You should not be receiving `selectedAttributes` from the API.
      // That's a frontend concern. We'll ignore it here.
    } = validationResult.data;

    // Start a Prisma transaction to ensure atomicity
    const transaction = await prisma.$transaction(async (tx) => {
      // 1. Delete existing variants and their attributes
      // This is the most important part for handling the edit.
      // We first find all variant IDs for the product
      const existingVariants = await tx.productVariant.findMany({
        where: { productId },
        select: { id: true },
      });

      // Now delete the associated variant attributes
      await tx.variantAttributeValue.deleteMany({
        where: {
          variantId: {
            in: existingVariants.map((v) => v.id),
          },
        },
      });

      // Then delete the variants themselves
      await tx.productVariant.deleteMany({
        where: { productId },
      });

      // 2. Update the main product data
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          name,
          slug,
          description,
          basePrice,
          stock,
          imageUrls,
          howToUse,
          youtubeVideo,
          specification,
          isFeatured: isFeatured ?? false,
          isActive: isActive ?? true,
          isDeleted: isDeleted ?? false,
          category: {
            connect: { id: categoryId },
          },
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
          // Create the new variants
          // The `create` operation will handle the nested `create` for attributes.
          variants: {
            create: variants?.map((variant) => ({
              price: variant.price,
              stock: variant.stock,
              sku: variant.sku,
              attributes: {
                create: variant.attributes.map((attr) => ({
                  attributeValue: {
                    connect: { id: attr.attributeValueId },
                  },
                })),
              },
            })),
          },
        },
        include: {
          category: true,
          brand: true,
          promotion: true,
          variants: {
            include: {
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

      return updatedProduct;
    });

    return NextResponse.json(transaction, { status: 200 });
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
    } else if (error instanceof Error) {
      errorMessage = error.message;
      statusCode = 500;
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
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
