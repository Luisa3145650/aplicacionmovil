import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Q } from '@nozbe/watermelondb';
import { database } from '../../core/database/database';
import Task from '../../core/database/models/Task';

interface StatsCardsProps {
  userEmail: string;
}

export default function StatsCards({ userEmail }: StatsCardsProps) {
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const col = database.get<Task>('tasks');
    const userFilter = Q.where('user_id', userEmail);

    const s1 = col.query(userFilter).observeCount().subscribe(setTotal);
    const s2 = col.query(userFilter, Q.where('completed', false)).observeCount().subscribe(setPending);
    const s3 = col.query(userFilter, Q.where('completed', true)).observeCount().subscribe(setCompleted);

    return () => { s1.unsubscribe(); s2.unsubscribe(); s3.unsubscribe(); };
  }, [userEmail]);

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.totalCard]}>
        <Text style={styles.cardTitle}>TOTAL</Text>
        <Text style={[styles.cardValue, styles.totalText]}>{total}</Text>
      </View>
      <View style={[styles.card, styles.pendingCard]}>
        <Text style={styles.cardTitle}>PENDIENTES</Text>
        <Text style={[styles.cardValue, styles.pendingText]}>{pending}</Text>
      </View>
      <View style={[styles.card, styles.completedCard]}>
        <Text style={styles.cardTitle}>COMPLETADAS</Text>
        <Text style={[styles.cardValue, styles.completedText]}>{completed}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginVertical: 12 },
  card: { flex: 1, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 10, marginHorizontal: 4, elevation: 2, alignItems: 'center', borderWidth: 1 },
  totalCard: { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' },
  pendingCard: { backgroundColor: '#FFF7ED', borderColor: '#FFEDD5' },
  completedCard: { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' },
  cardTitle: { fontSize: 12, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', marginBottom: 6 },
  cardValue: { fontSize: 24, fontWeight: 'bold' },
  totalText: { color: '#2563EB' },
  pendingText: { color: '#EA580C' },
  completedText: { color: '#16A34A' },
});