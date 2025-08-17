/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { attributeSchema } from "@/lib/validations/attribute";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const attribute = await prisma.attribute.findUnique({
      where: { id: params.id },
      include: {
        values: true,
      },
    });

    if (!attribute) {
      return NextResponse.json("Attribute not found", { status: 404 });
    }

    return NextResponse.json(attribute, { status: 200 });
  } catch (error) {
    console.error("Error fetching attribute:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const validatedData = attributeSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(validatedData.error.errors, { status: 400 });
    }

    // Check if attribute exists
    const existingAttribute = await prisma.attribute.findUnique({
      where: { id: params.id },
      include: { values: true },
    });

    if (!existingAttribute) {
      return NextResponse.json("Attribute not found", { status: 404 });
    }

    const { name, values } = validatedData.data;

    // Update attribute and handle values
    const updatedAttribute = await prisma.attribute.update({
      where: { id: params.id },
      data: {
        name: name,
        values: values
          ? {
              // Delete existing values
              deleteMany: {},
              // Create new values
              create: values.map((v) => ({ value: v.value })),
            }
          : undefined,
      },
      include: {
        values: true,
      },
    });

    return NextResponse.json(updatedAttribute, { status: 200 });
  } catch (error: any) {
    console.error("Error updating attribute:", error);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const attribute = await prisma.attribute.delete({
      where: { id: params.id },
    });

    return NextResponse.json(attribute, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting attribute:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
