import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * useHouseApproval
 * 
 * Hook to abstract the logic surrounding house joining and approvals.
 * Decouples the UI component from explicit slice actions and centralizes
 * business logic.
 */
export const useHouseApproval = () => {
  const submitApproval = useAppStore((state) => state.approveMember);
  const submitJoinRequest = useAppStore((state) => state.requestJoinHouse);
  const currentHouseId = useAppStore((state) => state.currentHouseId);

  /**
   * Approves a pending member for the current active house.
   * Can be extended to trigger Toast notifications or API calls later.
   */
  const approveMember = useCallback((userIdToApprove: string) => {
    if (!currentHouseId) {
      console.warn('Cannot approve member: No active house selected.');
      return;
    }
    
    submitApproval(currentHouseId, userIdToApprove);
  }, [currentHouseId, submitApproval]);

  /**
   * Requests to join a house using an invite code.
   * Includes raw string validation before calling the store.
   */
  const requestJoin = useCallback((inviteCode: string) => {
    const cleanCode = inviteCode.trim().toUpperCase();
    if (!cleanCode) return 'invalid';

    return submitJoinRequest(cleanCode);
  }, [submitJoinRequest]);

  return {
    approveMember,
    requestJoin,
    currentHouseId,
  };
};
