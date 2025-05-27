import { ApiResponse } from "@/lib/api-response";
import { Category } from "@prisma/client";

interface GetCategoriesParams {
  type?: "main" | "sub" | "last";
  parentId?: string;
}

interface CreateCategoryPayload {
  name: string;
  description?: string;
  image?: string;
  slug: string;
  isActive?: boolean;
  parentId?: string | null;
}

interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  image?: string;
  slug?: string;
  isActive?: boolean;
  parentId?: string | null;
}

const API_URL = "/api/v1/category";

export const categoryService = {
  async getCategories(
    params?: GetCategoriesParams
  ): Promise<ApiResponse<Category[]>> {
    const url = new URL(API_URL, window.location.origin);
    if (params?.type) {
      url.searchParams.append("type", params.type);
    }
    if (params?.parentId) {
      url.searchParams.append("parentId", params.parentId);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch categories");
    }
    return response.json(); // Return the full ApiResponse
  },

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to fetch category with ID ${id}`
      );
    }
    return response.json(); // Return the full ApiResponse
  },

  async createCategory(
    payload: CreateCategoryPayload
  ): Promise<ApiResponse<Category>> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create category");
    }
    return response.json(); // Return the full ApiResponse
  },

  async updateCategory(
    id: string,
    payload: UpdateCategoryPayload
  ): Promise<ApiResponse<Category>> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to update category with ID ${id}`
      );
    }
    return response.json(); // Return the full ApiResponse
  },

  async deleteCategory(id: string): Promise<ApiResponse<Category>> {
    // Assuming delete returns the deleted category
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to delete category with ID ${id}`
      );
    }
    return response.json(); // Return the full ApiResponse
  },
};
