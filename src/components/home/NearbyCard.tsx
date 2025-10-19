import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

type NearbyCardProps = {
  item: {
    id: string;
    name: string;
    address: string;
    rating: number;
    priceCar: number;
    priceMoto: number;
    avatar: string;
    isFavorite: boolean;
    imageUrl: string;
    coordinate: { latitude: number; longitude: number };
    tags: string[];
    price: number;
    distance?: number;
  };
  onPress: () => void;
};

const NearbyCard = ({ item, onPress }: NearbyCardProps) => {
  // Xử lý hiển thị ảnh - nếu imageUrl là string (URL) thì dùng { uri }, nếu là require thì dùng trực tiếp
  const imageSource = typeof item.imageUrl === 'string' && item.imageUrl.startsWith('http')
    ? { uri: item.imageUrl }
    : typeof item.imageUrl === 'number'
    ? item.imageUrl
    : { uri: item.imageUrl };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={imageSource as any} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.rating}>⭐ {(item.rating || 0).toFixed(1)}</Text>
        </View>
        
        <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
        
        {/* Hiển thị khoảng cách và giá xe máy */}
        <View style={styles.infoRow}>
          {item.distance !== undefined && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location-outline" size={14} color="#3498db" />
              <Text style={styles.distance}> ~{item.distance.toFixed(1)} km</Text>
            </View>
          )}
          {item.priceMoto > 0 && (
            <View style={styles.priceRow}>
              <FontAwesome name="motorcycle" size={16} color="#95a5a6" />
              <Text style={styles.price}> {item.priceMoto.toLocaleString('vi-VN')}đ</Text>
            </View>
          )}
        </View>
        
        {/* Hiển thị tags và giá ô tô */}
        <View style={styles.infoRow}>
          <Text style={styles.tags}>{(item.tags || []).join(' | ')}</Text>
          {item.priceCar > 0 && (
            <View style={styles.priceRow}>
              <FontAwesome name="car" size={16} color="#95a5a6" />
              <Text style={styles.price}> {item.priceCar.toLocaleString('vi-VN')}đ</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 16,
      width: 280,
      marginRight: 15,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: 160,
    },
    infoContainer: {
      padding: 14,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    name: {
      flex: 1,
      fontSize: 17,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginRight: 5,
    },
    rating: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#f39c12',
      backgroundColor: '#fff8e1',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    address: {
      fontSize: 13,
      color: '#7f8c8d',
      marginVertical: 4,
      lineHeight: 18,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    distanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    distance: {
      fontSize: 13,
      color: '#3498db',
      fontWeight: '600',
    },
    tags: {
      fontSize: 12,
      color: '#95a5a6',
      flex: 1,
    },
    priceContainer: {
      marginTop: 4,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    priceLabel: {
      fontSize: 13,
      color: '#7f8c8d',
    },
    price: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#3498db',
    },
  });

export default NearbyCard;