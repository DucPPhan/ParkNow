import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RegistrationStackParamList } from './types';
import { RegistrationProvider } from '../context/RegistrationContext';

import RegistrationHeader from '../components/RegistrationHeader';
import Step1PhoneScreen from '../screens/registration/Step1PhoneScreen';
import Step2EmailScreen from '../screens/registration/Step2EmailScreen';
import Step3OtpScreen from '../screens/registration/Step3OtpScreen';
import Step4PasswordScreen from '../screens/registration/Step4PasswordScreen';

const Stack = createStackNavigator<RegistrationStackParamList>();

const RegistrationNavigator = () => {
  return (
    <RegistrationProvider>
      <Stack.Navigator
        screenOptions={{
          // Sử dụng header tùy chỉnh cho tất cả các màn hình trong stack này
          header: (props) => {
            const { route } = props;
            let title = '';
            let step = 0;
            if (route.name === 'Step1_Phone') {
              title = 'Nhập số điện thoại';
              step = 1;
            } else if (route.name === 'Step2_Gmail') {
              title = 'Nhập email';
              step = 2;
            } else if (route.name === 'Step3_OTP') {
              title = 'Nhập mã OTP';
              step = 3;
            } else if (route.name === 'Step4_Password') {
              title = 'Tạo mật khẩu';
              step = 4;
            }
            return <RegistrationHeader title={title} step={step} totalSteps={4} />;
          },
        }}
      >
        <Stack.Screen name="Step1_Phone" component={Step1PhoneScreen} />
        <Stack.Screen name="Step2_Gmail" component={Step2EmailScreen} />
        <Stack.Screen name="Step3_OTP" component={Step3OtpScreen} />
        <Stack.Screen name="Step4_Password" component={Step4PasswordScreen} />
      </Stack.Navigator>
    </RegistrationProvider>
  );
};

export default RegistrationNavigator;