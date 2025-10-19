import React, { useState, useEffect, use } from 'react';
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
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [pricing, setPricing] = useState<{ amount: number; breakdown: any } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Guest booking state (only for non-logged in users)
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestVehiclePlate, setGuestVehiclePlate] = useState('');
  const [guestVehicleType, setGuestVehicleType] = useState(1); // Default car type

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    // Load vehicles when login status changes
    if (isLoggedIn) {
      loadUserVehicles();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (startDate && endDate && startDate < endDate) {
      loadAvailableSlots();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    // Calculate pricing when slot is selected and either:
    // - User has selected vehicle (for logged in user booking)
    // - Guest has selected vehicle type (for guest booking)
    if (selectedSlot && startDate && endDate) {
      if (isLoggedIn ? selectedVehicle : true) {
        calculatePricing();
      }
    }
  }, [selectedSlot, selectedVehicle, startDate, endDate, guestVehicleType, isLoggedIn]);

  const checkLoginStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      setIsLoggedIn(!!token);
      
      // Nếu đã đăng nhập, lấy thông tin user để có userId
      if (token) {
        const profileResult = await api.getUserProfile();
        if (profileResult.success && profileResult.data) {
          setUserId(profileResult.data.userId || profileResult.data.id);
          setUserProfile(profileResult.data);
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  const loadUserVehicles = async () => {
    try {
      console.log('📱 Loading user vehicles...');
      const result = await api.vehicleApi.getUserVehicles();
      
      console.log('📱 Vehicle API result:', result);
      
      if (result.success && result.data) {
        // Map API data to VehicleOption format
        const mappedVehicles: VehicleOption[] = result.data.map((vehicle: any) => ({
          id: vehicle.vehicleInforId?.toString() || vehicle.id?.toString(),
          name: vehicle.vehicleName || 'Xe chưa đặt tên',
          plate: vehicle.licensePlate || '',
          type: vehicle.trafficName === 'Xe máy' ? 'motorcycle' : 'car',
          isDefault: vehicle.isDefault || false,
          vehicleTypeId: vehicle.trafficId || (vehicle.type === 'motorcycle' ? 1 : 2),
        }));
        
        console.log('📱 Mapped vehicles:', mappedVehicles);
        setUserVehicles(mappedVehicles);
        
        // Auto select default vehicle or first vehicle
        if (mappedVehicles.length > 0) {
          const defaultVehicle = mappedVehicles.find(v => v.isDefault) || mappedVehicles[0];
          setSelectedVehicle(defaultVehicle);
          console.log('📱 Selected default vehicle:', defaultVehicle);
        }
      } else {
        console.log('❌ Failed to load vehicles:', result.message);
        // Set empty array if failed
        setUserVehicles([]);
      }
    } catch (error) {
      console.error('❌ Error loading vehicles:', error);
      setUserVehicles([]);
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

      if (result.success && result.data) {
        // Map API response to BookingSlot format
        const mappedSlots: BookingSlot[] = result.data.map((slot: any) => ({
          id: slot.parkingSlotId,
          slotNumber: slot.name,
          status: slot.isAvailable ? 'available' : 'occupied',
          vehicleType: 'car', // Default, can be enhanced based on your needs
          hourlyRate: slot.hourlyRate || 15, // Default rate if not provided
          rowIndex: slot.rowIndex,
          columnIndex: slot.columnIndex,
          isAvailable: slot.isAvailable,
          floorId: slot.floorId,
          trafficId: slot.trafficId,
        }));
        
        setAvailableSlots(mappedSlots);
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
    if (!selectedSlot) return;

    try {
      // Determine traffic ID based on whether it's guest booking or user booking
      let trafficId: number;
      
      if (!isLoggedIn) {
        // Guest booking - use selected guest vehicle type
        trafficId = guestVehicleType;
      } else if (selectedVehicle) {
        // User booking - use vehicle's traffic ID
        trafficId = selectedVehicle.vehicleTypeId;
      } else {
        // No vehicle selected yet
        console.warn('No vehicle selected');
        return;
      }

      // Calculate desire hours from start and end time
      const durationMs = endDate.getTime() - startDate.getTime();
      const desiredHour = Math.ceil(durationMs / (1000 * 60 * 60)); // Convert to hours and round up

      console.log('💰 Calculating pricing with params:', {
        parkingId: parseInt(parkingId),
        startTimeBooking: startDate.toISOString(),
        desiredHour,
        trafficId
      });

      const result = await api.bookingApi.calculatePricing(
        parseInt(parkingId),
        startDate.toISOString(),
        desiredHour,
        trafficId
      );

      if (result.success) {
        console.log('💰 Pricing result:', result.data);
        // API có thể trả về data với cấu trúc khác nhau
        // Có thể là { amount: 50000 } hoặc { price: 50000 } hoặc trực tiếp là số
        const pricingData = {
          amount: result.data?.amount || result.data?.price || result.data?.totalPrice || result.data || 0,
          breakdown: result.data?.breakdown || result.data
        };
        console.log('💰 Processed pricing data:', pricingData);
        setPricing(pricingData);
      } else {
        console.warn('💰 Pricing failed:', result.message);
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error calculating pricing:', error);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      Alert.alert('Thông báo', 'Vui lòng chọn chỗ đỗ');
      return;
    }

    if (isLoggedIn && !selectedVehicle) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương tiện');
      return;
    }

    try {
      setLoading(true);
      let result;

      if (!isLoggedIn) {
        // Guest booking (only for non-logged in users)
        if (!guestName || !guestPhone || !guestVehiclePlate) {
          Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin khách');
          setLoading(false);
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
        if (!userId) {
          Alert.alert('Lỗi', 'Không thể xác định thông tin người dùng.');
          setLoading(false);
          return;
        }
        
        result = await api.bookingApi.createBooking({
          parkingSlotId: selectedSlot.id,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          dateBook: startDate.toISOString(), // Ngày đặt = ngày bắt đầu
          paymentMethod,
          vehicleInforId: parseInt(selectedVehicle!.id),
          userId: userId,
          guestName: userProfile.fullName,
          guestPhone: userProfile.phone
        }, ''); // deviceTokenMobile để trống hoặc có thể lấy từ expo-notifications
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
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = () => {
    const duration = Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return `${duration.toFixed(1)} giờ`;
  };

  const handleTimeChange = (isStartTime: boolean, event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      if (isStartTime) {
        setShowStartTimePicker(false);
      } else {
        setShowEndTimePicker(false);
      }
    }

    if (event.type === 'set' && selectedTime) {
      const targetDate = isStartTime ? startDate : endDate;
      const newDate = new Date(targetDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);

      if (isStartTime) {
        setStartDate(newDate);
        // Auto adjust end time if needed
        if (newDate >= endDate) {
          const newEndDate = new Date(newDate.getTime() + 2 * 60 * 60 * 1000);
          setEndDate(newEndDate);
        }
      } else {
        setEndDate(newDate);
      }
    }
  };

  // Tổ chức slots theo grid layout dựa trên rowIndex và columnIndex
  const organizeSlotsByGrid = () => {
    if (!availableSlots.length) return [];

    // Tìm max row và column
    const maxRow = Math.max(...availableSlots.map(s => s.rowIndex || 0));
    const maxCol = Math.max(...availableSlots.map(s => s.columnIndex || 0));

    // Tạo grid 2D
    const grid: (BookingSlot | null)[][] = [];
    for (let i = 0; i <= maxRow; i++) {
      grid[i] = new Array(maxCol + 1).fill(null);
    }

    // Điền slots vào đúng vị trí
    availableSlots.forEach(slot => {
      const row = slot.rowIndex || 0;
      const col = slot.columnIndex || 0;
      grid[row][col] = slot;
    });

    return grid;
  };

  const slotGrid = organizeSlotsByGrid();

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

        {/* Guest Mode Notice */}
        {!isLoggedIn && (
          <View style={styles.noticeContainer}>
            <Ionicons name="information-circle" size={20} color="#FF9800" />
            <Text style={styles.noticeText}>
              Bạn đang đặt chỗ với tư cách khách. Đăng nhập để quản lý booking dễ dàng hơn.
            </Text>
          </View>
        )}

        {/* Vehicle Selection - Only show for logged in users */}
        {isLoggedIn ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn xe</Text>
            {userVehicles.length > 0 ? (
              userVehicles.map((vehicle) => (
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
              ))
            ) : (
              <Text style={styles.emptyText}>Chưa có phương tiện. Vui lòng thêm phương tiện trước.</Text>
            )}
          </View>
        ) : null}

        {/* Guest Information Form - Only show for non-logged in users */}
        {!isLoggedIn && (
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
                    key="car"
                    style={[styles.vehicleTypeButton, guestVehicleType === 1 && styles.vehicleTypeButtonActive]}
                    onPress={() => setGuestVehicleType(1)}
                  >
                    <Text style={[styles.vehicleTypeText, guestVehicleType === 1 && styles.vehicleTypeTextActive]}>
                      Ô tô
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    key="motorcycle"
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
          
          {/* Start Time */}
          <View style={styles.timeRow}>
            <Text style={styles.timeRowLabel}>Bắt đầu:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color="#2196F3" />
              <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Ionicons name="time-outline" size={18} color="#2196F3" />
              <Text style={styles.timeButtonText}>{formatTime(startDate)}</Text>
            </TouchableOpacity>
          </View>

          {/* End Time */}
          <View style={styles.timeRow}>
            <Text style={styles.timeRowLabel}>Kết thúc:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color="#2196F3" />
              <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Ionicons name="time-outline" size={18} color="#2196F3" />
              <Text style={styles.timeButtonText}>{formatTime(endDate)}</Text>
            </TouchableOpacity>
          </View>

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
          ) : availableSlots.length === 0 ? (
            <Text style={styles.emptyText}>Không có chỗ đỗ khả dụng</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.parkingGridContainer}>
                {/* Legend */}
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendBox, styles.legendAvailable]} />
                    <Text style={styles.legendText}>Trống</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendBox, styles.legendSelected]} />
                    <Text style={styles.legendText}>Đã chọn</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendBox, styles.legendOccupied]} />
                    <Text style={styles.legendText}>Đã đặt</Text>
                  </View>
                </View>

                {/* Grid Layout */}
                {slotGrid.map((row, rowIndex) => (
                  <View key={`row-${rowIndex}`} style={styles.gridRow}>
                    {row.map((slot, colIndex) => {
                      if (!slot) {
                        // Empty space
                        return (
                          <View
                            key={`empty-${rowIndex}-${colIndex}`}
                            style={styles.emptySlot}
                          />
                        );
                      }

                      const isAvailable = slot.isAvailable !== false && slot.status === 'available';
                      const isSelected = selectedSlot?.id === slot.id;

                      return (
                        <TouchableOpacity
                          key={slot.id}
                          style={[
                            styles.gridSlotItem,
                            isAvailable && styles.gridSlotAvailable,
                            isSelected && styles.gridSlotSelected,
                            !isAvailable && styles.gridSlotOccupied
                          ]}
                          onPress={() => isAvailable && setSelectedSlot(slot)}
                          disabled={!isAvailable}
                        >
                          <Text
                            style={[
                              styles.gridSlotNumber,
                              isSelected && styles.gridSlotNumberSelected,
                              !isAvailable && styles.gridSlotNumberDisabled
                            ]}
                          >
                            {slot.slotNumber?.trim()}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.paymentMethods}>
            {[
              { key: 'cash', label: 'Tiền mặt', icon: 'cash', enabled: true },
              { key: 'card', label: 'Thẻ', icon: 'card', enabled: false },
              { key: 'wallet', label: 'Ví điện tử', icon: 'wallet', enabled: false }
            ].map((method) => (
              <TouchableOpacity
                key={method.key}
                style={[
                  styles.paymentMethod,
                  paymentMethod === method.key && styles.paymentMethodSelected,
                  !method.enabled && styles.paymentMethodDisabled
                ]}
                onPress={() => {
                  if (method.enabled) {
                    setPaymentMethod(method.key as any);
                  } else {
                    Alert.alert(
                      'Thông báo',
                      'Phương thức thanh toán này sẽ được cập nhật trong tương lai.'
                    );
                  }
                }}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={!method.enabled ? '#ccc' : (paymentMethod === method.key ? '#2196F3' : '#666')}
                />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === method.key && styles.paymentMethodTextSelected,
                  !method.enabled && styles.paymentMethodTextDisabled
                ]}>
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pricing Summary */}
        {pricing && pricing.amount !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi phí</Text>
            <View style={styles.pricingContainer}>
              <Text style={styles.totalAmount}>
                {(pricing.amount || 0).toLocaleString('vi-VN')} VND
              </Text>
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
            title={!isLoggedIn ? "Đặt chỗ (Khách)" : "Đặt chỗ"}
            onPress={handleBooking}
            loading={loading}
            disabled={
              !selectedSlot || 
              (isLoggedIn ? !selectedVehicle : (!guestName || !guestPhone || !guestVehiclePlate))
            }
          />
        </View>

        {/* Date Pickers */}
        {Platform.OS === 'ios' ? (
          <>
            {showStartDatePicker && (
              <Modal
                visible={showStartDatePicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowStartDatePicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Chọn ngày bắt đầu</Text>
                      <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          const newDate = new Date(selectedDate);
                          newDate.setHours(startDate.getHours());
                          newDate.setMinutes(startDate.getMinutes());
                          setStartDate(newDate);
                        }
                      }}
                    />
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setShowStartDatePicker(false)}
                      >
                        <Text style={styles.modalButtonText}>Xong</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {showEndDatePicker && (
              <Modal
                visible={showEndDatePicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowEndDatePicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Chọn ngày kết thúc</Text>
                      <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      display="spinner"
                      minimumDate={startDate}
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          const newDate = new Date(selectedDate);
                          newDate.setHours(endDate.getHours());
                          newDate.setMinutes(endDate.getMinutes());
                          setEndDate(newDate);
                        }
                      }}
                    />
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setShowEndDatePicker(false)}
                      >
                        <Text style={styles.modalButtonText}>Xong</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {showStartTimePicker && (
              <Modal
                visible={showStartTimePicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowStartTimePicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Chọn giờ bắt đầu</Text>
                      <TouchableOpacity onPress={() => setShowStartTimePicker(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={startDate}
                      mode="time"
                      display="spinner"
                      onChange={(event, selectedTime) => {
                        handleTimeChange(true, event, selectedTime);
                      }}
                    />
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setShowStartTimePicker(false)}
                      >
                        <Text style={styles.modalButtonText}>Xong</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {showEndTimePicker && (
              <Modal
                visible={showEndTimePicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowEndTimePicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Chọn giờ kết thúc</Text>
                      <TouchableOpacity onPress={() => setShowEndTimePicker(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={endDate}
                      mode="time"
                      display="spinner"
                      onChange={(event, selectedTime) => {
                        handleTimeChange(false, event, selectedTime);
                      }}
                    />
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setShowEndTimePicker(false)}
                      >
                        <Text style={styles.modalButtonText}>Xong</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </>
        ) : (
          <>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(false);
                  if (event.type === 'set' && selectedDate) {
                    const newDate = new Date(selectedDate);
                    newDate.setHours(startDate.getHours());
                    newDate.setMinutes(startDate.getMinutes());
                    setStartDate(newDate);
                  }
                }}
              />
            )}

            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                minimumDate={startDate}
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(false);
                  if (event.type === 'set' && selectedDate) {
                    const newDate = new Date(selectedDate);
                    newDate.setHours(endDate.getHours());
                    newDate.setMinutes(endDate.getMinutes());
                    setEndDate(newDate);
                  }
                }}
              />
            )}

            {showStartTimePicker && (
              <DateTimePicker
                value={startDate}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  handleTimeChange(true, event, selectedTime);
                }}
              />
            )}

            {showEndTimePicker && (
              <DateTimePicker
                value={endDate}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  handleTimeChange(false, event, selectedTime);
                }}
              />
            )}
          </>
        )}
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
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD54F',
  },
  noticeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#F57C00',
    lineHeight: 18,
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  timeRowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 80,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    flex: 1,
    gap: 6,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
    gap: 6,
  },
  timeButtonText: {
    fontSize: 14,
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
  paymentMethodDisabled: {
    opacity: 0.5,
    backgroundColor: '#f0f0f0',
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
  paymentMethodTextDisabled: {
    color: '#ccc',
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
  // Grid Layout Styles
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  parkingGridContainer: {
    paddingVertical: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
  },
  legendAvailable: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  legendSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  legendOccupied: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  emptySlot: {
    width: 70,
    height: 70,
    marginHorizontal: 4,
  },
  gridSlotItem: {
    width: 70,
    height: 70,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  gridSlotAvailable: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  gridSlotSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
    transform: [{ scale: 1.05 }],
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gridSlotOccupied: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
    opacity: 0.6,
  },
  gridSlotNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  gridSlotNumberSelected: {
    color: '#fff',
    fontSize: 16,
  },
  gridSlotNumberDisabled: {
    color: '#999',
  },
});

export default BookingScreen;