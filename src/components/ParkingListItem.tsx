// src/components/ParkingListItem.tsx
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';

interface ParkingListItemProps {
  item: {
    id: string;
    name: string;
    address: string;
    rating: number;
    distance?: string; // Thêm thông tin khoảng cách
    imageUrl: any;
  };
  navigation: StackNavigationProp<RootStackParamList>;
  onPress: () => void;
}

const ParkingListItem = ({ item, onPress, navigation }: ParkingListItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
    >
      <Image source={item.imageUrl} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.address} numberOfLines={2}>{item.address}</Text>
        <View style={styles.extraInfo}>
          <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
          <View style={styles.distanceContainer}>
            <Ionicons name="location" size={14} color="#888" />
            {/* <Text style={styles.distanceText}>{item.distance}</Text> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  extraInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  distanceText: {
    marginLeft: 5,
    fontSize: 13,
    color: '#555',
  },
});

export default ParkingListItem;