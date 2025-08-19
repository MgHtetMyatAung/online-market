/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { attributeSchema } from "@/lib/validations/attribute";

export async function GET(req: NextRequest) {
  try {
    const attributes = await prisma.attribute.findMany({
      include: {
        values: true,
        _count: {
          select: {
            values: true,
          },
        },
      },
      orderBy: {
        name: "desc",
      },
    });

    return NextResponse.json(attributes, { status: 200 });
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = attributeSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(validatedData.error.errors, { status: 400 });
    }

    const { name, values } = validatedData.data;

    const attribute = await prisma.attribute.create({
      data: {
        name: name,
        values: values
          ? {
              create: values.map((v) => ({ value: v.value })),
            }
          : undefined,
      },
      include: {
        values: true,
      },
    });

    return NextResponse.json(attribute, { status: 201 });
  } catch (error: any) {
    console.error("Error creating attribute:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Attribute with this name already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
