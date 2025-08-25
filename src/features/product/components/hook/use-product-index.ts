import { create } from "zustand";

type Store = {
  selectedIndex: string[];
  setSelectedIndex: (data: string[]) => void;
};

export const useProductIndexStore = create<Store>()((set) => ({
  selectedIndex: [],
  setSelectedIndex: (data: string[]) => set(() => ({ selectedIndex: data })),
}));

type variantStore = {
  selectedVariantIds: string[];
  setSelectedVariantIds: (data: string[]) => void;
};

export const useVariantStore = create<variantStore>()((set) => ({
  selectedVariantIds: [],
  setSelectedVariantIds: (data: string[]) =>
    set(() => ({ selectedVariantIds: data })),
}));
