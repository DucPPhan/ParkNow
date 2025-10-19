import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  // SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator, // Import component loading
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import SocialButton from '../components/SocialButton';
import api from '../services/api'; // Import service mới
import { useAuth } from '../context/AuthContext';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const GRAB_GREEN = '#00B14F';

const LoginScreen = ({ navigation }: Props) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Thêm state cho trạng thái loading
  const { signIn } = useAuth();

  const handleLogin = async () => {
    // Kiểm tra định dạng số điện thoại
    const vietnamPhoneRegex = /^0\d{9}$/;
    if (!vietnamPhoneRegex.test(phoneNumber)) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu (tối thiểu 6 ký tự).");
      return;
    }

    setLoading(true); // Bắt đầu loading

    // Gọi hàm login từ service API
    const result = await api.login(phoneNumber, password);

    setLoading(false); // Dừng loading

    if (result.success) {
      // Lưu token vào context
      await signIn(result.data);
      // Đăng nhập thành công, chuyển đến màn hình chính
      navigation.replace('MainApp', { screen: 'HomeTab' });
    } else {
      // Đăng nhập thất bại, hiển thị thông báo lỗi từ server
      Alert.alert("Đăng nhập thất bại", result.message || "Đã có lỗi không mong muốn xảy ra.");
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
              editable={!loading} // Không cho sửa khi đang loading
            />
          </View>

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Mật khẩu"
              placeholderTextColor="#8A8A8E"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.continueButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading} // Vô hiệu hóa nút khi đang loading
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('RegistrationFlow')}>
            <Text style={{ textAlign: 'center', color: '#007AFF', marginTop: 15 }}>
              Chưa có tài khoản? Đăng ký ngay
            </Text>
          </TouchableOpacity>

          <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>hoặc tiếp tục với</Text>
            <View style={styles.line} />
          </View>

          <SocialButton
            iconName="google"
            text="Đăng nhập với Google"
            onPress={() => { }}
          />
          <SocialButton
            iconName="facebook"
            text="Đăng nhập với Facebook"
            onPress={() => { }}
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
  phoneInputContainer: {
    width: '100%',
    height: 56,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInputContainer: {
    width: '100%',
    height: 56,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
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
  continueButton: {
    backgroundColor: GRAB_GREEN,
    borderRadius: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#a3d3b8',
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