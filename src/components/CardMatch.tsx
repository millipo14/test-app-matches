
import { StyleSheet, Text, View } from 'react-native';
import type { Match } from '../types/types';

interface CardMatchProps {
    item: Match;
}

const statusLabels: Record<Match['status'], string> = {
    finished: 'Завершён',
    live: 'В прямом эфире',
    scheduled: 'Предстоящий',
    postponed: 'Перенесён',
};

export default function CardMatch({ item }: CardMatchProps) {
    const date = item.startsAt
        ? new Date(item.startsAt).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        })
        : null;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.teams}>
                    <Text style={styles.teamName} numberOfLines={1}>
                        {item.home.name}
                    </Text>

                    <Text style={styles.vs}>—</Text>

                    <Text style={styles.teamName} numberOfLines={1}>
                        {item.away.name}
                    </Text>
                </View>

                {item.score !== null && (
                    <Text style={styles.score}>
                        {item.score.home} : {item.score.away}
                    </Text>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.date}>
                    {date ?? 'Дата и время не указаны'}
                </Text>

                <Text style={[styles.status, styles[item.status]]}>
                    {statusLabels[item.status]}
                    {item.status === 'live' && item.minute != null
                        ? ` · ${item.minute}'`
                        : ''}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    teams: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    teamName: {
        flexShrink: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
    },
    vs: {
        fontSize: 14,
        color: '#94A3B8',
    },
    score: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    footer: {
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
    },
    date: {
        fontSize: 12,
        color: '#64748B',
    },
    status: {
        fontSize: 12,
        fontWeight: '600',
    },
    finished: {
        color: '#15803D',
    },
    live: {
        color: '#DC2626',
    },
    scheduled: {
        color: '#2563EB',
    },
    postponed: {
        color: '#B45309',
    },
});
