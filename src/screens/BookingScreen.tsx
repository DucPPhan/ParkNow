// src/screens/BookingScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList, BookingScreenNavigationProp } from '../navigation/types';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../components/Button';
import { VEHICLES_DATA } from '../data/mockData'; // Import dữ liệu xe

type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;

const BookingScreen = () => {
  const route = useRoute<BookingScreenRouteProp>();
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const { parkingName } = route.params;

  const [selectedVehicleId, setSelectedVehicleId] = useState(VEHICLES_DATA[0]?.id);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 2 * 60 * 60 * 1000)); // Mặc định 2 tiếng
  
  const [showPicker, setShowPicker] = useState<'date' | 'start' | 'end' | null>(null);

  const onChange = (event: any, selectedValue: Date | undefined) => {
    const currentValue = selectedValue || (showPicker === 'date' ? date : showPicker === 'start' ? startTime : endTime);
    setShowPicker(null);
    if (showPicker === 'date') setDate(currentValue);
    if (showPicker === 'start') setStartTime(currentValue);
    if (showPicker === 'end') setEndTime(currentValue);
  };
  
  const handleConfirmBooking = () => {
      Alert.alert("Xác nhận", "Bạn có chắc muốn đặt chỗ với thông tin này?", [
          {text: "Hủy"},
          {text: "OK", onPress: () => {
              Alert.alert("Thành công", "Đặt chỗ thành công!", [
                  {text: "Xem chi tiết", onPress: () => {
                      navigation.navigate('MainApp', { screen: 'ActivityTab' }); // Dòng này giờ sẽ không còn lỗi
                  }}
              ])
          }}
      ])
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.parkingName}>{parkingName}</Text>
        
        {/* Vehicle Selection */}
        <Text style={styles.sectionTitle}>Chọn phương tiện</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehicleList}>
          {VEHICLES_DATA.map(vehicle => (
            <TouchableOpacity 
              key={vehicle.id} 
              style={[styles.vehicleCard, selectedVehicleId === vehicle.id && styles.selectedVehicleCard]}
              onPress={() => setSelectedVehicleId(vehicle.id)}
            >
              <Text style={[styles.vehicleText, selectedVehicleId === vehicle.id && styles.selectedText]}>{vehicle.name}</Text>
              <Text style={[styles.plateText, selectedVehicleId === vehicle.id && styles.selectedText]}>{vehicle.plate}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time Selection */}
        <Text style={styles.sectionTitle}>Chọn thời gian</Text>
        <TouchableOpacity style={styles.timeRow} onPress={() => setShowPicker('date')}>
            <Icon name="calendar" size={20} color="#555" />
            <Text style={styles.timeText}>Ngày gửi: {date.toLocaleDateString('vi-VN')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timeRow} onPress={() => setShowPicker('start')}>
            <Icon name="clock" size={20} color="#555" />
            <Text style={styles.timeText}>Giờ vào: {startTime.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timeRow} onPress={() => setShowPicker('end')}>
            <Icon name="clock" size={20} color="#555" />
            <Text style={styles.timeText}>Giờ ra: {endTime.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</Text>
        </TouchableOpacity>

        {showPicker && (
            <DateTimePicker
                value={showPicker === 'date' ? date : showPicker === 'start' ? startTime : endTime}
                mode={showPicker === 'date' ? 'date' : 'time'}
                is24Hour={true}
                display="default"
                onChange={onChange}
            />
        )}

         {/* Summary */}
         <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}><Text>Tạm tính</Text><Text>30,000đ</Text></View>
            <View style={styles.summaryRow}><Text style={styles.totalText}>Tổng cộng</Text><Text style={styles.totalText}>30,000đ</Text></View>
         </View>

      </ScrollView>
      <View style={styles.bottomBar}>
        <Button 
            title="Xác nhận đặt chỗ"
            onPress={handleConfirmBooking}
            backgroundColor="#2ecc71"
            textColor="#ffffff"
            // minWidth={'100%'}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'white' },
    container: { padding: 20 },
    parkingName: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15 },
    vehicleList: { marginBottom: 20 },
    vehicleCard: { padding: 15, borderWidth: 1, borderColor: 'e0e0e0', borderRadius: 10, marginRight: 10, minWidth: 150 },
    selectedVehicleCard: { backgroundColor: '#3498db', borderColor: '#3498db' },
    vehicleText: { fontSize: 16, fontWeight: 'bold', color: '#333'},
    plateText: { fontSize: 14, color: '#777', marginTop: 4 },
    selectedText: { color: '#fff' },
    timeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', padding: 15, borderRadius: 10, marginBottom: 10},
    timeText: { marginLeft: 15, fontSize: 16 },
    summaryContainer: { marginTop: 30, padding: 15, backgroundColor: '#f8f8f8', borderRadius: 10},
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5},
    totalText: { fontWeight: 'bold', fontSize: 16 },
    bottomBar: { padding: 20, borderTopWidth: 1, borderTopColor: '#e0e0e0' }
  });

export default BookingScreen;