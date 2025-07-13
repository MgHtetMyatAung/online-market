import api from "@/services/api";
import { GetCategoriesParams, typeOfCategory } from "../type";

const API_BASE_PATH = "/category";

interface CategoryPayload {
  name: string;
  description?: string;
  image?: string;
  slug: string;
  isActive?: boolean;
  parentId?: string | null;
}

export const categoryApi = {
  getAllCategorys: async (
    params?: GetCategoriesParams
  ): Promise<typeOfCategory[]> => {
    const response = await api.get<typeOfCategory[]>(API_BASE_PATH, { params });
    return response.data;
  },
  getCategoryById: async (id: string): Promise<typeOfCategory> => {
    const response = await api.get<typeOfCategory>(`${API_BASE_PATH}/${id}`);
    return response.data;
  },
  createCategory: async (
    categoryData: CategoryPayload
  ): Promise<typeOfCategory> => {
    const response = await api.post<typeOfCategory>(
      API_BASE_PATH,
      categoryData
    );
    return response.data;
  },
  updateCategory: async (
    id: string,
    categoryData: CategoryPayload
  ): Promise<typeOfCategory> => {
    const response = await api.put<typeOfCategory>(
      `${API_BASE_PATH}/${id}`,
      categoryData
    );
    return response.data;
  },
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE_PATH}/${id}`);
  },
};
