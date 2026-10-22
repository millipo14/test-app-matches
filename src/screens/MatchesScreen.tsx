import CardMatch from '../components/CardMatch';

import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import { Match } from '../types/types';
import { fetchMatches } from '../utils/fetchMatches';
import { MATCHES_URL } from '../config';
// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadMatches = async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await fetchMatches(MATCHES_URL);
      setMatches(data.matches);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  if (loading) return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  )
  if (error) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        Не удалось загрузить матчи
      </Text>

      <Pressable style={styles.retryButton} onPress={loadMatches}>
        <Text style={styles.retryButtonText}>Повторить</Text>
      </Pressable>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура</Text>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardMatch item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },

  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
