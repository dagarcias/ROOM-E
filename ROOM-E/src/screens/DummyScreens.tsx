import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/colors';

export const TasksScreen = () => (
  <View style={styles.container}><Text style={styles.text}>Tasks Coming Soon</Text></View>
);

export const ExpensesScreen = () => (
  <View style={styles.container}><Text style={styles.text}>Expenses Coming Soon</Text></View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { fontSize: typography.sizes.h2, color: colors.textSecondary }
});
