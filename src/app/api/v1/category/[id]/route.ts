import { ApiResponseHandler } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for updating a category
const updateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  slug: z.string().optional(),
  isActive: z.boolean().optional(),
  parentId: z.string().nullable().optional(),
});

// GET function to fetch a single category by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: {
        id: id,
      },
      include: {
        children: true, // Include subcategories
        parent: true, // Include parent category
      },
    });

    if (!category) {
      return ApiResponseHandler.error("Category not found", 404);
    }

    return ApiResponseHandler.success(
      category,
      "Category fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    return ApiResponseHandler.error(
      "Failed to fetch category",
      500,
      "Internal server error"
    );
  }
}

// PUT function to update a category by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return ApiResponseHandler.error(
        "Invalid request body",
        400,
        validation.error.message
      );
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: id,
      },
      data: validation.data,
    });

    return ApiResponseHandler.success(
      updatedCategory,
      "Category updated successfully",
      200
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return ApiResponseHandler.error(
      "Failed to update category",
      500,
      "Internal server error"
    );
  }
}

// DELETE function to delete a category by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedCategory = await prisma.category.delete({
      where: {
        id: id,
      },
    });

    return ApiResponseHandler.success(
      deletedCategory,
      "Category deleted successfully",
      200
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return ApiResponseHandler.error(
      "Failed to delete category",
      500,
      "Internal server error"
    );
  }
}
