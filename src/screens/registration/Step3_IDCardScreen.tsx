import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform, SafeAreaView, ActivityIndicator, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../../navigation/types';
import { useRegistration } from '../../context/RegistrationContext';
import Button from '../../components/Button';
import api from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'RegistrationFlow'>;

const Step3_IDCardScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { data, resetRegistrationData } = useRegistration();
  
    const [idCardNo, setIdCardNo] = useState('');
    const [idCardDate, setIdCardDate] = useState(new Date());
    const [idCardIssuedBy, setIdCardIssuedBy] = useState('');
    const [address, setAddress] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      const currentDate = selectedDate || idCardDate;
      setShowDatePicker(Platform.OS === 'ios');
      setIdCardDate(currentDate);
    };
  
    const handleRegister = async () => {
      if (!idCardNo || !idCardIssuedBy || !address) {
        Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
        return;
      }
  
      setLoading(true);
      
      const apiPayload = {
        phone: data.phone,
        name: data.name,
        dateOfBirth: data.dateOfBirth?.toISOString(),
        gender: data.gender,
        idCardNo: idCardNo,
        idCardDate: idCardDate.toISOString(),
        idCardIssuedBy: idCardIssuedBy,
        address: address,
      };
      
      const result = await api.register(apiPayload);
      setLoading(false);
  
      if (result.success) {
        Alert.alert("Thành công", "Đăng ký tài khoản thành công!", [
          { text: 'OK', onPress: () => {
            resetRegistrationData();
            navigation.navigate('Login'); 
          }},
        ]);
      } else {
        Alert.alert("Đăng ký thất bại", result.message || "Đã có lỗi xảy ra.");
      }
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Thông tin định danh</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={22} color="#888" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Số CMND/CCCD" value={idCardNo} onChangeText={setIdCardNo} keyboardType="numeric" />
            </View>

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={22} color="#888" style={styles.icon} />
              <Text style={styles.dateText}>Ngày cấp: {idCardDate.toLocaleDateString('vi-VN')}</Text>
            </TouchableOpacity>
            
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={22} color="#888" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Nơi cấp" value={idCardIssuedBy} onChangeText={setIdCardIssuedBy} />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="home-outline" size={22} color="#888" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Địa chỉ thường trú" value={address} onChangeText={setAddress} />
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={idCardDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
              />
            )}
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Hoàn tất" onPress={handleRegister} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    content: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 30,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#eee',
      paddingHorizontal: 15,
      height: 55,
      marginBottom: 20,
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#333',
    },
    dateText: {
      fontSize: 16,
      color: '#333',
    },
    footer: {
      padding: 24,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0'
    },
});

export default Step3_IDCardScreen;