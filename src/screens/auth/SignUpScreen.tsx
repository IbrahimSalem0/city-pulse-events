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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

export default function SignUpScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { updateUser } = useApp();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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
    navigation.navigate("Login");
  };

  return (
    <SafeArea>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.content}>
          {/* App Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.appIcon}>🏙️</Text>
            <Text style={styles.appName}>City Pulse</Text>
            <Text style={styles.appTagline}>Events</Text>
          </View>

          <Text style={styles.title}>{t('auth.createAccount')}</Text>
          <Text style={styles.subtitle}>{t('auth.signupToStart')}</Text>

          <View style={styles.form}>
            <Input
              label={t('auth.fullName')}
              placeholder={t('auth.fullNamePlaceholder')}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Input
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              showPasswordToggle={true}
              autoCapitalize="none"
            />

            <Input
              label={t('auth.confirmPassword')}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              showPasswordToggle={true}
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
