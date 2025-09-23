// src/screens/ActivityScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import ActivityCard from '../components/ActivityCard';
import { useNavigation } from '@react-navigation/native';
import { ActivityScreenNavigationProp } from '../navigation/types';

// 1. Định nghĩa một kiểu chung cho các mục hoạt động
export type ActivityItem = {
    id: string;
    name: string;
    date: string;
    time: string;
    status: 'Sắp tới' | 'Hoàn thành' | 'Đã hủy';
    imageUrl: any;
    licensePlate: string;
    vehicleType: string;
};

// 2. Áp dụng kiểu chung cho các mảng dữ liệu
// src/screens/ActivityScreen.tsx
// ...
const UPCOMING_DATA: ActivityItem[] = [
  { id: '1', name: 'Bãi xe Ga Sài Gòn', date: '24/09/2025', time: '14:00 - 16:00', status: 'Sắp tới', imageUrl: require('../assets/image/home_banner.png'), licensePlate: '51A-123.45', vehicleType: 'Ô tô'},
];

const HISTORY_DATA: ActivityItem[] = [
  { id: '2', name: 'Bãi xe Nowzone', date: '15/09/2025', time: '09:00 - 11:30', status: 'Hoàn thành', imageUrl: require('../assets/image/home_banner.png'), licensePlate: '72D-543.21', vehicleType: 'Xe máy'},
  { id: '3', name: 'Bãi xe Dinh Độc Lập', date: '12/09/2025', time: '18:00 - 20:00', status: 'Đã hủy', imageUrl: require('../assets/image/home_banner.png'), licensePlate: '51A-123.45', vehicleType: 'Ô tô'},
  { id: '4', name: 'Sân bay Tân Sơn Nhất', date: '05/09/2025', time: '07:00 - 17:00', status: 'Hoàn thành', imageUrl: require('../assets/image/home_banner.png'), licensePlate: '51A-123.45', vehicleType: 'Ô tô'},
];

type TabType = 'Upcoming' | 'History';

const ActivityScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Upcoming');
  const navigation = useNavigation<ActivityScreenNavigationProp>();

  const renderList = () => (
    // 3. Nói rõ cho FlatList biết kiểu dữ liệu nó sẽ nhận
    <FlatList<ActivityItem>
      data={activeTab === 'Upcoming' ? UPCOMING_DATA : HISTORY_DATA}
      renderItem={({ item }) => (
        <ActivityCard
          item={item}
          onPress={() => navigation.navigate('ActivityDetail', { activity: item })}
        />
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có hoạt động nào.</Text>
        </View>
      }
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Hoạt động</Text>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('Upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>Sắp tới</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'History' && styles.activeTab]}
            onPress={() => setActiveTab('History')}
          >
            <Text style={[styles.tabText, activeTab === 'History' && styles.activeTabText]}>Lịch sử</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        {renderList()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3498db',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  activeTabText: {
    color: '#ffffff',
  },
  listContainer: {
    paddingTop: 10,
  },
  emptyContainer: {
      flex: 1,
      marginTop: 100,
      alignItems: 'center',
      justifyContent: 'center',
  },
  emptyText: {
      fontSize: 16,
      color: '#888',
  }
});

export default ActivityScreen;