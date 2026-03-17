import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';
import { useNotifications } from '../hooks/useNotifications';

// Navigators
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainNavigator } from './MainNavigator';

/**
 * Deep Linking configuration for `roome://` custom URL scheme.
 *
 * Supported routes:
 *   roome://home      → Home tab
 *   roome://tasks     → Tasks tab
 *   roome://expenses  → Expenses tab
 *   roome://chat      → Chat tab
 *   roome://polls     → Polls tab
 *   roome://shopping  → Shopping tab
 *
 * When a push notification is tapped, the `useNotifications` hook
 * calls `navigation.navigate('MainTabs', { screen: <Tab> })` directly.
 * This linking config handles the URL scheme case (e.g., opened from browser).
 */
const linking: LinkingOptions<any> = {
  prefixes: ['roome://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Home: 'home',
          Tasks: 'tasks',
          Expenses: 'expenses',
          Chat: 'chat',
          Polls: 'polls',
          Shopping: 'shopping',
        },
      },
    },
  },
};

const AppContent = () => {
  const { isAuthenticated, user, currentHouseId, houses } = useAppStore();

  // Mount notification infrastructure inside NavigationContainer
  // so the hook can call useNavigation safely.
  useNotifications();

  const currentHouse = houses.find(h => h.id === currentHouseId);
  const currentUserMember = currentHouse?.members.find(m => m.userId === user?.id);
  const isPending = currentUserMember?.status === 'pending';

  if (!isAuthenticated) return <AuthNavigator />;
  if (!user?.name || !currentHouseId || isPending) return <OnboardingNavigator />;
  return <MainNavigator />;
};

export const AppNavigator = () => (
  <NavigationContainer linking={linking}>
    <AppContent />
  </NavigationContainer>
);
