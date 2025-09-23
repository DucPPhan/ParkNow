// src/screens/VehiclesScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp, Vehicle } from '../navigation/types';
import VehicleCard from '../components/VehicleCard';
import Button from '../components/Button';

// Dữ liệu giả ĐÃ SỬA LỖI
const VEHICLES_DATA: Vehicle[] = [ // Sử dụng kiểu Vehicle
  { id: '1', name: 'Honda Wave RSX', plate: '72D1-54321', type: 'motorcycle', isDefault: true },
  { id: '2', name: 'Mazda CX-5', plate: '51A-12345', type: 'car', isDefault: false },
];

const VehiclesScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={VEHICLES_DATA}
          renderItem={({ item }) => (
            <VehicleCard 
              item={item} 
              onPress={() => navigation.navigate('VehicleDetail', { vehicle: item })} 
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
        <View style={styles.buttonContainer}>
          <Button 
            title="+ Thêm phương tiện"
            onPress={handleAddVehicle}
            backgroundColor="#3498db"
            textColor="#ffffff"
            // minWidth={'100%'}
            borderRadius={12}
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
  listContainer: {
    flexGrow: 1,
  },
  buttonContainer: {
    paddingTop: 10,
  },
});

export default VehiclesScreen;