import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { syncQueue } from '../utils/syncQueue';

/**
 * useShoppingRealtime
 *
 * Optimistic UI wrapper over the new section-based shopping actions.
 * All mutations are applied immediately to the local Zustand store
 * and queued for backend sync via syncQueue.
 */
export const useShoppingRealtime = () => {
  const shoppingSections = useAppStore(state => state.shoppingSections);
  const currentHouseId  = useAppStore(state => state.currentHouseId);
  const user            = useAppStore(state => state.user);

  // Base mutators from the new slice
  const storeAddSection    = useAppStore(state => state.addSection);
  const storeRemoveSection = useAppStore(state => state.removeSection);
  const storeAddItem       = useAppStore(state => state.addItemToSection);
  const storeToggleItem    = useAppStore(state => state.toggleItemInSection);
  const storeRemoveItem    = useAppStore(state => state.removeItemFromSection);
  const storeConvert       = useAppStore(state => state.convertSectionToExpense);

  const [syncCount, setSyncCount] = useState(0);

  useEffect(() => {
    const unsubscribe = syncQueue.subscribe(count => setSyncCount(count));
    return unsubscribe;
  }, []);

  // ---------------------------------------------------------------------------
  // Optimistic wrappers
  // ---------------------------------------------------------------------------
  const addSection = useCallback((name: string, emoji: string) => {
    if (!currentHouseId || !user) return;
    storeAddSection(currentHouseId, user.id, name, emoji);
    syncQueue.enqueue('ADD_SHOPPING_ITEM', { type: 'ADD_SECTION', name, emoji, houseId: currentHouseId });
  }, [currentHouseId, user, storeAddSection]);

  const removeSection = useCallback((sectionId: string) => {
    storeRemoveSection(sectionId);
    syncQueue.enqueue('REMOVE_SHOPPING_ITEM', { type: 'REMOVE_SECTION', sectionId });
  }, [storeRemoveSection]);

  const addItemToSection = useCallback((sectionId: string, name: string, estimatedPrice?: number) => {
    if (!user) return;
    storeAddItem(sectionId, user.id, name, estimatedPrice);
    syncQueue.enqueue('ADD_SHOPPING_ITEM', { sectionId, name, estimatedPrice, addedBy: user.id });
  }, [user, storeAddItem]);

  const toggleItemInSection = useCallback((sectionId: string, itemId: string) => {
    if (!user) return;
    storeToggleItem(sectionId, itemId, user.id);
    syncQueue.enqueue('TOGGLE_SHOPPING_ITEM', { sectionId, itemId, userId: user.id });
  }, [user, storeToggleItem]);

  const removeItemFromSection = useCallback((sectionId: string, itemId: string) => {
    storeRemoveItem(sectionId, itemId);
    syncQueue.enqueue('REMOVE_SHOPPING_ITEM', { sectionId, itemId });
  }, [storeRemoveItem]);

  const convertSectionToExpense = useCallback(
    (sectionId: string, participantIds: string[], overrideAmount?: number) => {
      if (!user) return;
      storeConvert(sectionId, user.id, participantIds, overrideAmount);
      syncQueue.enqueue('CONVERT_TO_EXPENSE', { sectionId, payerId: user.id, participantIds, overrideAmount });
    },
    [user, storeConvert],
  );

  const toggleNetwork = useCallback(() => {
    syncQueue.setOnlineStatus(!syncQueue.getOnlineStatus());
  }, []);

  return {
    shoppingSections,
    addSection,
    removeSection,
    addItemToSection,
    toggleItemInSection,
    removeItemFromSection,
    convertSectionToExpense,
    syncCount,
    isOnline: syncQueue.getOnlineStatus(),
    toggleNetwork,
  };
};
