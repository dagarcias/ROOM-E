import { useAppStore } from '../store/useAppStore';

/**
 * Custom hook to abstract authentication logic away from direct store access.
 * Prepares the architecture for the upcoming Firebase integration.
 */
export const useAuth = () => {
  const { 
    isAuthenticated, 
    user, 
    login, 
    logout, 
    completeProfile 
  } = useAppStore();

  return {
    isAuthenticated,
    user,
    login,
    logout,
    completeProfile,
    // Future: add loginWithApple, loginWithEmail, etc.
  };
};
