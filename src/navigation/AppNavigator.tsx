// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types'; // Import từ file types

import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import ParkingListScreen from '../screens/ParkingListScreen';
import ParkingDetailScreen from '../screens/ParkingDetailScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';

const Stack = createStackNavigator<RootStackParamList>(); // Sử dụng kiểu ở đây

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ParkingList" component={ParkingListScreen} options={({ route }) => ({ title: route.params.title })} />
        <Stack.Screen name="ParkingDetail" component={ParkingDetailScreen} options={({ route }) => ({ title: route.params.name })} />
          <Stack.Screen
          name="ActivityDetail"
          component={ActivityDetailScreen}
          options={{ title: 'Chi tiết hoạt động' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;