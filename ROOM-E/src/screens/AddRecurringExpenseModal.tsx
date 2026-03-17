import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { useAppStore } from '../store/useAppStore';
import { RecurrencePeriod } from '../types';
import { Chip } from '../components/Chip';

const EMOJI_OPTIONS = ['🏠', '💧', '⚡', '📺', '🌐', '🗑️', '🔥', '❄️', '🔑', '🏋️', '📱', '🎵'];

export const AddRecurringExpenseModal = () => {
  const navigation  = useNavigation<any>();
  const { addRecurringExpense, houseMembers, currentHouseId, user } = useAppStore();

  const [icon, setIcon]             = useState('🏠');
  const [title, setTitle]           = useState('');
  const [amount, setAmount]         = useState('');
  const [recurrence, setRecurrence] = useState<RecurrencePeriod>('monthly');
  const [dueDay, setDueDay]         = useState('1');
  const [payerId, setPayerId] = useState(user?.id || houseMembers[0]?.id || '');
  const [participantIds, setParticipantIds] = useState<string[]>(houseMembers.map(m => m.id));

  const toggleParticipant = (id: string) => {
    if (participantIds.includes(id)) {
      setParticipantIds(prev => prev.filter(p => p !== id));
    } else {
      setParticipantIds(prev => [...prev, id]);
    }
  };

  const canSave = title.trim().length > 0 && parseFloat(amount) > 0 && participantIds.length > 0 && !!payerId;

  const handleSave = () => {
    if (!canSave || !currentHouseId) return;
    addRecurringExpense({
      icon,
      title: title.trim(),
      amount: parseFloat(amount),
      recurrence,
      dueDay: Math.min(31, Math.max(1, parseInt(dueDay) || 1)),
      participantIds,
      payerId,
      houseId: currentHouseId,
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backdrop} onPress={() => navigation.goBack()} activeOpacity={1} />
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nuevo Gasto Fijo</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Emoji Picker */}
          <Text style={styles.label}>Ícono</Text>
          <View style={styles.emojiGrid}>
            {EMOJI_OPTIONS.map(e => (
              <TouchableOpacity
                key={e}
                style={[styles.emojiBtn, icon === e && styles.emojiBtnActive]}
                onPress={() => setIcon(e)}
              >
                <Text style={styles.emoji}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Name */}
          <Text style={styles.label}>Nombre del servicio</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Arriendo, Netflix, Agua…"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          {/* Amount */}
          <Text style={styles.label}>Monto total</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          {/* Recurrence */}
          <Text style={styles.label}>Frecuencia</Text>
          <View style={styles.toggleRow}>
            {(['monthly', 'yearly'] as RecurrencePeriod[]).map(r => (
              <TouchableOpacity
                key={r}
                style={[styles.toggleBtn, recurrence === r && styles.toggleBtnActive]}
                onPress={() => setRecurrence(r)}
              >
                <Text style={[styles.toggleText, recurrence === r && styles.toggleTextActive]}>
                  {r === 'monthly' ? 'Mensual' : 'Anual'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Día de vencimiento</Text>
          <TextInput
            style={styles.input}
            placeholder="1"
            placeholderTextColor={colors.textSecondary}
            value={dueDay}
            onChangeText={setDueDay}
            keyboardType="numeric"
          />

          <Text style={styles.label}>¿Quién suele pagarlo?</Text>
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

          <Text style={styles.label}>Se divide entre</Text>
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

          {/* Preview */}
          {canSave && (
            <View style={styles.preview}>
              <Text style={styles.previewText}>
                {icon} {title} · <Text style={{ fontWeight: '700', color: colors.primary }}>
                  ${(parseFloat(amount) / participantIds.length).toFixed(2)}
                </Text> / persona
              </Text>
            </View>
          )}
          <View style={{height: 40}} />
        </ScrollView>

        {/* Save */}
        <TouchableOpacity
          style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!canSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Guardar servicio</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  backdrop: { flex: 1 },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 44 : spacing.xl,
    maxHeight: '90%',
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.h2,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    fontSize: typography.sizes.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  emojiBtn: {
    width: 44, height: 44,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiBtnActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}15` },
  emoji: { fontSize: 22 },
  input: {
    backgroundColor: colors.card,
    height: 52,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  toggleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  toggleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  toggleBtnActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}15` },
  toggleText: { fontWeight: '600', color: colors.textSecondary },
  toggleTextActive: { color: colors.primary },
  scrollRow: { flexDirection: 'row' },
  spacingRight: { marginRight: spacing.sm },
  rowLayout: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  preview: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  previewText: {
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: colors.white, fontWeight: '700', fontSize: typography.sizes.body },
});
