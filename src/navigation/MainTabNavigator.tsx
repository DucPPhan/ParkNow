// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

// Import các màn hình
import HomeScreen from '../screens/HomeScreen';
import ActivityScreen from '../screens/ActivityScreen';
import MapScreen from '../screens/MapScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'ActivityTab') {
            iconName = 'calendar';
          } else if (route.name === 'MapTab') {
            iconName = 'map-pin';
          } else if (route.name === 'AccountTab') {
            iconName = 'user';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db', // Màu của tab được chọn
        tabBarInactiveTintColor: 'gray',   // Màu của tab không được chọn
        headerShown: false, // Ẩn header mặc định của Tab Navigator
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="ActivityTab" component={ActivityScreen} options={{ title: 'Hoạt động' }} />
      <Tab.Screen name="MapTab" component={MapScreen} options={{ title: 'Bản đồ' }} />
      <Tab.Screen name="AccountTab" component={AccountScreen} options={{ title: 'Tài khoản' }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;