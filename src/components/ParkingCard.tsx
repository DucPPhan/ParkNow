// src/components/ParkingCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface ParkingCardProps {
  item: {
    id: string;
    name: string;
    address: string;
    rating: number;
    imageUrl: any;
  };
  onPress: () => void;
}

const ParkingCard = ({ item, onPress }: ParkingCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={item.imageUrl} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
        <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: width * 0.6, // Chiều rộng bằng 60% chiều rộng màn hình
    marginRight: 15,
    elevation: 4, // Tăng đổ bóng
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: 13, // Tăng kích thước font
    color: '#666', // Màu chữ xám hơn
    marginVertical: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
  },
});

export default ParkingCard;