import { useEffect, useRef, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import {
  registerForPushNotificationsAsync,
  scheduleLocalNotification,
  NotificationType,
} from '../services/notificationsService';

/**
 * useNotifications
 *
 * Agent 3 — Sprint 5: Notification Lifecycle Hook
 *
 * Responsibilities:
 *  1. Register the device for push notifications on mount.
 *  2. Handle incoming notifications in Foreground (show alert via the service handler).
 *  3. Handle user tapping a notification (Background/Quit) → navigate to the right screen.
 *  4. Expose `sendTestNotification` for components/hooks to fire simulated push events.
 */
export const useNotifications = () => {
  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);

  // Navigation may not be available at top-level, so we try to use it safely
  let navigation: ReturnType<typeof useNavigation<any>> | null = null;
  try {
    navigation = useNavigation<any>();
  } catch {
    // NavigationContainer not yet mounted — safe to ignore on first render
  }

  useEffect(() => {
    // 1. Register device & get push token
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        // TODO (Firebase): Send token to Firestore for server-side fan-out
        console.log('[useNotifications] Device registered with token:', token);
      }
    });

    // 2. Foreground listener — notification arrives while app is open
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('[useNotifications] Foreground notification received:', notification);
      // The notificationsService handler already shows the banner.
      // Here we could update a badge count in Zustand if needed.
    });

    // 3. Response listener — user taps the notification (background or quit state)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as {
        type?: NotificationType;
        deepLink?: string;
      };

      console.log('[useNotifications] Notification tapped:', data);

      if (navigation && data.deepLink) {
        handleDeepLink(data.deepLink, navigation);
      }
    });

    // 4. Handle the notification that launched the app (quit state)
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response && navigation) {
        const data = response.notification.request.content.data as { deepLink?: string };
        if (data.deepLink) {
          handleDeepLink(data.deepLink, navigation);
        }
      }
    });

    return () => {
      // Clean up listeners to prevent memory leaks
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  /**
   * Simulates a remote push notification locally.
   * In production, this is triggered by a Firebase Cloud Function.
   */
  const sendTestNotification = useCallback((type: NotificationType) => {
    const config = getNotificationConfig(type);
    scheduleLocalNotification(config);
  }, []);

  return { sendTestNotification };
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Maps a deep-link path to a Navigation action.
 * Keeps navigation logic out of the service layer.
 */
function handleDeepLink(deepLink: string, navigation: any) {
  // Normalize: "roome://chat" → "chat"
  const path = deepLink.replace('roome://', '').split('/')[0];

  const routeMap: Record<string, string> = {
    chat: 'Chat',
    polls: 'Polls',
    tasks: 'Tasks',
    expenses: 'Expenses',
    shopping: 'Shopping',
    home: 'Home',
  };

  const routeName = routeMap[path];
  if (routeName) {
    // Navigate to the main tab stack first, then the specific tab
    navigation.navigate('MainTabs', { screen: routeName });
  }
}

/**
 * Returns the notification content for each notification type.
 * Centralising this here keeps strings manageable.
 */
function getNotificationConfig(type: NotificationType) {
  const map = {
    new_message: {
      type,
      title: '💬 New message',
      body: 'A roommate sent a message in the house chat.',
      deepLink: 'roome://chat',
    },
    new_poll: {
      type,
      title: '📊 New poll',
      body: 'Your roommate wants your vote! Open the poll.',
      deepLink: 'roome://polls',
    },
    poll_vote: {
      type,
      title: '🗳 New vote on your poll',
      body: 'Someone voted on your poll.',
      deepLink: 'roome://polls',
    },
    task_assigned: {
      type,
      title: '✅ Task assigned',
      body: "You've been assigned a new chore. Don't forget!",
      deepLink: 'roome://tasks',
    },
  } as const;

  return map[type];
}
