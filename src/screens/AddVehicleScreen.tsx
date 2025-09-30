// src/screens/AddVehicleScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

type VehicleType = 'car' | 'motorcycle';

const AddVehicleScreen = () => {
  const navigation = useNavigation();
  const [vehicleType, setVehicleType] = useState<VehicleType>('motorcycle');
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');

  const handleAddVehicle = () => {
    if (!name || !plate) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    // Logic thêm xe vào danh sách (trong ứng dụng thật)
    Alert.alert('Thành công', 'Đã thêm phương tiện mới!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Loại phương tiện</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, vehicleType === 'motorcycle' && styles.activeType]}
            onPress={() => setVehicleType('motorcycle')}
          >
            <Icon name="motorcycle" size={24} color={vehicleType === 'motorcycle' ? '#fff' : '#333'} />
            <Text style={[styles.typeText, vehicleType === 'motorcycle' && styles.activeText]}>Xe máy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, vehicleType === 'car' && styles.activeType]}
            onPress={() => setVehicleType('car')}
          >
            <Icon name="car" size={24} color={vehicleType === 'car' ? '#fff' : '#333'} />
            <Text style={[styles.typeText, vehicleType === 'car' && styles.activeText]}>Ô tô</Text>
          </TouchableOpacity>
        </View>

        <FormInput
          label="Tên xe"
          icon="car"
          value={name}
          onChangeText={setName}
          placeholder="Ví dụ: Honda Wave RSX"
        />
        <FormInput
          label="Biển số xe"
          icon="id-card"
          value={plate}
          onChangeText={setPlate}
          placeholder="Ví dụ: 72D1-12345"
          autoCapitalize="characters"
        />
        
        <View style={styles.buttonContainer}>
          <Button
            title="Thêm phương tiện"
            onPress={handleAddVehicle}
            // backgroundColor="#3498db"
            // textColor="#ffffff"
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
    label: {
      fontSize: 16,
      color: '#555',
      marginBottom: 8,
      fontWeight: '600',
    },
    typeSelector: {
      flexDirection: 'row',
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 12,
      overflow: 'hidden'
    },
    typeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      backgroundColor: '#f0f2f5',
    },
    activeType: {
      backgroundColor: '#3498db',
    },
    typeText: {
      marginLeft: 10,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333'
    },
    activeText: {
        color: '#fff'
    },
    buttonContainer: {
        marginTop: 30,
    }
  });

export default AddVehicleScreen;