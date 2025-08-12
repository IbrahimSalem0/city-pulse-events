import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../store/AppContext';
import { Button, Input, SafeArea } from '../../components';
import { styles } from './SignUpScreen.styles';

export default function SignUpScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { updateUser } = useApp();

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(t('common.error'), t('auth.emailRequired'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('common.error'), t('auth.passwordTooShort'));
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
    Alert.alert(t('common.success'), t('auth.accountCreated'));
  };

  const handleBackToLogin = () => {
    // Navigate back to login screen
    Alert.alert(t('common.info'), t('auth.backToLogin'));
  };

  return (
    <SafeArea>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{t('auth.createAccount')}</Text>
          <Text style={styles.subtitle}>{t('auth.signupToStart')}</Text>

          <View style={styles.form}>
            <Input
              placeholder={t('auth.fullName')}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Input
              placeholder={t('auth.email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              placeholder={t('auth.password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Input
              placeholder={t('auth.confirmPassword')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title={t('auth.signupButton')}
              onPress={handleSignUp}
              style={styles.signUpButton}
            />

            <Button
              title={t('auth.hasAccount')}
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
