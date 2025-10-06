import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LocationBar = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.locationContainer}>
        <Ionicons name="location-sharp" size={24} color="gray" />
        <Text style={styles.locationText} numberOfLines={1}>
          94 Nam Kỳ Khởi Nghĩa, Bến Nghé, Quận 1
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="notifications-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  iconButton: {
    padding: 5,
  },
});

export default LocationBar;