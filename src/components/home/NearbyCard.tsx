import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { PARKING_DATA } from '../../data/mockData'; // Import type

type NearbyCardProps = {
  item: typeof PARKING_DATA[0];
  onPress: () => void;
};

const NearbyCard = ({ item, onPress }: NearbyCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={item.imageUrl} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.rating}>⭐ {(item.rating || 0).toFixed(1)}</Text>
        </View>
        <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
        <Text style={styles.tags}>{(item.tags || []).join(' | ')}</Text>
        <Text style={styles.price}>{(item.price || 0).toLocaleString('vi-VN')}đ</Text>
      </View>
    </TouchableOpacity>
  );
};

// ... Styles
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 12,
      width: 280,
      marginRight: 15,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    image: {
      width: '100%',
      height: 140,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    infoContainer: {
      padding: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    name: {
      flex: 1,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginRight: 5,
    },
    rating: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#f39c12',
    },
    address: {
      fontSize: 14,
      color: '#666',
      marginVertical: 4,
    },
    tags: {
      fontSize: 12,
      color: '#888',
      marginBottom: 8,
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2c3e50',
      textAlign: 'right',
    },
  });

export default NearbyCard;