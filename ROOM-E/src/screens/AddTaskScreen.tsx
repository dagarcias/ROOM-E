import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography } from '../theme/colors';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { useAppStore } from '../store/useAppStore';

export const AddTaskScreen = () => {
  const navigation = useNavigation();
  const { houseMembers, addTask, user } = useAppStore();

  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(user?.id || houseMembers[0]?.id || '');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isRecurringWeekly, setIsRecurringWeekly] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      assignee, // now stores userId
      dueDate: dueDate.toISOString(),
      category: category.trim() || undefined,
      recurrence: isRecurringWeekly ? 'weekly' : 'none',
    });

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nueva Tarea</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Nombre de la tarea</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Limpiar la cocina"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        <Text style={styles.label}>Asignar a</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
          {houseMembers.map(member => (
            <Chip
              key={member.id}
              label={member.name}
              selected={assignee === member.id}
              onPress={() => setAssignee(member.id)}
              style={styles.spacingRight}
            />
          ))}
        </ScrollView>

        <Text style={styles.label}>When?</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialCommunityIcons name="calendar-month" size={24} color={colors.primary} />
          <Text style={styles.datePickerText}>
            {dueDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Recurring?</Text>
        <View style={styles.rowLayout}>
          <Chip
            label="Just Once"
            selected={!isRecurringWeekly}
            onPress={() => setIsRecurringWeekly(false)}
          />
          <Chip
            label="Weekly (Repeats)"
            selected={isRecurringWeekly}
            onPress={() => setIsRecurringWeekly(true)}
          />
        </View>

        <Text style={styles.label}>Category (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Cleaning, General"
          value={category}
          onChangeText={setCategory}
        />
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
          title="Save Task"
          onPress={handleSave}
          disabled={!title.trim()}
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
  },
  datePickerText: {
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
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
