import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEvents, useCategories } from "../../hooks/useEvents";
import { useApp } from "../../store/AppContext";
import { DEFAULT_CITY, TOP_SPACING } from "../../constants";
import { SearchParams, Event } from "../../types";
import { RootStackParamList } from "../../navigation/types";
import {
  Loading,
  Error,
  Button,
  Input,
  EventCard,
  StatusBarSpacer,
} from "../../components";
import { styles } from "./HomeScreen.styles";

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EventDetails"
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState(DEFAULT_CITY);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: eventsData,
    isLoading,
    error,
    refetch,
  } = useEvents(searchParams);
  const { data: categories } = useCategories();
  const { language, updateLanguage, toggleFavorite, favoriteEvents } = useApp();

  // Memoized search function to prevent unnecessary re-renders
  const handleSearch = useCallback(() => {
    if (!keyword && !city) {
      Alert.alert(t("common.error"), t("errors.invalidSearch"));
      return;
    }

    setSearchParams({
      keyword: keyword.trim() || undefined,
      city: city.trim() || undefined,
      category: selectedCategory || undefined,
    });
  }, [keyword, city, selectedCategory, t]);

  // Memoized language toggle
  const toggleLanguage = useCallback(() => {
    const newLanguage = language === "en" ? "ar" : "en";
    updateLanguage(newLanguage);
  }, [language, updateLanguage]);

  // Memoized event press handler
  const handleEventPress = useCallback(
    (eventId: string) => {
      navigation.navigate("EventDetails", { eventId });
    },
    [navigation]
  );

  // Memoized favorite toggle
  const handleFavoriteToggle = useCallback(
    (eventId: string) => {
      toggleFavorite(eventId);
    },
    [toggleFavorite]
  );

  // Memoized category selection
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory((prev) => (prev === category ? "" : category));
  }, []);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  // Memoized events data
  const events = useMemo(() => {
    return eventsData?.data || [];
  }, [eventsData]);

  // Memoized render item for FlatList
  const renderEventItem = useCallback(
    ({ item }: { item: Event }) => (
      <EventCard
        event={item}
        onPress={() => handleEventPress(item.id)}
        onFavoritePress={() => handleFavoriteToggle(item.id)}
        isFavorite={favoriteEvents.includes(item.id)}
      />
    ),
    [handleEventPress, handleFavoriteToggle, favoriteEvents]
  );

  // Memoized category render item
  const renderCategoryItem = useCallback(
    ({ item }: { item: string }) => (
      <View
        style={[
          styles.categoryChip,
          selectedCategory === item && styles.categoryChipSelected,
        ]}
      >
        <Text
          style={[
            styles.categoryChipText,
            selectedCategory === item && styles.categoryChipTextSelected,
          ]}
          onPress={() => handleCategorySelect(item)}
        >
          {item}
        </Text>
      </View>
    ),
    [selectedCategory, handleCategorySelect]
  );

  // Memoized list header
  const renderListHeader = useCallback(
    () => (
      <View style={styles.listHeader}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("events.title")}</Text>
          <View style={styles.languageToggle}>
            <TouchableOpacity onPress={toggleLanguage}>
              <Text style={styles.languageText}>
                {language === "en" ? t("profile.arabic") : t("profile.english")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchSection}>
          <Input
            label={t("events.searchEvents")}
            placeholder={t("events.searchPlaceholder")}
            value={keyword}
            onChangeText={setKeyword}
          />

          <Input
            label={t("events.city")}
            placeholder={t("events.cityPlaceholder")}
            value={city}
            onChangeText={setCity}
          />

          {categories && categories.length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryLabel}>{t("events.category")}</Text>
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesList}
                contentContainerStyle={styles.categoriesContent}
              />
            </View>
          )}

          <Button
            title={t("events.searchButton")}
            onPress={handleSearch}
            variant="primary"
            size="large"
          />
        </View>

        {events.length > 0 && (
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {t("events.searchResults")}
              <Text style={styles.resultsCount}>
                {" "}
                ({eventsData?.total || 0})
              </Text>
            </Text>
          </View>
        )}
      </View>
    ),
    [
      keyword,
      city,
      categories,
      selectedCategory,
      events.length,
      eventsData,
      renderCategoryItem,
      handleSearch,
      language,
      toggleLanguage,
      t,
    ]
  );

  // Memoized empty state
  const renderEmptyComponent = useCallback(() => {
    if (isLoading) return null;
    if (searchParams.keyword || searchParams.city) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🔍</Text>
          <Text style={styles.emptyStateTitle}>
            {t("events.noEventsFound")}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.welcomeState}>
        <Text style={styles.welcomeStateIcon}>🎉</Text>
        <Text style={styles.welcomeStateTitle}>{t("events.welcomeTitle")}</Text>
        <Text style={styles.welcomeStateSubtitle}>
          {t("events.welcomeSubtitle")}
        </Text>
      </View>
    );
  }, [isLoading, searchParams, t]);

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: TOP_SPACING }]}>
        <StatusBarSpacer backgroundColor={styles.container.backgroundColor} />
        <Error message={error.message} onRetry={() => setSearchParams({})} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: TOP_SPACING }]}>
      <StatusBarSpacer backgroundColor={styles.container.backgroundColor} />

      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[styles.container.backgroundColor]}
            tintColor={styles.container.backgroundColor}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 200, // Approximate height of EventCard
          offset: 200 * index,
          index,
        })}
      />
    </View>
  );
}
