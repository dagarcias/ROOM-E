import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const LoginScreen = () => {
  const login = useAppStore(state => state.login);
  const registerUser = useAppStore(state => state.registerUser);

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAction = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Ingresa correo y clave');
      return;
    }
    
    setLoading(true);
    if (isRegistering) {
      if (!name) {
        Alert.alert('Error', 'Ingresa tu nombre');
        setLoading(false);
        return;
      }
      const { error } = await registerUser(name, email, password);
      if (error) Alert.alert('Error', error.message);
      else Alert.alert('Éxito', 'Cuenta creada. Por favor inicia sesión.');
    } else {
      const { error } = await login(email, password);
      if (error) Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  const handleAppleLogin = () => {
    Alert.alert('Próximamente', 'Apple login en desarrollo');
  };

  const handleGoogleLogin = () => {
    Alert.alert('Próximamente', 'Google login en desarrollo');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Entra a ROOM-E</Text>
        <Text style={styles.subtitle}>Selecciona el método para continuar</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity style={[styles.loginButton, styles.appleButton]} onPress={handleAppleLogin}>
          <MaterialCommunityIcons name="apple" size={24} color="#fff" />
          <Text style={styles.appleButtonText}>Continuar con Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.loginButton, styles.googleButton]} onPress={handleGoogleLogin}>
          <MaterialCommunityIcons name="google" size={24} color={colors.textPrimary} />
          <Text style={styles.googleButtonText}>Continuar con Google</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>o usa tu correo</Text>
          <View style={styles.divider} />
        </View>

        {isRegistering && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tu nombre</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: Laura"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput 
            style={styles.input} 
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            style={styles.input} 
            placeholder="*********"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.emailButton} onPress={handleEmailAction} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.emailButtonText}>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchButton} onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.switchButtonText}>
            {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
          </Text>
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
  header: {
    padding: 32,
    marginTop: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  body: {
    paddingHorizontal: 32,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  appleButton: {
    backgroundColor: '#000',
  },
  appleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  googleButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#94a3b8',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  emailButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
