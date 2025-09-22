// src/navigation/types.ts
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

// Định nghĩa tất cả các route và tham số của chúng ở đây
export type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  ParkingList: { title: string };
  ParkingDetail: { parkingId: string; name: string };
};

// Kiểu cho navigation prop ở các màn hình khác nhau
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainApp'>;
export type ParkingListNavigationProp = StackNavigationProp<RootStackParamList, 'ParkingList'>;

// Kiểu cho route prop để lấy params
export type ParkingDetailScreenRouteProp = RouteProp<RootStackParamList, 'ParkingDetail'>;