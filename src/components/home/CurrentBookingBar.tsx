import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CurrentBookingBarProps = {
  onClose: () => void;
};

const CurrentBookingBar = ({ onClose }: CurrentBookingBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.checkInTime}>Giờ vào: 14:00</Text>
        <Text style={styles.location} numberOfLines={1}>Takashimaya - 94 Nam Kỳ Khởi Nghĩa</Text>
        <Text style={styles.vehicle}>51H - 083.62 | A45</Text>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
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