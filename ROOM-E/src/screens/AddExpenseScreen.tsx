import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme/colors';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { useAppStore } from '../store/useAppStore';

export const AddExpenseScreen = () => {
  const navigation = useNavigation();
  const { houseMembers, user, addExpense } = useAppStore();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  // Default: current user paid
  const [payerId, setPayerId] = useState(user?.id || houseMembers[0].id);
  // Default: everyone is checked to split it
  const [participantIds, setParticipantIds] = useState<string[]>(houseMembers.map(m => m.id));

  const toggleParticipant = (id: string) => {
    if (participantIds.includes(id)) {
      setParticipantIds(prev => prev.filter(p => p !== id));
    } else {
      setParticipantIds(prev => [...prev, id]);
    }
  };

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0 || participantIds.length === 0) return;
    
    addExpense({
      title: title.trim(),
      amount: numAmount,
      payerId,
      participantIds,
      date: new Date().toISOString(),
    });
    
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Expense</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>What is it for?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Groceries, Internet"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        <Text style={styles.label}>How much?</Text>
        <TextInput
          style={styles.input}
          placeholder="$ 0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Who paid?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
          {houseMembers.map(member => (
            <Chip 
              key={`payer-${member.id}`}
              label={member.name}
              selected={payerId === member.id}
              onPress={() => setPayerId(member.id)}
              style={styles.spacingRight}
            />
          ))}
        </ScrollView>

        <Text style={styles.label}>Split between</Text>
        <View style={styles.rowLayout}>
          {houseMembers.map(member => (
            <Chip 
              key={`split-${member.id}`}
              label={member.name}
              selected={participantIds.includes(member.id)}
              onPress={() => toggleParticipant(member.id)}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Cancel" 
          variant="outline" 
          onPress={() => navigation.goBack()} 
          style={styles.footerButtonActive} 
        />
        <Button 
          title="Save Expense" 
          onPress={handleSave} 
          disabled={!title.trim() || !amount.trim() || participantIds.length === 0} 
          style={styles.footerButtonActive} 
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold as '700',
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.xl,
  },
  label: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold as '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
  },
  scrollRow: {
    flexDirection: 'row',
  },
  spacingRight: {
    marginRight: spacing.sm,
  },
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.xl,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  footerButtonActive: {
    flex: 1,
  }
});
