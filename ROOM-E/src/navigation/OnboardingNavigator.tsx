import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SetupProfileScreen } from '../screens/SetupProfileScreen';
import { CreateOrJoinScreen } from '../screens/CreateOrJoinScreen';
import { CreateHouseScreen } from '../screens/CreateHouseScreen';
import { JoinHouseScreen } from '../screens/JoinHouseScreen';
import { PendingApprovalScreen } from '../screens/PendingApprovalScreen';
import { useAppStore } from '../store/useAppStore';

const Stack = createNativeStackNavigator();

export const OnboardingNavigator = () => {
  const { user, currentHouseId, houses } = useAppStore();

  const currentHouse = houses.find(h => h.id === currentHouseId);
  const currentUserMember = currentHouse?.members.find(m => m.userId === user?.id);
  const isPending = currentUserMember?.status === 'pending';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user?.name ? (
        // Profile Setup Stack
        <Stack.Screen name="SetupProfile" component={SetupProfileScreen} />
      ) : !currentHouseId ? (
        // House Select Stack
        <>
          <Stack.Screen name="CreateOrJoin" component={CreateOrJoinScreen} />
          <Stack.Screen name="CreateHouse" component={CreateHouseScreen} />
          <Stack.Screen name="JoinHouse" component={JoinHouseScreen} />
        </>
      ) : isPending ? (
        // Pending Approval Stack
        <Stack.Screen name="PendingApproval" component={PendingApprovalScreen} />
      ) : null}
    </Stack.Navigator>
  );
};
