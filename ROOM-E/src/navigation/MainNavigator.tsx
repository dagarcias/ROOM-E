import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { ExpensesScreen } from '../screens/ExpensesScreen';
import { AddTaskScreen } from '../screens/AddTaskScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { ShoppingScreen } from '../screens/ShoppingScreen';
import { ShoppingSectionScreen } from '../screens/ShoppingSectionScreen';
import { ConvertExpenseModal } from '../screens/ConvertExpenseModal';
import { ChatScreen } from '../screens/ChatScreen';
import { CreatePollModal } from '../screens/CreatePollModal';
import { AddRecurringExpenseModal } from '../screens/AddRecurringExpenseModal';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="check-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Expenses" 
        component={ExpensesScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cash-multiple" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat-processing-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Shopping" 
        component={ShoppingScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen 
        name="AddTaskModal" 
        component={AddTaskScreen} 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen 
        name="AddExpenseModal" 
        component={AddExpenseScreen} 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen 
        name="ConvertExpenseModal" 
        component={ConvertExpenseModal} 
        options={{ presentation: 'transparentModal' }}
      />
      <Stack.Screen 
        name="CreatePollModal" 
        component={CreatePollModal} 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="AddRecurringExpenseModal"
        component={AddRecurringExpenseModal}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen 
        name="ShoppingSectionDetail" 
        component={ShoppingSectionScreen}
        options={{ presentation: 'card' }}
      />
    </Stack.Navigator>
  );
};
