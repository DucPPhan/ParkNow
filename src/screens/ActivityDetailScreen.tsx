import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityDetailScreenRouteProp } from '../navigation/types';

// Import các component mới
import RatingStars from '../components/RatingStars';
import InfoRow from '../components/InfoRow';
import Button from '../components/Button';

// Component con để code gọn gàng
const Section = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <View style={styles.sectionContainer}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    {children}
  </View>
);

const ActivityDetailScreen = () => {
  const route = useRoute<ActivityDetailScreenRouteProp>();
  const { activity } = route.params;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* === PHẦN 1: TRẠNG THÁI === */}
        <View style={[styles.container, styles.statusContainer]}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name={activity.vehicleType === 'car' ? 'car-sport' : 'bicycle'}
              size={50}
              color="#3498db"
            />
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
            </View>
          </View>
          <Text style={styles.statusText}>{activity.status}</Text>
          <RatingStars rating={activity.userRating} size={28} />
        </View>

        {/* === PHẦN 2 & 3: THÔNG TIN & THANH TOÁN === */}
        <View style={[styles.container, { marginTop: 10 }]}>
          <Section>
            <InfoRow label="Mã đơn" value={activity.orderId} isCopyable />
            <InfoRow label="Khách hàng" value={activity.userName} />
            <InfoRow label="Biển số xe" value={activity.vehicleLicensePlate} />
            <InfoRow label="Loại xe" value={activity.vehicleInfo} />
          </Section>

          <View style={styles.divider} />

          <Section>
            <View style={styles.parkingInfoRow}>
              <Image source={activity.parkingImageUrl} style={styles.parkingImage} />
              <View style={styles.parkingTextContainer}>
                <Text style={styles.parkingName}>{activity.parkingName}</Text>
                <Text style={styles.parkingSlot}>Vị trí: {activity.slot}</Text>
                <Text style={styles.parkingAddress} numberOfLines={2}>{activity.parkingAddress}</Text>
              </View>
            </View>
            <View style={styles.timeInfoRow}>
              <Ionicons name="hourglass-outline" size={70} color="gray" />
              <View style={styles.timeTextContainer}>
                <Text style={styles.timeLabel}>Giờ vào:</Text>
                <Text style={styles.timeLabel}>{activity.startTime} - {activity.date}</Text>
                <Text style={styles.timeLabel}>Giờ ra:</Text>
                <Text style={styles.timeLabel}>{activity.endTime} - {activity.date}</Text>
              </View>
            </View>
          </Section>

          <View style={styles.divider} />

          <Section title="Thông tin thanh toán">
            <InfoRow label="Phương thức" value={activity.paymentMethod} />
            <InfoRow label="Giờ đặt trước" value={activity.prepaidHours} />
            <InfoRow label="Thêm giờ" value={activity.extraHours} />
            <InfoRow label="Tổng cộng" value={`${activity.total.toLocaleString('vi-VN')}đ`} />
          </Section>
        </View>

        {/* === PHẦN 4: NÚT BẤM === */}
        <View style={[styles.container, styles.buttonContainer]}>
          <Button title="Liên hệ" onPress={() => { }} type="secondary" style={{ flex: 1, marginRight: 10 }} />
          <Button title="Đặt lại" onPress={() => { }} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
// ... Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  // Phần 1
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaf5ff',
    borderRadius: 40,
    marginBottom: 12,
  },
  checkIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 8,
  },
  // Phần 2 & 3
  sectionContainer: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  parkingInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  parkingImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  parkingTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  parkingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  parkingSlot: {
    fontSize: 14,
    color: '#3498db',
    marginVertical: 2,
  },
  parkingAddress: {
    fontSize: 14,
    color: 'gray',
  },
  timeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  timeTextContainer: {
    marginLeft: 12,
  },
  timeLabel: {
    fontSize: 16,
    color: '#333',
  },
  // Phần 4
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
  },
});

export default ActivityDetailScreen;