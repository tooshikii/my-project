"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { LearningItem } from "@/lib/db/indexdb";
import {
  saveLearningItem as saveLearningItemDB,
  getLearningItems as getLearningItemsDB,
} from "@/lib/db/data-service";

interface LearningItemsState {
  // Data
  items: LearningItem[];

  // Status flags
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  addItem: (
    item: Omit<LearningItem, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;

  // Computed stats
  getCompletedCount: () => number;
  getIncompleteCount: () => number;
  getItemsByType: (type: LearningItem["type"]) => LearningItem[];
}

export const useLearningItemsStore = create<LearningItemsState>()(
  immer((set, get) => ({
    // Initial state
    items: [],
    isLoading: false,
    error: null,

    // Fetch items from DB
    fetchItems: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const items = await getLearningItemsDB();
        set((state) => {
          state.items = items;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          state.isLoading = false;
        });
      }
    },

    // Add a new item
    addItem: async (itemData) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const newItem = await saveLearningItemDB(itemData);
        set((state) => {
          state.items.push(newItem);
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          state.isLoading = false;
        });
      }
    },

    // Toggle completion status
    toggleComplete: async (id) => {
      const { items } = get();
      const itemIndex = items.findIndex((item) => item.id === id);

      if (itemIndex === -1) {
        set((state) => {
          state.error = "Item not found";
        });
        return;
      }

      const item = items[itemIndex];
      const updatedItem: LearningItem = {
        ...item,
        completed: !item.completed,
        dateCompleted: !item.completed ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      };

      try {
        // For now, we'll just update in memory
        // In a real implementation, we would save to DB
        // await updateLearningItemDB(updatedItem)

        set((state) => {
          state.items[itemIndex] = updatedItem;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
        });
      }
    },

    // Get count of completed items
    getCompletedCount: () => {
      const { items } = get();
      return items.filter((item) => item.completed).length;
    },

    // Get count of incomplete items
    getIncompleteCount: () => {
      const { items } = get();
      return items.filter((item) => !item.completed).length;
    },

    // Get items by type
    getItemsByType: (type) => {
      const { items } = get();
      return items.filter((item) => item.type === type);
    },
  })),
);
