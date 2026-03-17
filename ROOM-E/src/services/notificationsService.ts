/**
 * notificationsService.ts
 *
 * Agent 3 — Sprint 5: Push Notifications Infrastructure
 *
 * PURPOSE:
 * - This is the ONLY file in the app that knows about `expo-notifications`.
 * - Applies High Cohesion: all notification infra is centralised here.
 * - Applies Resilience: permission requests fail gracefully (no crashes/spam).
 *
 * FIREBASE MIGRATION PATH:
 * When migrating to Firebase Cloud Messaging (FCM):
 * 1. Install `@react-native-firebase/messaging`.
 * 2. Replace `registerForPushNotificationsAsync` with `firebase.messaging().getToken()`.
 * 3. The rest of the app (hooks, screens) remains identical — only this file changes.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Foreground notification handler:
// Show a banner, play a sound, and set a badge while the app is in foreground.
// ---------------------------------------------------------------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type NotificationType = 'new_message' | 'new_poll' | 'poll_vote' | 'task_assigned';

export interface PushNotificationPayload {
  type: NotificationType;
  /** Navigation target — one of the registered deep-link paths */
  deepLink?: string;
  /** Human-readable preview shown in the notification body */
  body: string;
  title: string;
}

// ---------------------------------------------------------------------------
// registerForPushNotificationsAsync
// ---------------------------------------------------------------------------
/**
 * Requests OS permission for push notifications and returns the Expo Push Token.
 * Returns `null` gracefully if the user declines or the device does not support it.
 *
 * NOTE: Physical device required for a real push token.
 * On simulator/emulator this returns null, which is safe — the app continues normally.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'ROOM-E Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[Notifications] Permission not granted. Push notifications disabled.');
      return null;
    }

    // On a real device this would be the FCM/APNs token.
    // On simulators, getExpoPushTokenAsync may fail — we catch gracefully.
    const tokenData = await Notifications.getExpoPushTokenAsync().catch(() => null);
    const token = tokenData?.data ?? null;

    if (token) {
      console.log('[Notifications] Expo Push Token:', token);
      // TODO (Firebase): Save this token to Firestore under the current user's profile
      // e.g.: db.collection('users').doc(userId).update({ pushToken: token })
    }

    return token;
  } catch (error) {
    console.warn('[Notifications] Failed to register:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// scheduleLocalNotification (Foreground + Background simulation)
// ---------------------------------------------------------------------------
/**
 * Fires a local notification immediately.
 * In production, this would be replaced by a Firebase Cloud Function
 * that calls the Expo Push API (https://exp.host/--/api/v2/push/send).
 */
export async function scheduleLocalNotification(payload: PushNotificationPayload): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: payload.title,
      body: payload.body,
      data: {
        type: payload.type,
        deepLink: payload.deepLink ?? null,
      },
      sound: true,
    },
    trigger: null, // Fire immediately
  });
}
