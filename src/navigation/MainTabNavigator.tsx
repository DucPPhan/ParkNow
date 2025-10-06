import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';

// Import các màn hình
import HomeScreen from '../screens/HomeScreen';
import ActivityScreen from '../screens/ActivityScreen';
import MapScreen from '../screens/MapScreen';
import AccountScreen from '../screens/AccountScreen';

// SỬA LỖI: Import icon từ @expo/vector-icons
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home-outline';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MapTab') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'ActivityTab') {
            iconName = focused ? 'reader' : 'reader-outline';
          } else if (route.name === 'AccountTab') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          // SỬA LỖI: Sử dụng component <Ionicons />
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db', // Màu xanh lá khi được chọn
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="MapTab" component={MapScreen} options={{ title: 'Bản đồ' }} />
      <Tab.Screen name="ActivityTab" component={ActivityScreen} options={{ title: 'Hoạt động' }} />
      <Tab.Screen name="AccountTab" component={AccountScreen} options={{ title: 'Tài khoản' }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;