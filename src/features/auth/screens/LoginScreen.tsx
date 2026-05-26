import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Q } from '@nozbe/watermelondb';
import { database } from '../../../core/database/database';
import User from '../../../core/database/models/User';
import { useAuthStore, DEFAULT_USER } from '../../../store/useAuthStore';

type NavigationProp = NativeStackNavigationProp<any>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    try {
      // Verificación de usuario predeterminado (admin / 123)
      if (cleanEmail === DEFAULT_USER.email && cleanPassword === DEFAULT_USER.password) {
        setCurrentUser({
          firstName: DEFAULT_USER.firstName,
          lastName: DEFAULT_USER.lastName,
          email: DEFAULT_USER.email,
        });
        setLoading(false);
        return;
      }

      const usersCollection = database.get<User>('users');
      const matchingUsers = await usersCollection.query(Q.where('email', cleanEmail)).fetch();

      if (matchingUsers.length === 0) {
        setError('Correo o contraseña incorrectos');
        setLoading(false);
        return;
      }

      const user = matchingUsers[0];
      if (user.password !== cleanPassword) {
        setError('Correo o contraseña incorrectos');
        setLoading(false);
        return;
      }

      // Guardar sesión en Zustand
      setCurrentUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } catch (err) {
      console.error('Error during login:', err);
      setError('Ocurrió un error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Bienvenido a Hawk</Text>
            <Text style={styles.subtitle}>El cápitan de tus tareas pendientes</Text>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError('');
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError('');
                }}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>
                ¿No tienes cuenta? <Text style={styles.linkHighlight}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: {
    backgroundColor: '#FEF2F2',
    color: '#EF4444',
    padding: 12,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4B5563',
    fontSize: 14,
  },
  linkHighlight: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});
