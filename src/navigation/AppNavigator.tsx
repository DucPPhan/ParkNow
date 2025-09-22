// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import các màn hình của bạn ở đây (chúng ta sẽ tạo chúng ngay sau đây)
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} // Ẩn header cho màn hình Login
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Trang chủ ParkNow' }} // Đặt tiêu đề cho màn hình Home
        />
        {/* Thêm các màn hình khác của bạn ở đây */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;