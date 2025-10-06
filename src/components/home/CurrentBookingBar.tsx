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
        <Ionicons name="close" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

// ... Styles
const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    content: {
      flex: 1,
    },
    checkInTime: {
      fontSize: 14,
      color: 'gray',
    },
    location: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginVertical: 2,
    },
    vehicle: {
      fontSize: 14,
      color: '#3498db',
      fontWeight: '500',
    },
    closeButton: {
      padding: 10,
      marginLeft: 10,
    },
  });

export default CurrentBookingBar;