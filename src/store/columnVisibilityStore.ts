import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { VisibilityState } from "@tanstack/react-table";

// Define the shape of your store state
interface ColumnVisibilityState {
  // A map where the key is the tableId and the value is the VisibilityState for that table
  tableColumnVisibility: Record<string, VisibilityState>;
  setColumnVisibility: (tableId: string, visibility: VisibilityState) => void;
  // Optional: A way to reset visibility for a specific table
  resetColumnVisibility: (tableId: string) => void;
}

export const useColumnVisibilityStore = create<ColumnVisibilityState>()(
  persist(
    (set) => ({
      tableColumnVisibility: {}, // Initial empty state
      setColumnVisibility: (tableId, visibility) =>
        set((state) => ({
          tableColumnVisibility: {
            ...state.tableColumnVisibility,
            [tableId]: visibility,
          },
        })),
      resetColumnVisibility: (tableId) =>
        set((state) => {
          const newVisibility = { ...state.tableColumnVisibility };
          delete newVisibility[tableId];
          return { tableColumnVisibility: newVisibility };
        }),
    }),
    {
      name: "table-column-visibility-storage", // unique name for localStorage item
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      // You can also add `partialize` to only persist certain parts of the state if needed.
    }
  )
);
