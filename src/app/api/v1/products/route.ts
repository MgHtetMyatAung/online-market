/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponseHandler } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product"; // Ensure this Zod schema is updated
import { NextRequest, NextResponse } from "next/server"; // Import UserRole enum

// GET all products (for admin view, including relations)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const brandId = searchParams.get("brandId");
    const promotionId = searchParams.get("promotionId");
    const collectionId = searchParams.get("collectionId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const isFeatured = searchParams.get("isFeatured");

    const where: any = {
      // isDeleted: false, // Exclude deleted products
      // isActive: true, // Only include active products
    };

    if (isFeatured === "true") {
      where.isFeatured = Boolean(isFeatured);
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (promotionId) {
      where.promotionId = promotionId;
    }

    if (collectionId) {
      where.collections = {
        some: {
          collectionId,
        },
      };
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) {
        where.basePrice.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.basePrice.lte = parseFloat(maxPrice);
      }
    }

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { specification: { contains: search, mode: "insensitive" } },
      ];
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
      orderBy: {
        createdAt: "desc", // Order by creation date, newest first
      },
    });

    const productsWithStock = products.map((product) => ({
      ...product,
      inStock: product.variants.some((v) => v.stock > 0),
      totalStock:
        product.variants.reduce((sum, v) => sum + v.stock, 0) + product.stock,
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
    }));

    // return ApiResponseHandler.success(
    //   products,
    //   "Products retrieved successfully"
    // );
    return NextResponse.json(productsWithStock, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch products:", error); // Log the error for debugging
    return ApiResponseHandler.error(
      "Failed to fetch products",
      500,
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

// POST a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = productSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Product validation error:", validationResult.error.errors);
      return NextResponse.json(
        validationResult.error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", "),
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
    } = validationResult.data;

    const product = await prisma.product.create({
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
        ...(variants &&
          variants.length > 0 && {
            variants: {
              create: variants.map((variant: any) => ({
                price: variant.price,
                stock: variant.stock,
                sku: variant.sku,
                attributes: {
                  create: variant.attributes.map((attr: any) => ({
                    attributeValue: {
                      connect: { id: attr.attributeValueId },
                    },
                  })),
                },
              })),
            },
          }),
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

    // if(variants && variants?.length>0){

    //   await Promise.all(
    //     product.variants.map((newVariant, index) => {
    //       // Find the original variant data by its index
    //       const originalVariant = variants[index];

    //       if (originalVariant.attributes && originalVariant.attributes.length > 0) {
    //         return prisma.variantAttributeValue.update({
    //           where: { id: newVariant.id },
    //           data: {
    //             attributes: {
    //               createMany: {
    //                 data: originalVariant.attributes.map((attr) => ({
    //                   attributeId: attr.attributeId,
    //                   value: attr.value,
    //                 })),
    //               },
    //             },
    //           },
    //         });
    //       }
    //       return Promise.resolve();
    //     })
    //   );
    // }

    return NextResponse.json(product, { status: 201 }); // 201 Created for resource creation, not 200 O
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
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

// Add the authorizeMiddleware to both GET and POST
// This route should be located at `app/api/admin/products/route.ts` as per your structure
