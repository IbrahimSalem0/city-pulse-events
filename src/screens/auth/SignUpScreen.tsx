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
import { styles } from './SignUpScreen.styles';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { updateUser } = useApp();

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Mock sign up - in real app, this would call an API
    const mockUser = {
      id: Date.now().toString(),
      name,
      email,
      favoriteEvents: [],
      language: 'en' as const,
    };
    
    updateUser(mockUser);
    Alert.alert('Success', 'Account created successfully!');
  };

  const handleBackToLogin = () => {
    // Navigate back to login screen
    Alert.alert('Info', 'Back to login functionality would be implemented here');
  };

  return (
    <SafeArea>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.form}>
            <Input
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />

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

            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Create Account"
              onPress={handleSignUp}
              style={styles.signUpButton}
            />

            <Button
              title="Already have an account? Sign In"
              onPress={handleBackToLogin}
              variant="outline"
              style={styles.loginButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
