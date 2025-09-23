// src/screens/PersonalInformationScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const PersonalInformationScreen = () => {
  // Sử dụng state để quản lý giá trị của các trường input
  const [fullName, setFullName] = useState('Lê Văn A');
  const [phone, setPhone] = useState('0901234567');
  const [email, setEmail] = useState('levana@email.com');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('01/01/1990');

  const handleSaveChanges = () => {
    // Logic lưu thay đổi sẽ được xử lý ở đây
    Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/image/home_banner.png')}
            style={styles.avatar}
          />
          <Text style={styles.headerText}>Chỉnh sửa thông tin</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <FormInput
            label="Họ và tên"
            icon="user"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nhập họ và tên của bạn"
          />
          <FormInput
            label="Số điện thoại"
            icon="phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
          <FormInput
            label="Email"
            icon="mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email"
            keyboardType="email-address"
            editable={false} // Không cho sửa email
          />
          <FormInput
            label="Giới tính"
            icon="users"
            value={gender}
            onChangeText={setGender}
            placeholder="Chọn giới tính"
          />
          <FormInput
            label="Ngày sinh"
            icon="calendar"
            value={dob}
            onChangeText={setDob}
            placeholder="DD/MM/YYYY"
          />
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Lưu thay đổi"
            onPress={handleSaveChanges}
            backgroundColor="#3498db"
            textColor="#ffffff"
            // minWidth={'100%'}
            borderRadius={12}
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default PersonalInformationScreen;