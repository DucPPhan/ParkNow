// src/components/ParkingCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface ParkingCardProps {
  item: {
    id: string;
    name: string;
    address: string;
    rating: number;
    imageUrl: any; // Sử dụng 'any' cho require
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
    borderRadius: 10,
    width: 220,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: 12,
    color: '#777',
    marginVertical: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
  },
});

export default ParkingCard;