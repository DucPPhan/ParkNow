import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, FlatList, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import ActivityCard, { Activity } from '../components/ActivityCard';
import api from '../services/api';

// state-held activities (fetched from API)
const initialActivities: Activity[] = [];

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ActivityScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  // 2. State để quản lý tab đang hoạt động
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFocused = useIsFocused();

  // Reload activities whenever this screen is focused (covers returning after cancel)
  useEffect(() => {
    if (isFocused) {
      loadActivities();
    }
  }, [isFocused]);
  
  // Lọc dữ liệu dựa trên tab được chọn
  const filteredData = useMemo(() => {
    if (activeTab === 'current') {
      // show ongoing and upcoming bookings
      return activities.filter(item => item.status === 'Đang diễn ra' || item.status === 'Đã đặt');
    }
    return activities.filter(item => item.status === 'Hoàn thành' || item.status === 'Đã hủy');
  }, [activeTab, activities]);

  // Mapping helper: map API booking status to local status string used by ActivityCard
  const mapApiStatus = (apiStatus: string) => {
    if (!apiStatus) return 'Đã đặt';
    const s = apiStatus.toLowerCase();
    if (s === 'cancel') return 'Đã hủy';
    if (s === 'check_in' || s === 'checkin' || s === 'check-in' || s === 'success') return 'Đang diễn ra';
    if (s === 'completed' || s === 'complete' || s === 'finished') return 'Hoàn thành';
    return 'Đã đặt';
  };

  // Parse ISO datetime to displayable date and time
  const formatDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
  };

  const formatTimeRange = (startIso?: string, endIso?: string) => {
    if (!startIso || !endIso) return '';
    const s = new Date(startIso);
    const e = new Date(endIso);
    const fmt = (dt: Date) => `${dt.getHours().toString().padStart(2,'0')}:${dt.getMinutes().toString().padStart(2,'0')}`;
    return `${fmt(s)} - ${fmt(e)}`;
  };

  // Fetch activities from API and map to local Activity shape
  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.bookingApi.getActivities();
      if (res.success && Array.isArray(res.data)) {
        const mapped: Activity[] = res.data.map((it: any) => {
          const booking = it.bookingSearchResult || {};
          const vehicle = it.vehicleInforSearchResult || {};
          const parking = it.parkingSearchResult || {};
          const slot = it.parkingSlotSearchResult || {};

          const bookingId = booking.bookingId?.toString() ?? Math.random().toString(36).slice(2,9);
          const start = booking.startTime;
          const end = booking.endTime;

          return {
            id: bookingId,
            orderId: `PKN${bookingId}`,
            userName: '',
            userRating: 0,
            vehicleType: vehicle.trafficId === 2 ? 'car' : 'motorcycle',
            date: formatDate(start || booking.dateBook),
            time: formatTimeRange(start, end),
            startTime: start ? new Date(start).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '',
            endTime: end ? new Date(end).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '',
            status: mapApiStatus(booking.status),
            rawStatus: booking.status,
            vehicleInfo: vehicle.vehicleName || '',
            vehicleLicensePlate: vehicle.licensePlate || '',
            parkingId: parking.parkingId || 0,
            parkingName: parking.name || '',
            parkingAddress: parking.address || '',
            slot: (slot.name || '').trim(),
            paymentMethod: '',
            prepaidHours: '',
            extraHours: '',
            total: 0,
          };
        });
        setActivities(mapped);
      } else {
        setError(res.message || 'Không có dữ liệu hoạt động.');
        setActivities([]);
      }
    } catch (err) {
      setError('Không thể tải hoạt động.');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hoạt động</Text>
      </View>

      {/* 3. Thanh chuyển đổi tab */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'current' && styles.tabButtonActive]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={[styles.tabText, activeTab === 'current' && styles.tabTextActive]}>Hiện tại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>Lịch sử</Text>
        </TouchableOpacity>
      </View>

      {/* 4. Hiển thị danh sách đã lọc */}
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <ActivityCard
            item={item}
            onPress={() => navigation.navigate('ActivityDetail', { activity: item })}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có hoạt động nào trong mục này.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  tabButtonActive: {
    backgroundColor: '#3498db',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  tabTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default ActivityScreen;