import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, Modal, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityDetailScreenRouteProp, BookingScreenNavigationProp } from '../navigation/types';

import RatingStars from '../components/RatingStars';
import InfoRow from '../components/InfoRow';
import Button from '../components/Button';
import api from '../services/api';

// Interface cho booking detail response từ API
interface BookingDetailData {
  bookingDetails: {
    bookingId: number;
    startTime: string;
    endTime: string;
    checkinTime: string | null;
    checkoutTime: string | null;
    status: string;
    guestName: string;
    guestPhone: string;
    totalPrice: number;
    qrImage: string;
    isRating: boolean;
  };
  user: {
    userId: number;
    name: string;
    phone: string;
  };
  vehicleInfor: {
    vehicleInforId: number;
    licensePlate: string;
    vehicleName: string;
    color: string;
  };
  parkingWithBookingDetailDto: {
    parkingId: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  parkingSlotWithBookingDetailDto: {
    parkingSlotId: number;
    name: string;
  };
  floorWithBookingDetailDto: {
    floorId: number;
    floorName: string;
  };
  transactionWithBookingDetailDtos: Array<{
    transactionId: number;
    price: number;
    status: string;
    paymentMethod: string;
    description: string;
  }>;
}

// Component con để code gọn gàng
const Section = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <View style={styles.sectionContainer}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    {children}
  </View>
);

