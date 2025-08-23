/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const variants = await prisma.attributeValue.findMany();
    return NextResponse.json(variants, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
