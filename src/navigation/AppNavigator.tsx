import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { InspirationProvider } from '../context/InspirationContext';
import CustomTabBar from '../components/CustomTabBar';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import RecordScreen from '../screens/RecordScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: '灵感空间',
        }}
      />
      <Tab.Screen 
        name="AddInspiration" 
        component={RecordScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: '设置',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  // For demo purposes, skip onboarding and authentication on web
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleOnboardingComplete = () => {
    setIsFirstLaunch(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <InspirationProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isFirstLaunch ? (
            <Stack.Screen name="Onboarding">
              {() => <OnboardingScreen onComplete={handleOnboardingComplete} />}
            </Stack.Screen>
          ) : !isAuthenticated ? (
            <>
              <Stack.Screen name="Login">
                {({ navigation }) => (
                  <LoginScreen
                    onLogin={handleLogin}
                    onNavigateToRegister={() => navigation.navigate('Register')}
                    onNavigateToForgotPassword={() => navigation.navigate('ForgotPassword')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {({ navigation }) => (
                  <RegisterScreen
                    onRegister={handleLogin}
                    onNavigateToLogin={() => navigation.navigate('Login')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="ForgotPassword">
                {({ navigation }) => (
                  <ForgotPasswordScreen
                    onBack={() => navigation.goBack()}
                  />
                )}
              </Stack.Screen>
            </>
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </InspirationProvider>
  );
}