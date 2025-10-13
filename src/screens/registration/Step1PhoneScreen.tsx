import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RegistrationStackParamList } from '../../navigation/types';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import { useRegistration } from '../../context/RegistrationContext';
import api from '../../services/api';

type Nav = StackNavigationProp<RegistrationStackParamList, 'Step1_Phone'>;

const Step1PhoneScreen = ({ navigation }: { navigation: Nav }) => {
  const { updateRegistrationData, data } = useRegistration();
  const [phone, setPhone] = useState(data.phoneNumber || '');
  const [loading, setLoading] = useState(false);

  const onNext = async () => {
    const vietnamPhoneRegex = /^0\d{9}$/;
    if (!vietnamPhoneRegex.test(phone)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ.');
      return;
    }
    setLoading(true);
    const res = await api.checkPhone(phone);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Lỗi', res.message || 'Không thể kiểm tra số điện thoại.');
      return;
    }
    // Tùy theo API: data=true nghĩa là hợp lệ hay đã tồn tại? Giả sử false = chưa tồn tại -> tiếp tục
    // Nếu API trả về tồn tại, chặn đăng ký
    if (res.data?.exists) {
      Alert.alert('Thông báo', 'Số điện thoại đã được đăng ký. Vui lòng đăng nhập.');
      return;
    }
    updateRegistrationData({ phoneNumber: phone });
    navigation.navigate('Step2_Gmail');
  };

  return (
    <View style={styles.container}>
      <FormInput
        label="Số điện thoại"
        icon="call-outline"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholder="Nhập số điện thoại"
      />
      <Button title="Tiếp tục" onPress={onNext} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
});

export default Step1PhoneScreen;
