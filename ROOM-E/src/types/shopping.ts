export interface ShoppingItem {
  id: string;
  name: string;
  estimatedPrice?: number;
  isPurchased: boolean;
  purchasedBy?: string; // User ID who bought it
  addedBy: string; // User ID who requested it
  createdAt: string;
}

export interface ShoppingSection {
  id: string;
  name: string;
  emoji: string; // e.g. "🛒", "🧹", "💊"
  houseId: string;
  createdBy: string;
  createdAt: string;
  items: ShoppingItem[];
}

