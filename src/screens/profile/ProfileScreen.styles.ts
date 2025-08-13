import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZES } from "../../constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: "center",
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: "bold",
    color: COLORS.background,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  section: {
    margin: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: "left",
  },
  favoritesInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
  },
  favoritesCount: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: "left",
  },
  viewFavoritesButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
  },
  viewFavoritesButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    textAlign: "center",
    padding: SPACING.xl,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    margin: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
});
