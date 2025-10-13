import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RegistrationStackParamList, RootStackParamList } from '../../navigation/types';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import { useRegistration } from '../../context/RegistrationContext';
import api from '../../services/api';
import { StackActions, useNavigation } from '@react-navigation/native';

type RegNav = StackNavigationProp<RegistrationStackParamList, 'Step4_Password'>;

const Step4PasswordScreen = ({ navigation }: { navigation: RegNav }) => {
  const { data } = useRegistration();
  const rootNav = useNavigation<any>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    if ((password || '').length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu nhập lại không khớp.');
      return;
    }
    if (!data.phoneNumber || !data.email || !data.token) {
      Alert.alert('Lỗi', 'Thiếu dữ liệu đăng ký.');
      return;
    }
    setLoading(true);
    const res = await api.register({
      phoneNumber: data.phoneNumber,
      email: data.email,
      password,
      token: data.token,
    });
    if (!res.success) {
      setLoading(false);
      Alert.alert('Đăng ký thất bại', res.message || 'Vui lòng thử lại.');
      return;
    }
    // Tự đăng nhập (nếu backend yêu cầu, có thể đã auto login). Ở đây gọi login qua số điện thoại.
    const loginRes = await api.login(data.phoneNumber, data.password);
    setLoading(false);
    if (!loginRes.success) {
      Alert.alert('Đăng nhập tự động thất bại', loginRes.message || 'Vui lòng đăng nhập thủ công.');
      rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
      return;
    }
    // Điều hướng đến màn hình hoàn thiện hồ sơ để cập nhật name, avatar, dateOfBirth, gender
    rootNav.reset({ index: 0, routes: [{ name: 'CompleteProfile' }] });
  };

  return (
    <View style={styles.container}>
      <FormInput
        label="Mật khẩu"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        placeholder="Nhập mật khẩu"
        secureTextEntry
      />
      <FormInput
        label="Nhập lại mật khẩu"
        icon="lock-closed-outline"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Nhập lại mật khẩu"
        secureTextEntry
      />
      <Button title="Hoàn tất đăng ký" onPress={onFinish} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
});

export default Step4PasswordScreen;
