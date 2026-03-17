import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { Button } from '../components/Button';
import { useAppStore } from '../store/useAppStore';

export const CreatePollModal = () => {
  const navigation = useNavigation();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);

  // --- Zustand Store ---
  const currentHouseId = useAppStore(state => state.currentHouseId);
  const user = useAppStore(state => state.user);
  const createPoll = useAppStore(state => state.createPoll);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const updateOptionText = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const isFormValid = question.trim().length > 0 && options.every(opt => opt.trim().length > 0);

  const handleCreate = () => {
    if (isFormValid && currentHouseId && user) {
      createPoll(
        currentHouseId,
        user.id,
        question.trim(),
        options.map(o => o.trim()),
      );
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Nueva Encuesta</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Question Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pregunta</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej: ¿Qué compramos para la fiesta?"
              placeholderTextColor={colors.textSecondary}
              value={question}
              onChangeText={setQuestion}
              maxLength={150}
            />
          </View>

          {/* Options Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Opciones</Text>
            {options.map((opt, index) => (
              <View key={index} style={styles.optionRow}>
                <TextInput
                  style={[styles.textInput, styles.optionInput]}
                  placeholder={`Opción ${index + 1}`}
                  placeholderTextColor={colors.textSecondary}
                  value={opt}
                  onChangeText={(text) => updateOptionText(text, index)}
                  maxLength={50}
                />
                {options.length > 2 && (
                  <TouchableOpacity onPress={() => handleRemoveOption(index)} style={styles.removeBtn}>
                    <MaterialCommunityIcons name="minus-circle-outline" size={24} color={colors.accent} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            {options.length < 5 && (
              <TouchableOpacity style={styles.addOptionBtn} onPress={handleAddOption}>
                <MaterialCommunityIcons name="plus" size={20} color={colors.primary} />
                <Text style={styles.addOptionText}>Añadir opción</Text>
              </TouchableOpacity>
            )}
          </View>

          <Button 
            title="Crear Encuesta" 
            onPress={handleCreate} 
            disabled={!isFormValid}
            style={styles.createBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold as '700',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.sizes.h3,
    fontWeight: typography.weights.semibold as '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  optionInput: {
    flex: 1,
  },
  removeBtn: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  addOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
  },
  addOptionText: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold as '600',
    marginLeft: 4,
  },
  createBtn: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxxl,
  }
});
