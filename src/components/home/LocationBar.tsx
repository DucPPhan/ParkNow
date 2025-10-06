import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type LocationBarProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const LocationBar = ({ navigation }: LocationBarProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hàm async bên trong useEffect để xử lý logic bất đồng bộ
    const getLocation = async () => {
      setLoading(true);
      // 1. Hỏi quyền truy cập vị trí
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Quyền bị từ chối', 'Vui lòng cho phép ứng dụng truy cập vị trí để sử dụng tính năng này.');
        setAddress('Không thể xác định vị trí');
        setLoading(false);
        return;
      }

      try {
        // 2. Lấy tọa độ hiện tại
        let location = await Location.getCurrentPositionAsync({});

        // 3. Chuyển đổi tọa độ thành địa chỉ
        let geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geocode.length > 0) {
          const firstResult = geocode[0];
          // Ghép các thành phần địa chỉ lại thành một chuỗi dễ đọc
          const formattedAddress = `${firstResult.streetNumber || ''} ${firstResult.street || ''}, ${firstResult.subregion || ''}, ${firstResult.city || ''}`;
          setAddress(formattedAddress);
        } else {
          setAddress('Không tìm thấy địa chỉ');
        }
      } catch (error) {
        console.error(error);
        setAddress('Lỗi khi lấy vị trí');
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần khi component được mount

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.locationContainer}>
        <Ionicons name="location-sharp" size={24} color="gray" />
        {loading ? (
          <ActivityIndicator size="small" color="gray" style={{ marginLeft: 8 }} />
        ) : (
          <Text style={styles.locationText} numberOfLines={1}>
            {address || 'Đang tải vị trí...'}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notification')}>
        <Ionicons name="notifications-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  iconButton: {
    padding: 5,
  },
});

export default LocationBar;