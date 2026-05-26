import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput } from 'react-native';
import TaskList from '../components/TaskList';
import { useTaskStore, TaskFilter } from '../../useTaskStore';
import { syncTasks } from '../../../core/database/sync';
import AvatarView from '../../../shared/components/AvatarView';
import StatsCards from '../../../shared/components/StatsCards';
import CreateTaskModal from '../components/CreateTaskModal';
import { useAuthStore } from '../../../store/useAuthStore';

export const DashboardScreen = () => {
  const { filter, setFilter } = useTaskStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { currentUser, logout } = useAuthStore();
  const filters: TaskFilter[] = ['Todas', 'Pendientes', 'Completadas'];

  const userEmail = currentUser?.email ?? '';
  const userName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'Usuario';

  useEffect(() => {
    if (userEmail) syncTasks(userEmail);
  }, [userEmail]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola,</Text>
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
          </View>
          <View style={styles.headerRight}>
            <AvatarView name={userName} style={styles.avatar} />
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutButtonText}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>

        <StatsCards userEmail={userEmail} />

        <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar tarea..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#9CA3AF"
              />
        </View>

        <View style={styles.filtersContainer}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f && styles.filterButtonActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flex: 1, paddingBottom: 80 }}>
          <TaskList
              filter={filter}
              userEmail={userEmail}
              searchText={searchText}
          />
        </View>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>

        <CreateTaskModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          userEmail={userEmail}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  
  greeting: { fontSize: 16, color: '#6B7280' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#111827', maxWidth: 180 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 46, height: 46 },
  logoutButton: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutButtonText: { color: '#DC2626', fontSize: 12, fontWeight: '600' },
  filtersContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 10 },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#E5E7EB',
  },
  filterButtonActive: { backgroundColor: '#3B82F6' },
  filterText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: Platform.OS === 'ios' ? 32 : 36,
  },

  searchContainer: {
  paddingHorizontal: 16,
  marginBottom: 12,
},

searchInput: {
  backgroundColor: '#FFFFFF',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#D1D5DB',
  fontSize: 14,
  color: '#111827',
},
});