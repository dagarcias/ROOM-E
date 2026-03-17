import { ShoppingItem } from '../types';

/**
 * Stub Service for Shopping List Persistence (Agent 1)
 * Architecture Goal: Prepare async boundaries for Agent 3 (Backend Integration).
 */

export const ShoppingService = {
  fetchShoppingList: async (houseId: string): Promise<ShoppingItem[]> => {
    // TODO: Implement GET from Supabase/Firebase
    return [];
  },

  saveShoppingItem: async (item: ShoppingItem): Promise<boolean> => {
     // TODO: Implement POST/UPSERT to DB
    return true;
  },

  deleteShoppingItem: async (itemId: string): Promise<boolean> => {
    // TODO: Implement DELETE
    return true;
  }
};
