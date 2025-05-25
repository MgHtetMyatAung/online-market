import { Category } from "@prisma/client";

interface GetCategoriesParams {
  type?: "main" | "sub";
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
  /**
   * Fetches categories with optional filtering by type or parent ID.
   * @param params - Optional parameters for filtering.
   * @returns A promise that resolves with the list of categories.
   */
  async getCategories(params?: GetCategoriesParams): Promise<Category[]> {
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
    const data = await response.json();
    return data.data;
  },

  /**
   * Fetches a single category by its ID.
   * @param id - The ID of the category to fetch.
   * @returns A promise that resolves with the category data.
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to fetch category with ID ${id}`
      );
    }
    const data = await response.json();
    return data.data;
  },

  /**
   * Creates a new category.
   * @param payload - The data for the new category.
   * @returns A promise that resolves with the created category data.
   */
  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
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
    const data = await response.json();
    return data.data;
  },

  /**
   * Updates an existing category by its ID.
   * @param id - The ID of the category to update.
   * @param payload - The data to update the category with.
   * @returns A promise that resolves with the updated category data.
   */
  async updateCategory(
    id: string,
    payload: UpdateCategoryPayload
  ): Promise<Category> {
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
    const data = await response.json();
    return data.data;
  },

  /**
   * Deletes a category by its ID.
   * @param id - The ID of the category to delete.
   * @returns A promise that resolves with the deleted category data.
   */
  async deleteCategory(id: string): Promise<Category> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to delete category with ID ${id}`
      );
    }
    const data = await response.json();
    return data.data;
  },
};
