import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/colors';
import { Button } from '../Button';
import { User, HouseMember } from '../../types';

interface Props {
  pendingMembers: HouseMember[];
  houseMembers: User[];
  onApprove: (userId: string) => void;
}

export const PendingApprovalsBoard = ({ pendingMembers, houseMembers, onApprove }: Props) => {
  if (pendingMembers.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Solicitudes Pendientes</Text>
      <Text style={styles.description}>
        Tienes roomies esperando que los aceptes para entrar a la casa.
      </Text>
      {pendingMembers.map(pending => {
        const pendingUser = houseMembers.find(u => u.id === pending.userId);
        return (
          <View key={pending.userId} style={styles.pendingRow}>
            <Text style={styles.pendingUserText}>{pendingUser?.name || 'Nuevo Usuario'}</Text>
            <Button 
              title="Aceptar" 
              onPress={() => onApprove(pending.userId)}
              style={styles.acceptButton}
              textStyle={styles.acceptButtonText}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: typography.sizes.h3,
    fontWeight: typography.weights.semibold as '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  pendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  pendingUserText: {
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  acceptButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 90,
  },
  acceptButtonText: {
    fontSize: 14,
  },
});
