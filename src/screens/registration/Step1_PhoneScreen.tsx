import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RegistrationStackParamList } from '../../navigation/types';
import { useRegistration } from '../../context/RegistrationContext';
import Button from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RegistrationStackParamList, 'Step1_Phone'>;

const Step1_PhoneScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { updateRegistrationData } = useRegistration();
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    const vietnamPhoneRegex = /^0\d{9}$/;
    if (!vietnamPhoneRegex.test(phone)) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ.");
      return;
    }
    updateRegistrationData({ phone });
    navigation.navigate('Step2_PersonalInfo');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Số điện thoại của bạn là gì?</Text>
          <Text style={styles.subtitle}>
            Chúng tôi sẽ sử dụng số điện thoại này để xác thực tài khoản.
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={22} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
              autoFocus
            />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Tiếp theo" onPress={handleNext} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  content: {
    flexGrow: 1, // Thay flex: 1 bằng flexGrow: 1 cho ScrollView
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 40,
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
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
});

export default Step1_PhoneScreen;