import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RegistrationStackParamList } from './types';
import { RegistrationProvider } from '../context/RegistrationContext';

// Import các màn hình và header
import Step1_PhoneScreen from '../screens/registration/Step1_PhoneScreen';
import Step2_PersonalInfoScreen from '../screens/registration/Step2_PersonalInfoScreen';
import Step3_IDCardScreen from '../screens/registration/Step3_IDCardScreen';
import RegistrationHeader from '../components/RegistrationHeader';

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
              title = 'Tạo tài khoản';
              step = 1;
            } else if (route.name === 'Step2_PersonalInfo') {
              title = 'Thông tin cá nhân';
              step = 2;
            } else if (route.name === 'Step3_IDCard') {
              title = 'Thông tin định danh';
              step = 3;
            }
            return <RegistrationHeader title={title} step={step} totalSteps={3} />;
          },
        }}
      >
        <Stack.Screen name="Step1_Phone" component={Step1_PhoneScreen} />
        <Stack.Screen name="Step2_PersonalInfo" component={Step2_PersonalInfoScreen} />
        <Stack.Screen name="Step3_IDCard" component={Step3_IDCardScreen} />
      </Stack.Navigator>
    </RegistrationProvider>
  );
};

export default RegistrationNavigator;