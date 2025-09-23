// src/screens/MapScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../navigation/types';
import { PARKING_DATA } from '../data/mockData';

const MapScreen = () => {
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Quyền truy cập vị trí",
              message: "ParkNow cần truy cập vị trí của bạn để hiển thị các bãi đỗ xe gần đây.",
              buttonNeutral: "Hỏi lại sau",
              buttonNegative: "Hủy",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          } else {
            console.log("Location permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentLocation();
      }
    };
    requestLocationPermission();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setCurrentRegion(region);
        mapRef.current?.animateToRegion(region, 1000);
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const onRecenter = () => {
      if (currentRegion) {
          mapRef.current?.animateToRegion(currentRegion, 1000);
      } else {
          getCurrentLocation();
      }
  }

  return (
    <View style={styles.container}>
      // TODO: Fix lỗi không hiển thị bản đồ
      {!currentRegion ? (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={currentRegion ? currentRegion : { latitude: 10.7769, longitude: 106.7009, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
          showsUserLocation={true}
        >
          {PARKING_DATA.map(parking => (
            <Marker
              key={parking.id}
              coordinate={parking.coordinate}
              title={parking.name}
            >
              <Callout tooltip onPress={() => navigation.navigate('ParkingDetail', { parkingId: parking.id, name: parking.name })}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{parking.name}</Text>
                  <Text style={styles.calloutAddress} numberOfLines={1}>{parking.address}</Text>
                  <Text style={styles.calloutAction}>Nhấn để xem chi tiết</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Đang lấy vị trí của bạn...</Text>
        </View>
      )}

      {/* Nút quay về vị trí hiện tại */}
      <TouchableOpacity style={styles.recenterButton} onPress={onRecenter}>
        <Icon name="navigation" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  calloutAction: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 5,
  },
  recenterButton: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      backgroundColor: '#3498db',
      padding: 15,
      borderRadius: 30,
      elevation: 5,
  }
});

export default MapScreen;