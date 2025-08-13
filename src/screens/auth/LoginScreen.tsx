import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useApp } from "../../store/AppContext";
import { Button, Input, SafeArea } from "../../components";
import { styles } from "./LoginScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { updateUser } = useApp();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(t("common.error"), t("auth.emailRequired"));
      return;
    }

    // Mock authentication - in real app, this would call an API
    if (email === "demo@example.com" && password === "password") {
      const mockUser = {
        id: "1",
        name: "Demo User",
        email: "demo@example.com",
        favoriteEvents: [],
        language: "en" as const,
      };
      updateUser(mockUser);
    } else {
      Alert.alert(t("common.error"), t("auth.invalidCredentials"));
    }
  };

  const handleSignUp = () => {
    // Navigate to sign up screen
    navigation.navigate("SignUp");
  };

  return (
    <SafeArea>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          {/* App Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.appIcon}>🏙️</Text>
            <Text style={styles.appName}>City Pulse</Text>
            <Text style={styles.appTagline}>Events</Text>
          </View>

          <Text style={styles.title}>{t("auth.login")}</Text>
          <Text style={styles.subtitle}>{t("auth.welcomeBack")}</Text>

          <View style={styles.form}>
            <Input
              label={t("auth.email")}
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label={t("auth.password")}
              placeholder={t("auth.passwordPlaceholder")}
              value={password}
              onChangeText={setPassword}
              showPasswordToggle={true}
              autoCapitalize="none"
            />

            <Button
              title={t("auth.loginButton")}
              onPress={handleLogin}
              style={styles.loginButton}
            />

            <Button
              title={t("auth.noAccount")}
              onPress={handleSignUp}
              variant="outline"
              style={styles.signUpButton}
            />
          </View>

          <View style={styles.demoInfo}>
            <Text style={styles.demoText}>{t("common.demo")}:</Text>
            <Text style={styles.demoText}>
              {t("auth.email")}: demo@example.com
            </Text>
            <Text style={styles.demoText}>{t("auth.password")}: password</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
