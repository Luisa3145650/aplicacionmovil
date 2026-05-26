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
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Q } from '@nozbe/watermelondb';
import { database } from '../../../core/database/database';
import User from '../../../core/database/models/User';

type NavigationProp = NativeStackNavigationProp<any>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    
    // Validaciones
    if (!cleanFirstName || !cleanLastName || !cleanEmail || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Formato de correo electrónico inválido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const usersCollection = database.get<User>('users');
      
      // Validar si el correo ya está registrado
      const existingUsers = await usersCollection.query(Q.where('email', cleanEmail)).fetch();
      if (existingUsers.length > 0) {
        setError('El correo electrónico ya está registrado');
        setLoading(false);
        return;
      }

      // Crear usuario
      await database.write(async () => {
        await usersCollection.create((newUser) => {
          newUser._setRaw('first_name', cleanFirstName);
          newUser._setRaw('last_name', cleanLastName);
          newUser._setRaw('email', cleanEmail);
          newUser._setRaw('password', password);
          newUser._setRaw('created_at', Date.now());
        });
      });

      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.', [
        { text: 'Aceptar', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Ocurrió un error al registrar el usuario');
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
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>Regístrate para comenzar</Text>

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombres</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Juan"
                  placeholderTextColor="#9CA3AF"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (error) setError('');
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Apellidos</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Pérez"
                  placeholderTextColor="#9CA3AF"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (error) setError('');
                  }}
                />
              </View>

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
                  placeholder="Mínimo 6 caracteres"
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

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Repite la contraseña"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (error) setError('');
                  }}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkContainer}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={styles.linkText}>
                  ¿Ya tienes cuenta? <Text style={styles.linkHighlight}>Inicia sesión</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
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
