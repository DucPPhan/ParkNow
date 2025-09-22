// src/screens/LoginScreen.tsx
import React from 'react';
// 1. Import 'Alert' từ 'react-native'
import { View, Text, StyleSheet, Alert } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';

import Button from '../components/Button';

type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng đến với ParkNow!</Text>

      <Button
        title="Đăng nhập"
        onPress={() => navigation.navigate('MainApp')}
        backgroundColor="#3498db"
        textColor="#ffffff"
      />

      <View style={{ height: 20 }} />

      <Button
        title="Đăng ký"
        // 2. Sử dụng Alert.alert() thay vì alert()
        onPress={() => Alert.alert('Thông báo', 'Chuyển đến màn hình đăng ký!')}
        backgroundColor="#e74c3c"
        textColor="#ffffff"
        minWidth={200}
        borderRadius={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});

export default LoginScreen;