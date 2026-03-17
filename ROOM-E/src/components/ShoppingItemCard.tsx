import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { ShoppingItem } from '../types';

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onTogglePurchase: () => void;
  onDelete?: () => void;
}

export const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({ 
  item, 
  onTogglePurchase, 
  onDelete 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card, 
        item.isPurchased && styles.purchasedCard
      ]}
      onPress={onTogglePurchase}
      onLongPress={onDelete}
      activeOpacity={0.8}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={onTogglePurchase}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={item.isPurchased ? "check-circle" : "circle-outline"}
          size={24}
          color={item.isPurchased ? colors.success : colors.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[
          styles.title, 
          item.isPurchased && styles.purchasedText
        ]}>
          {item.name}
        </Text>
        {item.estimatedPrice && (
          <Text style={styles.meta}>
            Est. ${item.estimatedPrice.toFixed(2)}
          </Text>
        )}
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 1,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`, // 10% opacity
  },
  purchasedCard: {
    opacity: 0.7,
    backgroundColor: colors.background,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium as '500',
    color: colors.textPrimary,
  },
  purchasedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  meta: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  selectArea: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
