import CardMatch from '../components/CardMatch';

import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import type { Match } from '../types/types';
import { fetchMatches } from '../utils/fetchMatches';
import { MATCHES_URL } from '../config';
// Экран «Матчи тура» — задание в README.md, часть 1.
type Filter = 'all' | 'upcoming' | 'finished';

export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const filteredMatches = matches?.filter((match) => {
    if (filter === 'finished') {
      return match.status === 'finished';
    }

    if (filter === 'upcoming') {
      return (
        match.status === 'scheduled' ||
        match.status === 'live' ||
        match.status === 'postponed'
      );
    }

    return true;
  });

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

      <View style={styles.filters}>
        <Pressable
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            Все
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterButton, filter === 'upcoming' && styles.activeFilter]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterText, filter === 'upcoming' && styles.activeFilterText]}>
            Предстоящие
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterButton, filter === 'finished' && styles.activeFilter]}
          onPress={() => setFilter('finished')}
        >
          <Text style={[styles.filterText, filter === 'finished' && styles.activeFilterText]}>
            Завершённые
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredMatches}
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
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },

  activeFilter: {
    backgroundColor: '#2563EB',
  },

  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  activeFilterText: {
    color: '#FFFFFF',
  },
});
