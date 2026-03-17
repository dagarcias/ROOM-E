import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/colors';

interface Props {
  text: string;
  isMe: boolean;
  senderName?: string;
  time: string;
}

export const MessageBubble = ({ text, isMe, senderName, time }: Props) => {
  return (
    <View style={[styles.container, isMe ? styles.myContainer : styles.theirContainer]}>
      {!isMe && senderName && <Text style={styles.senderName}>{senderName}</Text>}
      <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
        <Text style={[styles.text, isMe ? styles.myText : styles.theirText]}>{text}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    maxWidth: '80%',
  },
  myContainer: {
    alignSelf: 'flex-end',
  },
  theirContainer: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginBottom: 2,
    marginLeft: spacing.sm,
  },
  bubble: {
    padding: spacing.md,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: typography.sizes.body,
    lineHeight: 20,
  },
  myText: {
    color: colors.white,
  },
  theirText: {
    color: colors.textPrimary,
  },
  time: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    alignSelf: 'flex-end',
    marginHorizontal: spacing.sm,
  },
});
