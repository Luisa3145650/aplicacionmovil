import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from './src/store/useAuthStore';
import LoginScreen from './src/features/auth/screens/LoginScreen';
import RegisterScreen from './src/features/auth/screens/RegisterScreen';
import { DashboardScreen } from './src/features/tasks/screens/DashboardScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const currentUser = useAuthStore((state) => state.currentUser);

  if (showWelcome) {
    return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {currentUser === null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;