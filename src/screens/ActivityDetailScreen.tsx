// src/screens/ActivityDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/Feather';
import DottedLine from '../components/DottedLine';

type ActivityDetailScreenRouteProp = RouteProp<RootStackParamList, 'ActivityDetail'>;

const InfoDetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const ActivityDetailScreen = () => {
  const route = useRoute<ActivityDetailScreenRouteProp>();
  const { activity } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.ticketContainer}>
          {/* Phần trên của vé */}
          <View style={styles.ticketTop}>
            <Image source={activity.imageUrl} style={styles.image} />
            <Text style={styles.name}>{activity.name}</Text>
          </View>

          <DottedLine />

          {/* Phần giữa của vé */}
          <View style={styles.ticketMiddle}>
            <InfoDetailRow label="Biển số xe" value={activity.licensePlate} />
            <InfoDetailRow label="Loại xe" value={activity.vehicleType} />
            <InfoDetailRow label="Thời gian vào" value={`${activity.date} - 14:00`} />
            <InfoDetailRow label="Thời gian ra" value={`${activity.date} - 16:00`} />
            <InfoDetailRow label="Trạng thái" value={activity.status} />
          </View>
          
          <DottedLine />

          {/* Phần QR Code */}
          <View style={styles.qrContainer}>
            <Image source={require('../assets/image/home_banner.png')} style={styles.qrImage} />
            <Text style={styles.qrInstruction}>Đưa mã này cho nhân viên để xác nhận</Text>
          </View>
        </View>

        {/* Các nút hành động */}
        <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Lưu ảnh', 'Đã lưu vé vào thư viện ảnh!')}>
                <Icon name="download" size={20} color="#3498db" />
                <Text style={styles.actionText}>Lưu ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Chia sẻ', 'Chia sẻ vé thành công!')}>
                <Icon name="share-2" size={20} color="#3498db" />
                <Text style={styles.actionText}>Chia sẻ</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContainer: {
    padding: 20,
  },
  ticketContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketTop: {
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  ticketMiddle: {
    paddingVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  qrInstruction: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
  }
});

export default ActivityDetailScreen;