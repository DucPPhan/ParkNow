// src/screens/VehicleDetailScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

type VehicleDetailRouteProp = RouteProp<RootStackParamList, 'VehicleDetail'>;

const VehicleDetailScreen = () => {
  const route = useRoute<VehicleDetailRouteProp>();
  const navigation = useNavigation();
  const { vehicle } = route.params;

  // Khởi tạo state với dữ liệu của phương tiện
  const [name, setName] = useState(vehicle.name);
  const [plate, setPlate] = useState(vehicle.plate);

  const handleSaveChanges = () => {
    Alert.alert('Thành công', 'Đã lưu thay đổi!', [
        { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };
  
  const handleDeleteVehicle = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa phương tiện này?', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <FormInput
          label="Tên xe"
          icon="tag"
          value={name}
          onChangeText={setName}
        />
        <FormInput
          label="Biển số xe"
          icon="edit"
          value={plate}
          onChangeText={setPlate}
          autoCapitalize="characters"
        />
        
        <View style={styles.buttonContainer}>
          <Button
            title="Lưu thay đổi"
            onPress={handleSaveChanges}
            backgroundColor="#3498db"
            textColor="#ffffff"
            // minWidth={'100%'}
          />
           <View style={{height: 15}} />
          <Button
            title="Xóa phương tiện"
            onPress={handleDeleteVehicle}
            backgroundColor="#e74c3c"
            textColor="#ffffff"
            // minWidth={'100%'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    container: {
      padding: 20,
    },
    buttonContainer: {
        marginTop: 30,
    }
  });

export default VehicleDetailScreen;