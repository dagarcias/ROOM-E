import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme/colors';

interface Props {
  onSendMessage: (text: string) => void;
  onPressAttach: () => void;
}

export const ChatInput = ({ onSendMessage, onPressAttach }: Props) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim().length > 0) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Accounts for bottom tabs
      style={styles.keyboardContainer}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.attachButton} onPress={onPressAttach}>
          <MaterialCommunityIcons name="poll" size={28} color={colors.primary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={400}
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, text.trim().length === 0 && styles.sendButtonDisabled]} 
          onPress={handleSend}
          disabled={text.trim().length === 0}
        >
          <MaterialCommunityIcons 
            name="send-circle" 
            size={36} 
            color={text.trim().length > 0 ? colors.primary : colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  attachButton: {
    padding: spacing.xs,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingTop: 12, // Needs explicit padding for multiline
    paddingBottom: 12,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: {
    padding: 0,
    marginBottom: 0,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
