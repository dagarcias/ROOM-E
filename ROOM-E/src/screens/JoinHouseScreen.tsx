import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';

export const JoinHouseScreen = () => {
  const navigation = useNavigation();
  const requestJoinHouse = useAppStore(state => state.requestJoinHouse);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (code.trim().length === 6) {
      const result = requestJoinHouse(code.trim().toUpperCase());
      if (result === 'invalid') {
        setError('El código ingresado no corresponde a ninguna casa.');
      } else if (result === 'already_in') {
        setError('Ya eres miembro de esta casa.');
      } else {
        setError(null);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="chevron-left" size={32} color={colors.textPrimary} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="key-variant" size={60} color={colors.accent} />
        </View>

        <Text style={styles.title}>Ingresa el código</Text>
        <Text style={styles.subtitle}>Pídele a tus roomies el código secreto de 6 dígitos que aparece en los ajustes de la casa.</Text>

        <TextInput 
          style={styles.input} 
          placeholder="X X X X X X"
          placeholderTextColor="#94a3b8"
          value={code}
          onChangeText={text => setCode(text.toUpperCase())}
          maxLength={6}
          autoCapitalize="characters"
          autoCorrect={false}
          autoFocus
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, code.trim().length < 6 && styles.buttonDisabled]} 
          onPress={handleNext}
          disabled={code.trim().length < 6}
        >
          <Text style={styles.buttonText}>Unirme ahora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 20,
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
