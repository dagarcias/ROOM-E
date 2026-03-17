import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/colors';

interface Props {
  inviteCode?: string;
}

export const HouseInviteCard = ({ inviteCode }: Props) => {
  if (!inviteCode) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.accent + '10' }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.accent }]}>Tu Casa</Text>
      </View>
      <Text style={styles.cardContent}>
        Código de Invitación: <Text style={styles.codeHighlight}>{inviteCode}</Text>
      </Text>
      <Text style={styles.description}>
        Comparte este código de 6 dígitos con tus roomies para que se unan directamente a esta casa.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.h3,
    fontWeight: typography.weights.semibold as '600',
    marginBottom: spacing.sm,
  },
  cardContent: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  codeHighlight: {
    fontWeight: 'bold',
    letterSpacing: 2,
    color: colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
