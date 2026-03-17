import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { ShoppingSection } from '../types';

interface Props {
  section: ShoppingSection;
  onPress: () => void;
}

const PREVIEW_COUNT = 3;

export const ShoppingSectionCard: React.FC<Props> = ({ section, onPress }) => {
  const totalItems     = section.items.length;
  const purchasedItems = section.items.filter(i => i.isPurchased).length;
  const previewItems   = section.items.slice(0, PREVIEW_COUNT);
  const progress       = totalItems > 0 ? purchasedItems / totalItems : 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{section.emoji}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>{section.name}</Text>
          <Text style={styles.subtitle}>
            {totalItems === 0
              ? 'Lista vacía'
              : `${purchasedItems} / ${totalItems} items`}
          </Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={colors.textSecondary}
        />
      </View>

      {/* ── Progress bar ── */}
      {totalItems > 0 && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}

      {/* ── Item Preview ── */}
      {previewItems.length > 0 && (
        <View style={styles.previewList}>
          {previewItems.map(item => (
            <View key={item.id} style={styles.previewRow}>
              <MaterialCommunityIcons
                name={item.isPurchased ? 'check-circle' : 'circle-outline'}
                size={14}
                color={item.isPurchased ? colors.success : colors.textSecondary}
                style={styles.previewIcon}
              />
              <Text
                style={[styles.previewText, item.isPurchased && styles.previewTextDone]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </View>
          ))}
          {totalItems > PREVIEW_COUNT && (
            <Text style={styles.moreText}>
              +{totalItems - PREVIEW_COUNT} más...
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emoji: {
    fontSize: 22,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.h3,
    fontWeight: typography.weights.bold as '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 2,
  },
  previewList: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    marginRight: 6,
  },
  previewText: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  previewTextDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
    opacity: 0.6,
  },
  moreText: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
});
