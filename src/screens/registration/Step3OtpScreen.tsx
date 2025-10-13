import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RegistrationStackParamList } from '../../navigation/types';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import { useRegistration } from '../../context/RegistrationContext';
import api from '../../services/api';

type Nav = StackNavigationProp<RegistrationStackParamList, 'Step3_OTP'>;

const Step3OtpScreen = ({ navigation }: { navigation: Nav }) => {
  const { data, updateRegistrationData } = useRegistration();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const onNext = async () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert('Lỗi', 'Mã OTP gồm 6 chữ số.');
      return;
    }
    if (!data.email) {
      Alert.alert('Lỗi', 'Thiếu email.');
      return;
    }
    setLoading(true);
    const res = await api.verifyEmailOtp(data.email, otp);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Lỗi', res.message || 'Xác minh OTP thất bại.');
      return;
    }
    // API trả về token qua data
    updateRegistrationData({ token: res.data.token });
    navigation.navigate('Step4_Password');
  };

  return (
    <View style={styles.container}>
      <FormInput
        label="Mã OTP"
        icon="key-outline"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        placeholder="Nhập 6 số OTP"
        maxLength={6}
      />
      <Button title="Xác minh" onPress={onNext} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
});

export default Step3OtpScreen;
