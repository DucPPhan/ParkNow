import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface FavoriteAddress {
  favoriteAddressId: number;
  addressName: string;
  address: string;
  isDefault: boolean;
}

interface FavoriteAddressCardProps {
  item: FavoriteAddress;
  onPress: () => void;
  onDelete: () => void;
}

const FavoriteAddressCard = ({ item, onPress, onDelete }: FavoriteAddressCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="location-outline" size={24} color="#3498db" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.addressName}</Text>
        <Text style={styles.address} numberOfLines={2}>{item.address}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={22} color="#e74c3c" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// ... Styles
const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    iconContainer: {
      backgroundColor: '#eaf5ff',
      padding: 12,
      borderRadius: 25,
      marginRight: 15,
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    address: {
      fontSize: 14,
      color: 'gray',
      marginTop: 4,
    },
    deleteButton: {
      padding: 8,
    },
  });
export default FavoriteAddressCard;