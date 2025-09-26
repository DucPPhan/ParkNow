import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert, // Import Alert để hiển thị thông báo
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import SocialButton from '../components/SocialButton';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const GRAB_GREEN = '#0050b1ff';

const LoginScreen = ({ navigation }: Props) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    // Regex đơn giản để kiểm tra SĐT Việt Nam (bắt đầu bằng 0, theo sau là 9 số)
    const vietnamPhoneRegex = /^0\d{9}$/;
    const isValid = vietnamPhoneRegex.test(phoneNumber);

    if (isValid) {
      console.log('Số điện thoại hợp lệ:', phoneNumber);
      navigation.replace('MainApp', { screen: 'HomeTab' });
    } else {
      Alert.alert(
        "Số điện thoại không hợp lệ",
        "Vui lòng nhập số điện thoại hợp lệ của Việt Nam (ví dụ: 0912345678)."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <View style={styles.content}>
          <Text style={styles.header}>Chào mừng bạn</Text>
          <Text style={styles.subHeader}>
            Đăng nhập vào ParkNow để tìm chỗ đỗ xe nhanh chóng
          </Text>

          {/* === BẮT ĐẦU THAY ĐỔI COMPONENT NHẬP SỐ ĐIỆN THOẠI === */}
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeContainer}>
                <Text style={styles.flagEmoji}>🇻🇳</Text>
                <Text style={styles.countryCodeText}>+84</Text>
            </View>
            <TextInput
                style={styles.textInput}
                placeholder="Số điện thoại"
                placeholderTextColor="#8A8A8E"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                autoFocus
                maxLength={10}
            />
          </View>
          {/* === KẾT THÚC THAY ĐỔI === */}

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          </TouchableOpacity>

          <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>hoặc tiếp tục với</Text>
            <View style={styles.line} />
          </View>

          <SocialButton
            iconName="google"
            text="Đăng nhập với Google"
            onPress={() => {
              /* Xử lý đăng nhập Google */
            }}
          />
          <SocialButton
            iconName="facebook"
            text="Đăng nhập với Facebook"
            onPress={() => {
              /* Xử lý đăng nhập Facebook */
            }}
          />
        </View>

        <Text style={styles.termsText}>
          Bằng việc tiếp tục, bạn đồng ý với{' '}
          <Text style={styles.linkText}>Điều khoản Dịch vụ</Text> &{' '}
          <Text style={styles.linkText}>Chính sách Bảo mật</Text>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 32,
  },
  // Style cho component mới
  phoneInputContainer: {
    width: '100%',
    height: 56,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#DCDCE1',
    paddingHorizontal: 12,
    height: '60%',
  },
  flagEmoji: {
    fontSize: 24,
  },
  countryCodeText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#1C1C1E',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    color: '#1C1C1E',
  },
  // Kết thúc style cho component mới
  continueButton: {
    backgroundColor: GRAB_GREEN,
    borderRadius: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#8A8A8E',
    fontSize: 14,
  },
  termsText: {
    fontSize: 12,
    color: '#8A8A8E',
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  linkText: {
    color: GRAB_GREEN,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;