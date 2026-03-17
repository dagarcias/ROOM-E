import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';

export const CreateHouseScreen = () => {
  const navigation = useNavigation();
  const createHouse = useAppStore(state => state.createHouse);
  const [houseName, setHouseName] = useState('');

  const handleNext = () => {
    if (houseName.trim()) {
      // In a real app we would call an API, get an ID and a share code
      createHouse(houseName.trim());
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="chevron-left" size={32} color={colors.textPrimary} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="home-city" size={60} color={colors.primary} />
        </View>

        <Text style={styles.title}>¿Cómo se llama el reino? 👑</Text>
        <Text style={styles.subtitle}>Dale un nombre a tu casa para que tus roomies la identifiquen.</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Ej. Piso 4B, Los Palmeras"
          placeholderTextColor="#94a3b8"
          value={houseName}
          onChangeText={setHouseName}
          autoFocus
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, !houseName.trim() && styles.buttonDisabled]} 
          onPress={handleNext}
          disabled={!houseName.trim()}
        >
          <Text style={styles.buttonText}>Crear y continuar</Text>
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
    backgroundColor: colors.primary + '15',
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
    fontSize: 18,
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
});
