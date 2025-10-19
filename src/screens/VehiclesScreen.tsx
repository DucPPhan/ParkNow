// src/screens/VehiclesScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HomeScreenNavigationProp, Vehicle } from '../navigation/types';
import VehicleCard from '../components/VehicleCard';
import Button from '../components/Button';
import api from '../services/api';

const VehiclesScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load vehicles when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadVehicles();
    }, [])
  );

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const result = await api.vehicleApi.getUserVehicles();

      if (result.success && result.data) {
        // Map API data to Vehicle format
        const mappedVehicles: Vehicle[] = result.data.map((vehicle: any) => ({
          id: vehicle.vehicleInforId?.toString() || vehicle.id?.toString(),
          name: vehicle.vehicleName || 'Xe chưa đặt tên',
          plate: vehicle.licensePlate || '',
          type: vehicle.trafficName === 'Xe máy' ? 'motorcycle' : 'car',
          isDefault: vehicle.isDefault || false,
          color: vehicle.color,
        }));
        
        setVehicles(mappedVehicles);
      } else if (!result.data) {
        const mappedVehicles: Vehicle[] = [];
        setVehicles(mappedVehicles);
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể tải danh sách phương tiện');
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi tải danh sách phương tiện');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadVehicles();
  };

  const handleAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={vehicles}
          renderItem={({ item }) => (
            <VehicleCard 
              item={item} 
              onPress={() => navigation.navigate('VehicleDetail', { vehicle: item })} 
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có phương tiện nào</Text>
              <Text style={styles.emptySubText}>Thêm phương tiện để bắt đầu</Text>
            </View>
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
        <View style={styles.buttonContainer}>
          <Button 
            title="+ Thêm phương tiện"
            onPress={handleAddVehicle}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#bbb',
  },
  buttonContainer: {
    paddingTop: 10,
  },
});

export default VehiclesScreen;