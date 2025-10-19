import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { PARKING_DATA } from '../../data/mockData';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

type FeaturedListItemProps = {
  item: {
    id: string;
    name: string;
    address: string;
    rating: number;
    priceCar: number;
    priceMoto: number;
    isFavorite: boolean;
    imageUrl: string;
  };
  onPress: () => void;
};

const FeaturedListItem = ({ item, onPress }: FeaturedListItemProps) => {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
          <Text style={styles.rating}>⭐ {(item.rating || 0).toFixed(1)}</Text>
          <View style={styles.pricesSection}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>
                <FontAwesome name="car" size={12} color="#95a5a6" />: 
                </Text>
              <Text style={styles.price}>{(item.priceCar || 0).toLocaleString('vi-VN')}đ</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>
                <FontAwesome name="motorcycle" size={12} color="#95a5a6" />: 
              </Text>
              <Text style={styles.price}>{(item.priceMoto || 0).toLocaleString('vi-VN')}đ</Text>
            </View>
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
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
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
    color: '#2c3e50',
    flex: 1,
    marginRight: 5,
    lineHeight: 22,
  },
  address: {
    fontSize: 13,
    color: '#7f8c8d',
    marginVertical: 4,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  pricesSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  priceLabel: {
    fontSize: 11,
    color: '#95a5a6',
    fontWeight: '500',
  },
  distance: {
    fontSize: 14,
    color: 'gray',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
    backgroundColor: '#fff8e1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
  },
});

export default FeaturedListItem;