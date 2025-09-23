// src/components/ActivityCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type StatusType = 'Sắp tới' | 'Hoàn thành' | 'Đã hủy';

interface ActivityCardProps {
  item: {
    id: string;
    name: string;
    date: string;
    time: string;
    status: StatusType;
    imageUrl: any;
  };
  onPress: () => void;
}

// Hàm để lấy màu dựa trên trạng thái
const getStatusStyle = (status: StatusType) => {
  switch (status) {
    case 'Sắp tới':
      return { backgroundColor: '#3498db', color: '#ffffff' };
    case 'Hoàn thành':
      return { backgroundColor: '#2ecc71', color: '#ffffff' };
    case 'Đã hủy':
      return { backgroundColor: '#e74c3c', color: '#ffffff' };
    default:
      return { backgroundColor: '#bdc3c7', color: '#ffffff' };
  }
};

const ActivityCard = ({ item, onPress }: ActivityCardProps) => {
  const statusStyle = getStatusStyle(item.status);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={item.imageUrl} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.dateTimeContainer}>
          <Icon name="calendar" size={14} color="#888" />
          <Text style={styles.dateTimeText}>{item.date}</Text>
        </View>
        <View style={styles.dateTimeContainer}>
          <Icon name="clock" size={14} color="#888" />
          <Text style={styles.dateTimeText}>{item.time}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
        <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateTimeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ActivityCard;