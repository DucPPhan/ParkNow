import React, { useState, useMemo } from 'react';
import { StyleSheet, FlatList, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import ActivityCard, { Activity } from '../components/ActivityCard';

// 1. Thêm dữ liệu mẫu có trạng thái "Đang diễn ra"
const ACTIVITY_DATA: Activity[] = [
  {
    id: '4',
    vehicleType: 'motorcycle',
    date: '06/10/2025',
    time: '15:00 - 19:00',
    status: 'Đang diễn ra',
    vehicleInfo: 'Yamaha Exciter',
    vehicleLicensePlate: '77L - 111.22',
    parkingName: 'Landmark 81',
    parkingAddress: '720A Điện Biên Phủ, Bình Thạnh',
    slot: 'M08',
    orderId: 'PKN1234567',
    userName: 'Nguyễn Thị B',
    userRating: 0,
    startTime: '15:10',
    endTime: '19:00',
    paymentMethod: 'Ví ParkNow',
    prepaidHours: '4 giờ',
    extraHours: '0 giờ',
    total: 60000,
    parkingImageUrl: require('../assets/image/home_banner.png'),
  },
  {
    id: '1',
    orderId: 'PKN123456',
    userName: 'Lê Văn A',
    userRating: 4,
    vehicleType: 'car',
    date: '06/10/2025',
    time: '14:00 - 18:30',
    startTime: '14:05',
    endTime: '18:25',
    status: 'Hoàn thành',
    vehicleInfo: 'Toyota Vios',
    vehicleLicensePlate: '51H - 083.62',
    parkingName: 'Takashimaya',
    parkingAddress: '94 Nam Kỳ Khởi Nghĩa, Quận 1',
    slot: 'A45',
    paymentMethod: 'Ví ParkNow',
    prepaidHours: '4 giờ',
    extraHours: '0.5 giờ',
    total: 50000,
    parkingImageUrl: require('../assets/image/home_banner.png'),
  },
  {
    id: '2',
    vehicleType: 'motorcycle',
    date: '05/10/2025',
    time: '08:00 - 11:00',
    status: 'Đã hủy',
    vehicleInfo: 'Honda SH',
    vehicleLicensePlate: '59T - 123.45',
    parkingName: 'Bãi xe Ga Sài Gòn',
    parkingAddress: '1 Nguyễn Thông, Q. 3',
    slot: 'B12',
    orderId: 'PKN1234568',
    userName: 'Trần Văn C',
    userRating: 0,
    startTime: '08:00',
    endTime: '11:00',
    paymentMethod: 'Ví ParkNow',
    prepaidHours: '3 giờ',
    extraHours: '0 giờ',
    total: 45000,
    parkingImageUrl: require('../assets/image/home_banner.png'),
  },
  {
    id: '3',
    vehicleType: 'car',
    date: '04/10/2025',
    time: '19:00 - 22:00',
    status: 'Hoàn thành',
    vehicleInfo: 'Mazda CX-5',
    vehicleLicensePlate: '51K - 567.89',
    parkingName: 'Nowzone',
    parkingAddress: '235 Nguyễn Văn Cừ, Q. 5',
    slot: 'C03',
    orderId: 'PKN1234569',
    userName: 'Phạm Thị D',
    userRating: 5,
    startTime: '19:10',
    endTime: '22:00',
    paymentMethod: 'Ví ParkNow',
    prepaidHours: '3 giờ',
    extraHours: '0 giờ',
    total: 75000,
    parkingImageUrl: require('../assets/image/home_banner.png'),
  },
];

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ActivityScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  // 2. State để quản lý tab đang hoạt động
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  // Lọc dữ liệu dựa trên tab được chọn
  const filteredData = useMemo(() => {
    if (activeTab === 'current') {
      return ACTIVITY_DATA.filter(item => item.status === 'Đang diễn ra');
    }
    return ACTIVITY_DATA.filter(item => item.status === 'Hoàn thành' || item.status === 'Đã hủy');
  }, [activeTab]);

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
        keyExtractor={(item) => item.id}
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