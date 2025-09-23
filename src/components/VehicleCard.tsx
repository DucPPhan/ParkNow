// src/components/VehicleCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Sử dụng bộ icon khác để có icon xe

interface VehicleCardProps {
  item: {
    id: string;
    name: string;
    plate: string;
    type: 'car' | 'motorcycle';
    isDefault: boolean;
  };
  onPress: () => void;
}

const VehicleCard = ({ item, onPress }: VehicleCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={item.type === 'car' ? 'car' : 'motorcycle'} size={24} color="#3498db" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.plate}>{item.plate}</Text>
      </View>
      {item.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultText}>Mặc định</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    backgroundColor: '#eaf5ff',
    padding: 15,
    borderRadius: 10,
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
  plate: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  defaultBadge: {
    backgroundColor: '#e7f7ef',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  defaultText: {
    color: '#2ecc71',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default VehicleCard;