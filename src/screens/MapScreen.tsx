import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

// Định nghĩa kiểu cho dữ liệu bãi xe trả về từ API
interface NearbyParking {
  parkingId: number;
  parkingName: string;
  address: string;
  latitude: number;
  longtitude: number;
  distance: number;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MapScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [parkings, setParkings] = useState<NearbyParking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg(null);

      // 1. Hỏi quyền truy cập vị trí
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Quyền truy cập vị trí đã bị từ chối.');
        Alert.alert('Lỗi', 'Vui lòng cho phép ứng dụng truy cập vị trí để sử dụng bản đồ.');
        setLoading(false);
        return;
      }

      try {
        // 2. Lấy vị trí hiện tại
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        // 3. Gọi API để lấy các bãi xe gần đó
        const result = await api.getNearbyParkings(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );

        if (result.success && Array.isArray(result.data)) {
          setParkings(result.data);
        } else {
          setErrorMsg(result.message || 'Không thể tải dữ liệu bãi xe.');
        }
      } catch (error) {
        setErrorMsg('Đã xảy ra lỗi khi tải dữ liệu.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Đang tìm vị trí và các bãi xe...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.02, // Zoom level
            longitudeDelta: 0.01,
          }}
          showsUserLocation // Hiển thị chấm xanh cho vị trí người dùng
        >
          {/* Đánh dấu các bãi xe */}
          {parkings.map((parking) => (
            <Marker
              key={parking.parkingId}
              coordinate={{
                latitude: parking.latitude,
                longitude: parking.longtitude,
              }}
              title={parking.parkingName}
              description={parking.address}
              onCalloutPress={() =>
                navigation.navigate('ParkingDetail', {
                  parkingId: parking.parkingId.toString(),
                  name: parking.parkingName,
                })
              }
            >
              {/* Sử dụng icon tùy chỉnh cho bãi xe */}
              <View style={styles.markerContainer}>
                <Ionicons name="car-sport" size={24} color="white" />
              </View>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center'
  },
  markerContainer: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 2,
  }
});

export default MapScreen;