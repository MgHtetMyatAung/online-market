/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promotionSchema } from "@/lib/validations/promotion";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const isActive = searchParams.get("isActive");
    const couponCode = searchParams.get("couponCode");

    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: isActive ? isActive === "true" : undefined,
        couponCode: couponCode || undefined,
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            basePrice: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(promotions, { status: 200 });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = promotionSchema.parse(body);

    const promotion = await prisma.promotion.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        type: validatedData.type,
        value: validatedData.value,
        minOrderAmount: validatedData.minOrderAmount,
        minQuantity: validatedData.minQuantity,
        maxQuantity: validatedData.maxQuantity,
        imageUrl: validatedData.imageUrl,
        couponCode: validatedData.couponCode
          ? validatedData.couponCode
          : undefined,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error: any) {
    console.error("Error creating promotion:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
