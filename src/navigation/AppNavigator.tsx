// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types'; // Import từ file types

import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator.tsx';
import ParkingListScreen from '../screens/ParkingListScreen';
import ParkingDetailScreen from '../screens/ParkingDetailScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import PersonalInformationScreen from '../screens/PersonalInformationScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import WalletScreen from '../screens/WalletScreen';
import AddVehicleScreen from '../screens/AddVehicleScreen';
import VehicleDetailScreen from '../screens/VehicleDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import OnboardingScreen from '../screens/OnboardingScreen.tsx';
import RegistrationNavigator from './RegistrationNavigator.tsx';
import NotificationScreen from '../screens/NotificationScreen.tsx';
import { TouchableOpacity, Text } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>(); // Sử dụng kiểu ở đây

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        // Cấu hình chung cho header nếu cần
        screenOptions={{
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: 'Trở về',
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegistrationFlow" component={RegistrationNavigator} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ParkingList" component={ParkingListScreen} options={({ route }) => ({ title: route.params.title })} />
        <Stack.Screen name="ParkingDetail" component={ParkingDetailScreen} options={({ route }) => ({ title: route.params.name })} />
        <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} options={{ title: 'Chi tiết hoạt động' }} />
        <Stack.Screen
          name="PersonalInformation"
          component={PersonalInformationScreen}
          options={({ navigation, route }) => ({
            title: 'Chỉnh sửa hồ sơ',
            headerShown: true,
            headerRight: () => (
              <TouchableOpacity
                // Vô hiệu hóa nút nếu `canSave` là false
                disabled={!route.params?.canSave}
                onPress={() => route.params?.handleSave?.()}
                style={{ marginRight: 15 }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  // Thay đổi màu sắc dựa trên trạng thái `canSave`
                  color: route.params?.canSave ? '#00B14F' : '#ccc',
                }}>Lưu</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Vehicles" component={VehiclesScreen} options={{ title: 'Phương tiện' }} />
        <Stack.Screen name="Wallet" component={WalletScreen} options={{ title: 'Ví ParkNow' }} />
        <Stack.Screen name="AddVehicle" component={AddVehicleScreen} options={{ title: 'Thêm phương tiện' }} />
        <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} options={{ title: 'Chi tiết phương tiện' }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Đặt chỗ' }} />
        <Stack.Screen name="Notification" component={NotificationScreen} options={{ title: 'Thông báo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;