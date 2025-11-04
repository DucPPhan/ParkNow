import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

// Định nghĩa kiểu cho dữ liệu bãi xe trả về từ API
interface ParkingDetail {
  parkingId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  stars: number;
  avatar: string;
  isPrepayment: boolean;
  isOvernight: boolean;
}

interface NearbyParking {
  getListParkingNearestWithDistanceResponse: ParkingDetail | null;
  priceCar: number | null;
  priceMoto: number | null;
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

        // 3. Gọi API để lấy các bãi xe gần đó (50km cho màn hình bản đồ)
        const result = await api.getNearbyParkings(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          50
        );

        if (result.success && Array.isArray(result.data)) {
          // Lọc ra các bãi xe có dữ liệu hợp lệ
          const validParkings = result.data.filter(
            (item: NearbyParking) => item.getListParkingNearestWithDistanceResponse !== null
          );
          setParkings(validParkings);
          console.log('Valid parkings:', validParkings.length);
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
          {parkings
            .filter((parking) => parking.getListParkingNearestWithDistanceResponse !== null)
            .map((parking, index) => {
              const parkingDetail = parking.getListParkingNearestWithDistanceResponse!;
              return (
                <Marker
                  key={`parking-${parkingDetail.parkingId || index}`}
                  coordinate={{
                    latitude: parkingDetail.latitude,
                    longitude: parkingDetail.longitude,
                  }}
                >
                  {/* Sử dụng icon tùy chỉnh cho bãi xe */}
                  <View style={styles.markerContainer}>
                    <Ionicons name="car-sport" size={24} color="white" />
                  </View>
                  
                  {/* Custom Callout với thông tin đầy đủ */}
                  <Callout
                    tooltip
                    onPress={() => {
                      navigation.navigate('ParkingDetail', {
                        parkingId: parkingDetail.parkingId?.toString() || index.toString(),
                        name: parkingDetail.name || 'Bãi đỗ xe',
                      });
                    }}
                  >
                    <View style={styles.calloutContainer}>
                      {/* Header với avatar */}
                      <View style={styles.calloutHeader}>
                        {parkingDetail.avatar ? (
                          <Image
                            source={{ uri: parkingDetail.avatar }}
                            style={styles.calloutImage}
                          />
                        ) : (
                          <View style={[styles.calloutImage, styles.placeholderImage]}>
                            <Ionicons name="car-sport" size={40} color="#bdc3c7" />
                          </View>
                        )}
                        {/* Badge khoảng cách */}
                        <View style={styles.distanceBadge}>
                          <Ionicons name="location" size={12} color="white" />
                          <Text style={styles.distanceText}>{parking.distance.toFixed(1)} km</Text>
                        </View>
                      </View>

                      {/* Thông tin bãi đỗ */}
                      <View style={styles.calloutInfo}>
                        <Text style={styles.calloutTitle} numberOfLines={2}>
                          {parkingDetail.name}
                        </Text>
                        
                        {/* Rating */}
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={14} color="#FFD700" />
                          <Text style={styles.ratingText}>{parkingDetail.stars.toFixed(1)}</Text>
                        </View>

                        {/* Địa chỉ */}
                        <View style={styles.addressContainer}>
                          <Ionicons name="location-outline" size={12} color="#666" />
                          <Text style={styles.calloutAddress} numberOfLines={2}>
                            {parkingDetail.address}
                          </Text>
                        </View>

                        {/* Giá cả */}
                        <View style={styles.priceContainer}>
                          <View style={styles.priceItem}>
                            <Ionicons name="bicycle" size={14} color="#3498db" />
                            <Text style={styles.priceLabel}>Xe máy:</Text>
                            <Text style={styles.priceValue}>
                              {parking.priceMoto ? `${parking.priceMoto.toLocaleString()}đ` : 'N/A'}
                            </Text>
                          </View>
                          <View style={styles.priceItem}>
                            <Ionicons name="car" size={14} color="#3498db" />
                            <Text style={styles.priceLabel}>Ô tô:</Text>
                            <Text style={styles.priceValue}>
                              {parking.priceCar ? `${parking.priceCar.toLocaleString()}đ` : 'N/A'}
                            </Text>
                          </View>
                        </View>

                        {/* Features */}
                        <View style={styles.featuresContainer}>
                          {parkingDetail.isPrepayment && (
                            <View style={styles.featureBadge}>
                              <Ionicons name="card-outline" size={10} color="#27ae60" />
                              <Text style={styles.featureText}>Trả trước</Text>
                            </View>
                          )}
                          {parkingDetail.isOvernight && (
                            <View style={styles.featureBadge}>
                              <Ionicons name="moon-outline" size={10} color="#9b59b6" />
                              <Text style={styles.featureText}>Qua đêm</Text>
                            </View>
                          )}
                        </View>

                        {/* Tap để xem chi tiết */}
                        <View style={styles.tapHint}>
                          <Text style={styles.tapHintText}>Nhấn để xem chi tiết</Text>
                          <Ionicons name="arrow-forward" size={12} color="#3498db" />
                        </View>
                      </View>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
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
  },
  // Callout styles
  calloutContainer: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutHeader: {
    position: 'relative',
    height: 140,
  },
  calloutImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  calloutInfo: {
    padding: 12,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: 8,
  },
  calloutAddress: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceLabel: {
    fontSize: 11,
    color: '#666',
  },
  priceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27ae60',
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  featureText: {
    fontSize: 10,
    color: '#2c3e50',
    fontWeight: '500',
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  tapHintText: {
    fontSize: 11,
    color: '#3498db',
    fontWeight: '600',
  },
});

export default MapScreen;