import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../../store/AppContext";
import { SafeArea, SettingItem, InfoItem } from "../../components";
import { styles } from "./ProfileScreen.styles";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user, language, updateLanguage, updateUser, favoriteEvents } =
    useApp();

  const handleLogout = () => {
    Alert.alert(t("auth.logout"), t("profile.logoutConfirm"), [
      {
        text: t("common.cancel"),
        style: "cancel",
      },
      {
        text: t("auth.logout"),
        style: "destructive",
        onPress: () => updateUser(null),
      },
    ]);
  };

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    updateLanguage(newLanguage);
  };

  const handleViewFavorites = () => {
    // Navigate to favorites screen
    navigation.navigate("Favorites" as never);
  };

  if (!user) {
    return (
      <SafeArea>
        <View style={styles.container}>
          <Text style={styles.errorText}>{t("errors.userNotFound")}</Text>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { textAlign: language === "ar" ? "right" : "left" },
            ]}
          >
            {t("profile.accountSettings")}
          </Text>

          <SettingItem
            label={t("profile.language")}
            value={
              language === "en" ? t("profile.english") : t("profile.arabic")
            }
            onPress={toggleLanguage}
          />
          <SettingItem
            label={t("profile.editProfile")}
            onPress={() =>
              Alert.alert(t("common.info"), t("profile.editProfileInfo"))
            }
          />

          <SettingItem
            label={t("profile.notifications")}
            onPress={() =>
              Alert.alert(t("common.info"), t("profile.notificationsInfo"))
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle]}>{t("profile.favorites")}</Text>

          <View style={styles.favoritesInfo}>
            <Text style={styles.favoritesCount}>
              {favoriteEvents.length} {t("profile.events")}
            </Text>
            <TouchableOpacity
              style={styles.viewFavoritesButton}
              onPress={handleViewFavorites}
            >
              <Text style={styles.viewFavoritesButtonText}>
                {t("profile.viewAll")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle]}>
            {t("profile.appInformation")}
          </Text>

          <InfoItem label={t("profile.version")} value="1.0.0" />
          <InfoItem label={t("profile.build")} value="1" />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{t("auth.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeArea>
  );
}
