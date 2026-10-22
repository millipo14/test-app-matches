import { Pressable, StyleSheet, Text, View } from 'react-native';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

type MatchFiltersProps = {
    filter: MatchFilter;
    onChange: (filter: MatchFilter) => void;
};

export default function MatchFilters({
    filter,
    onChange,
}: MatchFiltersProps) {
    return (
        <View style={styles.filters}>
            <Pressable
                style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
                onPress={() => onChange('all')}
            >
                <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
                    Все
                </Text>
            </Pressable>

            <Pressable
                style={[styles.filterButton, filter === 'upcoming' && styles.activeFilter]}
                onPress={() => onChange('upcoming')}
            >
                <Text style={[styles.filterText, filter === 'upcoming' && styles.activeFilterText]}>
                    Предстоящие
                </Text>
            </Pressable>

            <Pressable
                style={[styles.filterButton, filter === 'finished' && styles.activeFilter]}
                onPress={() => onChange('finished')}
            >
                <Text style={[styles.filterText, filter === 'finished' && styles.activeFilterText]}>
                    Завершённые
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
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