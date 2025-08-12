import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useApp } from '../../store/AppContext';
import { Button, Input, SafeArea } from '../../components';
import { styles } from './LoginScreen.styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useApp();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Mock authentication - in real app, this would call an API
    if (email === 'demo@example.com' && password === 'password') {
      const mockUser = {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        favoriteEvents: [],
        language: 'en' as const,
      };
      updateUser(mockUser);
    } else {
      Alert.alert('Error', 'Invalid credentials. Use demo@example.com / password');
    }
  };

  const handleSignUp = () => {
    // Navigate to sign up screen
    Alert.alert('Info', 'Sign up functionality would be implemented here');
  };

  return (
    <SafeArea>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.form}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              style={styles.loginButton}
            />

            <Button
              title="Don't have an account? Sign Up"
              onPress={handleSignUp}
              variant="outline"
              style={styles.signUpButton}
            />
          </View>

          <View style={styles.demoInfo}>
            <Text style={styles.demoText}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Email: demo@example.com</Text>
            <Text style={styles.demoText}>Password: password</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
