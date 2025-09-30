// src/screens/MapScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../navigation/types';
import { PARKING_DATA } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';

const MapScreen = () => {
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      // Yêu cầu quyền vị trí qua expo-location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Permission to access location was denied");
        return;
      }
      getCurrentLocation();
    };
    requestLocationPermission();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const region: Region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setCurrentRegion(region);
      mapRef.current?.animateToRegion(region, 1000);
    } catch (error: any) {
      console.log("Error getting location:", error.message);
    }
  };

  const onRecenter = () => {
    if (currentRegion) {
      mapRef.current?.animateToRegion(currentRegion, 1000);
    } else {
      getCurrentLocation();
    }
  };

  return (
    <View style={styles.container}>
      {currentRegion ? (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={currentRegion}
          showsUserLocation={true}
        >
          {PARKING_DATA.map(parking => (
            <Marker
              key={parking.id}
              coordinate={parking.coordinate}
              title={parking.name}
            >
              <Callout
                tooltip
                onPress={() =>
                  navigation.navigate('ParkingDetail', {
                    parkingId: parking.id,
                    name: parking.name,
                  })
                }
              >
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{parking.name}</Text>
                  <Text style={styles.calloutAddress} numberOfLines={1}>
                    {parking.address}
                  </Text>
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
        <Ionicons name="navigate" size={24} color="#fff" />
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
  },
});

export default MapScreen;