const ActivityDetailScreen = () => {
  const route = useRoute<ActivityDetailScreenRouteProp>();
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const { bookingId, activity } = route.params;

  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<BookingDetailData | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (bookingId) {
      loadBookingDetail();
    } else if (activity) {
      // Fallback: sử dụng activity từ params (từ booking mới tạo)
      setLoading(false);
    }
  }, [bookingId]);

  const loadBookingDetail = async () => {
    try {
      setLoading(true);
      const result = await api.bookingApi.getBookedBookingDetail(Number(bookingId));
      
      if (result.success && result.data) {
        setBookingData(result.data);
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể tải thông tin booking');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading booking detail:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin booking');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDateTime = (isoString: string) => {
    return `${formatDate(isoString)} - ${formatTime(isoString)}`;
  };

  const getStatusInfo = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'cancel') return { text: 'Đã hủy', color: '#e74c3c', icon: 'close-circle' as const };
    if (s === 'success') return { text: 'Đã đặt', color: '#3498db', icon: 'checkmark-circle' as const };
    if (s === 'check_in' || s === 'checkin') return { text: 'Đang đỗ', color: '#f39c12', icon: 'time' as const };
    if (s === 'completed' || s === 'complete') return { text: 'Hoàn thành', color: '#2ecc71', icon: 'checkmark-circle' as const };
    return { text: status, color: '#95a5a6', icon: 'information-circle' as const };
  };

  const handleCancelBooking = () => {
    if (!bookingData) return;
    
    Alert.alert(
      'Xác nhận hủy',
      'Bạn có chắc chắn muốn hủy booking này không?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có, hủy',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              const result = await api.bookingApi.cancelBooking(bookingData.bookingDetails.bookingId);

              if (result.success) {
                Alert.alert('Thành công', 'Đã hủy booking thành công', [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                  }
                ]);
              } else {
                Alert.alert('Lỗi', result.message);
              }
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert('Lỗi', 'Không thể hủy booking');
            } finally {
              setCancelling(false);
            }
          }
        }
      ]
    );
  };

  const handleOpenMap = () => {
    if (!bookingData) return;
    const { latitude, longitude, address } = bookingData.parkingWithBookingDetailDto;
    const url = Platform.OS === 'ios' 
      ? `maps:0,0?q=${address}@${latitude},${longitude}`
      : `geo:0,0?q=${latitude},${longitude}(${address})`;
    Linking.openURL(url);
  };

  const handleContact = () => {
    Alert.alert('Liên hệ', 'Chức năng liên hệ đang được phát triển');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!bookingData && !activity) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text>Không tìm thấy thông tin hoạt động</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Sử dụng bookingData nếu có
  const details = bookingData?.bookingDetails;
  const user = bookingData?.user;
  const vehicle = bookingData?.vehicleInfor;
  const parking = bookingData?.parkingWithBookingDetailDto;
  const slot = bookingData?.parkingSlotWithBookingDetailDto;
  const floor = bookingData?.floorWithBookingDetailDto;
  const transactions = bookingData?.transactionWithBookingDetailDtos || [];
  
  const statusInfo = details ? getStatusInfo(details.status) : getStatusInfo(activity?.status || 'success');
  const canCancel = details?.status.toLowerCase() === 'success';
  const isCancelled = details?.status.toLowerCase() === 'cancel';
  
  // Xác định trạng thái chi tiết
  const statusLower = details?.status.toLowerCase() || '';
  const isSuccess = statusLower === 'success';
  const isCheckedIn = statusLower === 'check_in' || statusLower === 'checkin';
  const isCheckedOut = statusLower === 'check_out' || statusLower === 'checkout';
  const isCheckedOutOrCompleted = statusLower === 'completed' || statusLower === 'complete';

  // Xác định loại xe từ bookingData hoặc activity
  const vehicleType = vehicle!.vehicleName.toLowerCase().includes('xe máy') ? 'motorcycle' : 'car';

  const handleRebook = () => {
    if (!parking && !activity) return;
    navigation.navigate('Booking', {
      parkingId: parking?.parkingId || activity?.parkingId || 0,
      parkingName: parking?.name || activity?.parkingName || 'Bãi đỗ xe'
    });
  };

  const handleRatingSubmit = async () => {
    if (!bookingData || selectedRating === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn số sao đánh giá');
      return;
    }

    try {
      setSubmittingRating(true);
      const result = await api.bookingApi.submitRating(
        bookingData.bookingDetails.bookingId,
        bookingData.parkingWithBookingDetailDto.parkingId,
        selectedRating
      );
      if (result.success) {
        Alert.alert('Thành công', result.message || 'Đánh giá thành công!', [
          {
            text: 'OK',
            onPress: () => {
              // Refresh booking data để cập nhật isRating flag
              loadBookingDetail();
            }
          }
        ]);
      } else {
        Alert.alert('Lỗi', result.message || 'Đánh giá thất bại');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Lỗi', 'Không thể gửi đánh giá');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* === PHẦN 1: TRẠNG THÁI (Thay đổi dựa trên status) === */}
        <View style={[styles.container, styles.statusContainer]}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name={vehicleType === 'car' ? 'car-sport' : 'bicycle'}
              size={50}
              color={isCancelled ? '#95a5a6' : '#3498db'} // Màu xám nếu bị hủy
            />
            <View style={styles.checkIcon}>
              {isCancelled ? (
                <Ionicons name="close-circle" size={24} color="#e74c3c" /> // Dấu X đỏ
              ) : (
                <Ionicons name="checkmark-circle" size={24} color="#2ecc71" /> // Tích xanh
              )}
            </View>
          </View>
          {/* --- Trạng thái chi tiết dựa trên raw status --- */}
          <Text style={[styles.statusText, isCancelled && styles.statusTextCancelled]}>
            {isCancelled ? 'Đã hủy' : isCheckedOutOrCompleted ? 'Đã hoàn thành' : isCheckedIn ? 'Đã vào vị trí đỗ' : isSuccess ? 'Đang di chuyển đến bãi' : isCheckedOut ? 'Đã rời khỏi bãi' : details!.status}
          </Text>

          {/* --- Hiển thị hành động tương ứng --- */}
          {isCancelled ? (
            <View style={styles.cancelledInfoBox}>
              <Text style={styles.cancelledText}>Hoạt động này đã bị hủy.</Text>
              <Text style={styles.cancelledSubText}>Bạn không bị tính phí cho hoạt động này.</Text>
            </View>
          ) : isSuccess ? (
            // Success: show QR for check-in
            <View style={{ alignItems: 'center' }}>
              <Text style={{ marginBottom: 8 }}>Bạn đang di chuyển đến bãi. Mang mã QR để check-in khi đến nơi.</Text>
              <Button title="Hiển thị QR để check-in" onPress={() => setShowQr(true)} />
            </View>
          ) : isCheckedIn ? (
            // Checked in: show QR for check-out
            <View style={{ alignItems: 'center' }}>
              <Text style={{ marginBottom: 8 }}>Bạn đã vào vị trí đỗ. Hiện mã QR để check-out khi rời bãi.</Text>
              <Button title="Hiển thị QR để check-out" onPress={() => setShowQr(true)} />
            </View>
          ) : isCheckedOut ? (
            // Checked out
            <View style={{ alignItems: 'center' }}>
              <Text style={{ marginBottom: 8 }}>Bạn đã rời khỏi bãi</Text>
            </View>
          ) : isCheckedOutOrCompleted ? (
            // Completed
            <Text style={styles.statusCompletedText}>
              {details?.isRating ? 'Đã đánh giá' : 'Hoàn thành'}
            </Text>
          ) : (
            // Default status
            <Text style={styles.statusCompletedText}>Đã hoàn tất</Text>
          )}
        </View>

        {/* === PHẦN 2 & 3: THÔNG TIN & THANH TOÁN === */}
        <View style={[styles.container, { marginTop: 10 }]}>
          <Section>
            <InfoRow label="Mã đơn" value={details!.bookingId.toString()} isCopyable />
            <InfoRow label="Khách hàng" value={details!.guestName} />
            <InfoRow label="Biển số xe" value={vehicle!.licensePlate} />
            <InfoRow label="Loại xe" value={vehicle!.vehicleName} />
            {details!.checkinTime && (
              <InfoRow label="Thời gian vào thực tế" value={formatDateTime(details!.checkinTime)} />
            )}
            {details!.checkoutTime && (
              <InfoRow label="Thời gian ra thực tế" value={formatDateTime(details!.checkoutTime)} />
            )}
          </Section>

          <View style={styles.divider} />

          <Section>
            <View style={styles.parkingInfoRow}>
              <View style={styles.parkingTextContainer}>
                <Text style={styles.parkingName}>{parking!.name}</Text>
                <Text style={styles.parkingSlot}>Vị trí: {slot!.parkingSlotId}</Text>
                <Text style={styles.parkingAddress} numberOfLines={2}>{parking!.address}</Text>
              </View>
            </View>

            {/* --- Chỉ hiển thị thời gian nếu không bị hủy --- */}
            {!isCancelled && (
              <View style={styles.timeInfoRow}>
                <Ionicons name="hourglass-outline" size={70} color="gray" />
                <View style={styles.timeTextContainer}>
                  <Text style={styles.timeLabel}>Giờ vào: {formatDateTime(details!.startTime)}</Text>
                  <Text style={styles.timeLabel}>Giờ ra: {formatDateTime(details!.endTime)}</Text>
                </View>
              </View>
            )}
          </Section>

          <View style={styles.divider} />

          <Section title="Thông tin thanh toán">
            <InfoRow label="Phương thức" value={transactions!.map((item) => item.paymentMethod).join(', ')} />
            {/* <InfoRow label="Giờ đặt trước" value={details!.prepaidHours} />
            <InfoRow label="Thêm giờ" value={details!.extraHours} />
            <InfoRow label="Tổng cộng" value={`${details!.total.toLocaleString('vi-VN')}đ`} /> */}
          </Section>
        </View>

        {/* === PHẦN 4: NÚT BẤM === */}
        {/* QR Modal */}
        <Modal visible={showQr} transparent animationType="fade">
          <View style={styles.qrModalOverlay}>
            <View style={styles.qrModalContent}>
              <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Mã QR kiểm tra</Text>
              <View style={styles.qrPlaceholder}>
                {/** Use booking id as QR payload. Fallback to displaying id as text if QR lib not available */}
                {activity?.id ? (
                  <QRCode value={String(details!.bookingId)} size={200} />
                ) : (
                  <Text>{details!.bookingId || 'NO_ID'}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => setShowQr(false)} style={styles.qrCloseButton}>
                <Text style={{ color: 'white', fontWeight: '600' }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* === PHẦN: RATING (Chỉ hiện khi completed và chưa rating) === */}
        {isCheckedOutOrCompleted && bookingData && !bookingData.bookingDetails.isRating && (
          <View style={[styles.container, styles.ratingContainer]}>
            <Text style={styles.ratingTitle}>Đánh giá trải nghiệm của bạn</Text>
            <Text style={styles.ratingSubtitle}>Hãy cho chúng tôi biết cảm nhận của bạn về bãi đỗ xe</Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setSelectedRating(star)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= selectedRating ? 'star' : 'star-outline'}
                    size={40}
                    color={star <= selectedRating ? '#f39c12' : '#bdc3c7'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {selectedRating > 0 && (
              <Button
                title="Gửi đánh giá"
                onPress={handleRatingSubmit}
                loading={submittingRating}
                style={styles.submitRatingButton}
              />
            )}
          </View>
        )}

        <View style={[styles.container, styles.buttonContainer]}>
          {isCheckedIn ? (
            <Button
              title="Liên hệ"
              onPress={() => { }}
              type="secondary"
              style={{ flex: 1, marginRight: 10 }}
            />
          ) : canCancel ? (
            <>
              <Button
                title="Liên hệ"
                onPress={() => { }}
                type="secondary"
                style={{ flex: 1, marginRight: 10 }}
              />
              <Button
                title="Hủy booking"
                onPress={handleCancelBooking}
                loading={cancelling}
                type="cancel"
                style={{ flex: 1, marginRight: 10 }}
              />
            </>
          ) : (
            <>
              <Button
                title="Liên hệ"
                onPress={() => { }}
                type="secondary"
                style={{ flex: 1, marginRight: 10 }}
              />
              <Button
                title="Đặt lại"
                onPress={handleRebook}
                style={{ flex: 1 }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  scrollView: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7f8c8d',
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
  statusTextCancelled: {
    color: '#e74c3c', // Màu đỏ cho trạng thái hủy
  },
  statusCompletedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2ecc71',
    textAlign: 'center',
  },
  // Khung thông báo hủy
  cancelledInfoBox: {
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  cancelledText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#721c24',
    textAlign: 'center',
  },
  cancelledSubText: {
    fontSize: 14,
    color: '#721c24',
    textAlign: 'center',
    marginTop: 4,
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
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrCloseButton: {
    backgroundColor: '#00B14F',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  // Rating section styles
  ratingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starButton: {
    padding: 8,
  },
  submitRatingButton: {
    width: '100%',
    marginTop: 10,
  },
});

export default ActivityDetailScreen;