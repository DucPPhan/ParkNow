import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  SafeAreaView,
  Modal,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';

import Button from '../components/Button';
import { BookingScreenRouteProp, BookingScreenNavigationProp, Vehicle, BookingSlot } from '../navigation/types';
import api from '../services/api';

interface VehicleOption extends Vehicle {
  vehicleTypeId: number;
}

const BookingScreen: React.FC = () => {
  const route = useRoute<BookingScreenRouteProp>();
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const { parkingId, parkingName } = route.params;

  // State management
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(null);
  const [userVehicles, setUserVehicles] = useState<VehicleOption[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000)); // 2 hours later
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [pricing, setPricing] = useState<{ amount: number; breakdown: any } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  
  // Guest booking state
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestVehiclePlate, setGuestVehiclePlate] = useState('');
  const [guestVehicleType, setGuestVehicleType] = useState(1); // Default car type

  useEffect(() => {
    checkLoginStatus();
    loadUserVehicles();
  }, []);

  useEffect(() => {
    if (startDate && endDate && startDate < endDate) {
      loadAvailableSlots();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (selectedSlot && selectedVehicle && startDate && endDate) {
      calculatePricing();
    }
  }, [selectedSlot, selectedVehicle, startDate, endDate]);

  const checkLoginStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  const loadUserVehicles = async () => {
    if (!isLoggedIn) return;
    
    try {
      // This should be replaced with actual API call to get user vehicles
      // For now, using mock data
      const mockVehicles: VehicleOption[] = [
        {
          id: '1',
          name: 'Honda City',
          plate: '30A-12345',
          type: 'car',
          isDefault: true,
          vehicleTypeId: 1
        },
        {
          id: '2',
          name: 'Yamaha Exciter',
          plate: '30B-67890',
          type: 'motorcycle',
          isDefault: false,
          vehicleTypeId: 2
        }
      ];
      
      setUserVehicles(mockVehicles);
      if (mockVehicles.length > 0) {
        setSelectedVehicle(mockVehicles.find(v => v.isDefault) || mockVehicles[0]);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      setLoading(true);
      // Calculate desire hours from start and end time
      const durationMs = endDate.getTime() - startDate.getTime();
      const desireHour = Math.ceil(durationMs / (1000 * 60 * 60)); // Convert to hours and round up
      
      const result = await api.bookingApi.getAvailableSlots(
        parseInt(parkingId),
        startDate.toISOString(),
        desireHour
      );

      if (result.success) {
        setAvailableSlots(result.data || []);
        setSelectedSlot(null); // Reset selection when slots change
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error loading slots:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách chỗ đỗ');
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = async () => {
    if (!selectedSlot || !selectedVehicle) return;

    try {
      const result = await api.bookingApi.calculatePricing(
        parseInt(parkingId),
        selectedSlot.id,
        startDate.toISOString(),
        endDate.toISOString(),
        selectedVehicle.vehicleTypeId
      );

      if (result.success) {
        setPricing(result.data);
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error calculating pricing:', error);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot || (!selectedVehicle && !showGuestForm)) {
      Alert.alert('Thông báo', 'Vui lòng chọn đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      let result;

      if (showGuestForm || !isLoggedIn) {
        // Guest booking
        if (!guestName || !guestPhone || !guestVehiclePlate) {
          Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin khách');
          return;
        }

        result = await api.bookingApi.createGuestBooking({
          parkingId: parseInt(parkingId),
          slotId: selectedSlot.id,
          guestName,
          guestPhone,
          vehiclePlate: guestVehiclePlate,
          vehicleTypeId: guestVehicleType,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          paymentMethod,
          notes: notes || undefined,
        });
      } else {
        // User booking
        result = await api.bookingApi.createBooking({
          parkingId: parseInt(parkingId),
          slotId: selectedSlot.id,
          vehicleId: parseInt(selectedVehicle!.id),
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          paymentMethod,
          notes: notes || undefined,
        });
      }

      if (result.success) {
        Alert.alert(
          'Thành công',
          'Đặt chỗ thành công!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
                // Navigate to booking detail if needed
                // navigation.navigate('BookingDetail', { bookingId: result.data.id });
              }
            }
          ]
        );
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Lỗi', 'Không thể tạo booking');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = () => {
    const duration = Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return `${duration.toFixed(1)} giờ`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đặt chỗ đỗ xe</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Parking Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bãi đỗ xe</Text>
          <Text style={styles.parkingName}>{parkingName}</Text>
        </View>

        {/* User Type Selection */}
        {isLoggedIn && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loại đặt chỗ</Text>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[styles.userTypeButton, !showGuestForm && styles.userTypeButtonActive]}
                onPress={() => setShowGuestForm(false)}
              >
                <Text style={[styles.userTypeText, !showGuestForm && styles.userTypeTextActive]}>
                  Tài khoản của tôi
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.userTypeButton, showGuestForm && styles.userTypeButtonActive]}
                onPress={() => setShowGuestForm(true)}
              >
                <Text style={[styles.userTypeText, showGuestForm && styles.userTypeTextActive]}>
                  Đặt cho khách
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Vehicle Selection */}
        {!showGuestForm && isLoggedIn ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn xe</Text>
            {userVehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.vehicleItem,
                  selectedVehicle?.id === vehicle.id && styles.vehicleItemSelected
                ]}
                onPress={() => setSelectedVehicle(vehicle)}
              >
                <Ionicons
                  name={vehicle.type === 'car' ? 'car' : 'bicycle'}
                  size={24}
                  color={selectedVehicle?.id === vehicle.id ? '#2196F3' : '#666'}
                />
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehiclePlate}>{vehicle.plate}</Text>
                </View>
                {selectedVehicle?.id === vehicle.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Guest Information Form
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin khách</Text>
            <View style={styles.guestForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Họ tên</Text>
                <TextInput
                  style={styles.input}
                  value={guestName}
                  onChangeText={setGuestName}
                  placeholder="Nhập họ tên"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  value={guestPhone}
                  onChangeText={setGuestPhone}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Biển số xe</Text>
                <TextInput
                  style={styles.input}
                  value={guestVehiclePlate}
                  onChangeText={setGuestVehiclePlate}
                  placeholder="Nhập biển số xe"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Loại xe</Text>
                <View style={styles.vehicleTypeContainer}>
                  <TouchableOpacity
                    style={[styles.vehicleTypeButton, guestVehicleType === 1 && styles.vehicleTypeButtonActive]}
                    onPress={() => setGuestVehicleType(1)}
                  >
                    <Text style={[styles.vehicleTypeText, guestVehicleType === 1 && styles.vehicleTypeTextActive]}>
                      Ô tô
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.vehicleTypeButton, guestVehicleType === 2 && styles.vehicleTypeButtonActive]}
                    onPress={() => setGuestVehicleType(2)}
                  >
                    <Text style={[styles.vehicleTypeText, guestVehicleType === 2 && styles.vehicleTypeTextActive]}>
                      Xe máy
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời gian</Text>
          
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.timeLabel}>Thời gian bắt đầu</Text>
            <Text style={styles.timeValue}>{formatDate(startDate)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.timeLabel}>Thời gian kết thúc</Text>
            <Text style={styles.timeValue}>{formatDate(endDate)}</Text>
          </TouchableOpacity>

          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>Thời lượng: </Text>
            <Text style={styles.durationValue}>{formatDuration()}</Text>
          </View>
        </View>

        {/* Available Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn chỗ đỗ</Text>
          {loading ? (
            <Text style={styles.loadingText}>Đang tải...</Text>
          ) : (
            <View style={styles.slotsGrid}>
              {availableSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.slotItem,
                    selectedSlot?.id === slot.id && styles.slotItemSelected,
                    slot.status !== 'available' && styles.slotItemDisabled
                  ]}
                  onPress={() => slot.status === 'available' && setSelectedSlot(slot)}
                  disabled={slot.status !== 'available'}
                >
                  <Text style={[
                    styles.slotNumber,
                    selectedSlot?.id === slot.id && styles.slotNumberSelected
                  ]}>
                    {slot.slotNumber}
                  </Text>
                  <Text style={styles.slotPrice}>{slot.hourlyRate}k/h</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.paymentMethods}>
            {[
              { key: 'cash', label: 'Tiền mặt', icon: 'cash' },
              { key: 'card', label: 'Thẻ', icon: 'card' },
              { key: 'wallet', label: 'Ví điện tử', icon: 'wallet' }
            ].map((method) => (
              <TouchableOpacity
                key={method.key}
                style={[
                  styles.paymentMethod,
                  paymentMethod === method.key && styles.paymentMethodSelected
                ]}
                onPress={() => setPaymentMethod(method.key as any)}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={paymentMethod === method.key ? '#2196F3' : '#666'}
                />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === method.key && styles.paymentMethodTextSelected
                ]}>
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pricing Summary */}
        {pricing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi phí</Text>
            <View style={styles.pricingContainer}>
              <Text style={styles.totalAmount}>{pricing.amount.toLocaleString('vi-VN')} VND</Text>
            </View>
          </View>
        )}

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú (tùy chọn)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Nhập ghi chú..."
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Book Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Đặt chỗ"
            onPress={handleBooking}
            loading={loading}
            disabled={!selectedSlot || (!selectedVehicle && !showGuestForm)}
          />
        </View>

        {/* Date Time Pickers */}
        <Modal
          visible={showStartDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowStartDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn thời gian bắt đầu</Text>
                <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={startDate}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowStartDatePicker(false);
                  }
                  if (selectedDate) {
                    setStartDate(selectedDate);
                    // Auto adjust end time if needed
                    if (selectedDate >= endDate) {
                      setEndDate(new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000));
                    }
                  }
                }}
              />
              {Platform.OS === 'ios' && (
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowStartDatePicker(false)}
                  >
                    <Text style={styles.modalButtonText}>Xong</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={showEndDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowEndDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn thời gian kết thúc</Text>
                <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={endDate}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={startDate}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowEndDatePicker(false);
                  }
                  if (selectedDate) {
                    setEndDate(selectedDate);
                  }
                }}
              />
              {Platform.OS === 'ios' && (
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowEndDatePicker(false)}
                  >
                    <Text style={styles.modalButtonText}>Xong</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  parkingName: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: '600',
  },
  userTypeContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  userTypeButtonActive: {
    backgroundColor: '#2196F3',
  },
  userTypeText: {
    color: '#666',
    fontWeight: '600',
  },
  userTypeTextActive: {
    color: '#fff',
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  vehicleItemSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#f0f8ff',
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  vehiclePlate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  guestForm: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  vehicleTypeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  vehicleTypeButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  vehicleTypeText: {
    color: '#666',
    fontWeight: '600',
  },
  vehicleTypeTextActive: {
    color: '#fff',
  },
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 16,
    color: '#333',
  },
  timeValue: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  durationLabel: {
    fontSize: 14,
    color: '#666',
  },
  durationValue: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  slotItemSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  slotItemDisabled: {
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
  },
  slotNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  slotNumberSelected: {
    color: '#2196F3',
  },
  slotPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentMethod: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  paymentMethodSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    textAlign: 'center',
    flex: 1,
  },
  paymentMethodTextSelected: {
    color: '#2196F3',
  },
  pricingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 300,
    maxWidth: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BookingScreen;