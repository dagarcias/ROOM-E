import { StateCreator } from 'zustand';
import { ShoppingSection, Expense } from '../../types';
import { StoreState } from '../types';

const uid = () => Math.random().toString(36).substr(2, 9);
const now = () => new Date().toISOString();

export interface ShoppingSlice {
  shoppingSections: ShoppingSection[];

  // Section-level actions
  addSection: (houseId: string, createdBy: string, name: string, emoji: string) => void;
  removeSection: (sectionId: string) => void;

  // Item-level actions (scoped to a section)
  addItemToSection: (sectionId: string, addedBy: string, name: string, estimatedPrice?: number) => void;
  toggleItemInSection: (sectionId: string, itemId: string, userId: string) => void;
  removeItemFromSection: (sectionId: string, itemId: string) => void;

  // Convert purchased items of a section into a shared Expense
  convertSectionToExpense: (sectionId: string, payerId: string, participantIds: string[], overrideAmount?: number) => void;
}

export const createShoppingSlice: StateCreator<
  StoreState,
  [],
  [],
  ShoppingSlice
> = (set, get) => ({
  shoppingSections: [],

  // ---------------------------------------------------------------------------
  // Section actions
  // ---------------------------------------------------------------------------
  addSection: (houseId, createdBy, name, emoji) => set((state) => ({
    shoppingSections: [
      ...state.shoppingSections,
      {
        id: uid(),
        name,
        emoji,
        houseId,
        createdBy,
        createdAt: now(),
        items: [],
      },
    ],
  })),

  removeSection: (sectionId) => set((state) => ({
    shoppingSections: state.shoppingSections.filter(s => s.id !== sectionId),
  })),

  // ---------------------------------------------------------------------------
  // Item actions
  // ---------------------------------------------------------------------------
  addItemToSection: (sectionId, addedBy, name, estimatedPrice) => set((state) => ({
    shoppingSections: state.shoppingSections.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        items: [
          {
            id: uid(),
            name,
            estimatedPrice,
            isPurchased: false,
            addedBy,
            createdAt: now(),
          },
          ...section.items,
        ],
      };
    }),
  })),

  toggleItemInSection: (sectionId, itemId, userId) => set((state) => ({
    shoppingSections: state.shoppingSections.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        items: section.items.map(item => {
          if (item.id !== itemId) return item;
          const nowPurchased = !item.isPurchased;
          return {
            ...item,
            isPurchased: nowPurchased,
            purchasedBy: nowPurchased ? userId : undefined,
          };
        }),
      };
    }),
  })),

  removeItemFromSection: (sectionId, itemId) => set((state) => ({
    shoppingSections: state.shoppingSections.map(section => {
      if (section.id !== sectionId) return section;
      return { ...section, items: section.items.filter(i => i.id !== itemId) };
    }),
  })),

  // ---------------------------------------------------------------------------
  // Convert purchased items → Expense
  // ---------------------------------------------------------------------------
  convertSectionToExpense: (sectionId, payerId, participantIds, overrideAmount) => set((state) => {
    const section = state.shoppingSections.find(s => s.id === sectionId);
    if (!section) return state;

    const purchasedItems = section.items.filter(i => i.isPurchased);
    if (purchasedItems.length === 0) return state;

    const totalAmount = overrideAmount != null
      ? overrideAmount
      : purchasedItems.reduce((sum, item) => sum + (item.estimatedPrice ?? 0), 0);

    const title =
      purchasedItems.length === 1
        ? `Compra: ${purchasedItems[0].name}`
        : `${section.emoji} ${section.name} (${purchasedItems.length} items)`;

    const newExpense: Expense = {
      id: uid(),
      title,
      amount: totalAmount,
      payerId,
      participantIds,
      date: now(),
    };

    // Remove converted items from the section, keep unpurchased ones
    const updatedSections = state.shoppingSections.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, items: s.items.filter(i => !i.isPurchased) };
    });

    return {
      shoppingSections: updatedSections,
      expenses: [newExpense, ...state.expenses],
    };
  }),
});
