import CardMatch from '../components/CardMatch';
import MatchFilters, { MatchFilter } from '../components/MatchFilters';
import { UpdatedAgo } from '../components/UpdatedAgo';

import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { fetchMatches } from '../utils/fetchMatches';
import { MATCHES_URL } from '../config';

import type { Match } from '../types/types';
import { useFavorites } from '../hooks/useFavorites';

export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { isFavorite, toggle } = useFavorites();

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
      setLastUpdated(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  if (loading && matches === null) return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  )
  if (error && matches === null) return (
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

      <View style={styles.updateRow}>
        {lastUpdated && <UpdatedAgo since={lastUpdated} />}

        <Pressable
          style={styles.refreshButton}
          onPress={loadMatches}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? 'Обновление...' : 'Обновить'}
          </Text>
        </Pressable>
      </View>

      <MatchFilters filter={filter} onChange={setFilter} />

      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardMatch
            item={item}
            isFavorite={isFavorite}
            onToggleFavorite={toggle}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Матчей нет</Text>
        }
        refreshing={loading}
        onRefresh={loadMatches}
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
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  refreshButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    paddingVertical: 24,
  },
});
