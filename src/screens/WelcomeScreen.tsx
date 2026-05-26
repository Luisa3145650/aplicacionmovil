import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

type Props = {
  onFinish: () => void;
};

const WelcomeScreen = ({ onFinish }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido a</Text>
      <Text style={styles.title}>ADSO 3145650</Text>
      <Text style={styles.subtitle}>Creado por</Text>
      <Text style={styles.name}>Luisa Fernanda Samboni Ruiz</Text>
      <ActivityIndicator
        size="large"
        color="#ffffff"
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcome: {
    fontSize: 22,
    color: '#a0a0c0',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0c0',
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e0e0ff',
    textAlign: 'center',
  },
  loader: {
    marginTop: 48,
  },
});

export default WelcomeScreen;