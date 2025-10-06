import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { PARKING_DATA } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';

type FeaturedListItemProps = {
  item: {
    id: string;
    name: string;
    address: string;
    rating: number;
    price: number;
    isFavorite: boolean;
    imageUrl: any;
    distance?: number; // Thêm prop distance (tùy chọn)
  };
  onPress: () => void;
};

const FeaturedListItem = ({ item, onPress }: FeaturedListItemProps) => {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={item.imageUrl} style={styles.image} />
      <View style={styles.infoContainer}>
        <View>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#e74c3c' : '#bdc3c7'}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.address} numberOfLines={2}>{item.address}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
          {item.distance && (
            <Text style={styles.distance}>{item.distance.toFixed(1)} km</Text>
          )}
          <Text style={styles.price}>{item.price.toLocaleString('vi-VN')}đ</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
// ... Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 5,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distance: {
    fontSize: 14,
    color: 'gray',
  },
  rating: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
});

export default FeaturedListItem;