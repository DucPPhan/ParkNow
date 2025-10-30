import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Định nghĩa các kiểu dữ liệu cho props
export interface Activity {
  id: number;
  orderId: string; // Thêm
  parkingId: number; // Thêm
  userName: string; // Thêm
  userRating: number; // Thêm
  vehicleType: 'car' | 'motorcycle';
  date: string;
  time: string;
  startTime: string; // Thêm
  endTime: string; // Thêm
  // thêm 'Đã đặt' để biểu diễn booking vừa được tạo (success) khác với hoàn thành
  status: 'Hoàn thành' | 'Đã hủy' | 'Đang diễn ra' | 'Đã đặt';
  // raw status string returned from backend (e.g. 'Success', 'Check_In', 'Cancel')
  rawStatus?: string;
  vehicleInfo: string;
  vehicleLicensePlate: string;
  parkingName: string;
  parkingAddress: string;
  slot: string;
  paymentMethod: string; // Thêm
  prepaidHours: string; // Thêm
  extraHours: string; // Thêm
  total: number; // Thêm
  parkingImageUrl?: any; // Thêm
}

interface ActivityCardProps {
  item: Activity;
  onPress: () => void;
}

// Component cho tag trạng thái (status)
const StatusTag = ({ status }: { status: Activity['status'] }) => {
  const statusStyle = {
    backgroundColor:
      status === 'Hoàn thành'
        ? '#d4edda' // Green
        : status === 'Đã hủy'
          ? '#f8d7da' // Red
          : status === 'Đang diễn ra'
            ? '#cce5ff' // Blue
            : '#fff3cd', // Đã đặt -> yellow
    color:
      status === 'Hoàn thành'
        ? '#155724'
        : status === 'Đã hủy'
          ? '#721c24'
          : status === 'Đang diễn ra'
            ? '#004085'
            : '#856404',
  };

  return (
    <View style={[styles.statusContainer, { backgroundColor: statusStyle.backgroundColor }]}>
      <Text style={[styles.statusText, { color: statusStyle.color }]}>{status}</Text>
    </View>
  );
};

const ActivityCard = ({ item, onPress }: ActivityCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {/* === PHẦN TRÊN === */}
      <View style={styles.topSection}>
        {/* Icon phương tiện */}
        <View style={styles.iconContainer}>
          <Ionicons
            name={item.vehicleType === 'car' ? 'car-sport' : 'bicycle'}
            size={32}
            color="#3498db"
          />
        </View>

        {/* Thông tin chính */}
        <View style={styles.mainInfo}>
          <View style={styles.timeStatusRow}>
            <Text style={styles.dateTime}>{`${item.date} | ${item.time}`}</Text>
            <StatusTag status={item.status} />
          </View>
          <Text style={styles.vehicleInfo}>{`${item.vehicleInfo} / ${item.vehicleLicensePlate}`}</Text>
        </View>
      </View>

      {/* Đường kẻ phân cách */}
      <View style={styles.divider} />

      {/* === PHẦN DƯỚI === */}
      <View style={styles.bottomSection}>
        <Text style={styles.parkingName} numberOfLines={1}>{`${item.parkingName} - ${item.parkingAddress}`}</Text>
        <Text style={styles.slotInfo}>Parking: {item.slot}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#eaf5ff',
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
  },
  mainInfo: {
    flex: 1,
  },
  timeStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateTime: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  vehicleInfo: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  bottomSection: {},
  parkingName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  slotInfo: {
    fontSize: 14,
    color: 'gray',
  },
});

export default ActivityCard;