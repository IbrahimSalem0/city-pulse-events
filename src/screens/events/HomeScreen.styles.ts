import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  searchSection: {
    padding: SPACING.lg,
  },
  categoriesContainer: {
    marginBottom: SPACING.md,
  },
  categoryButton: {
    marginRight: SPACING.sm,
  },
  searchButton: {
    marginTop: SPACING.sm,
  },
  resultsSection: {
    padding: SPACING.lg,
  },
  resultsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  noResults: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  noResultsText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
});
