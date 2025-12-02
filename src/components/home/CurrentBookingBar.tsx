import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UpcomingBooking {
  bookingId: number;
  startTime: string;
  endTime: string;
  parkingName: string;
  parkingAddress: string;
  vehicleLicensePlate: string;
  slotName: string;
}

type CurrentBookingBarProps = {
  booking: UpcomingBooking | null;
  onPress: () => void;
  onClose: () => void;
};

const CurrentBookingBar = ({ booking, onPress, onClose }: CurrentBookingBarProps) => {
  if (!booking) return null;

  // Format time từ ISO string
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <Text style={styles.checkInTime}>
          Giờ vào: {formatTime(booking.startTime)} - Giờ ra: {formatTime(booking.endTime)}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {booking.parkingName}
        </Text>
        <Text style={styles.vehicle}>
          {booking.vehicleLicensePlate} | {booking.slotName}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={(e) => {
          e.stopPropagation();
          onClose();
        }} 
        style={styles.closeButton}
      >
        <Ionicons name="close" size={22} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#3498db',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 18,
      elevation: 15,
      shadowColor: '#3498db',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    content: {
      flex: 1,
    },
    checkInTime: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '500',
      marginBottom: 4,
    },
    location: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
      marginVertical: 3,
    },
    vehicle: {
      fontSize: 13,
      color: '#fff',
      fontWeight: '600',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 4,
    },
    closeButton: {
      padding: 8,
      marginLeft: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 20,
    },
  });

export default CurrentBookingBar;