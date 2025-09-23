// src/navigation/types.ts
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
// Sửa đường dẫn import ở đây
import { ActivityItem } from '../screens/ActivityScreen';

// Định nghĩa tất cả các route và tham số của chúng ở đây
export type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  ParkingList: { title: string };
  ParkingDetail: { parkingId: string; name: string };
  ActivityDetail: { activity: ActivityItem };
};

// Kiểu cho navigation prop ở các màn hình khác nhau
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainApp'>;
export type ParkingListNavigationProp = StackNavigationProp<RootStackParamList, 'ParkingList'>;
export type ActivityScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainApp'>;

// Kiểu cho route prop để lấy params
export type ParkingDetailScreenRouteProp = RouteProp<RootStackParamList, 'ParkingDetail'>;
export type ActivityDetailScreenRouteProp = RouteProp<RootStackParamList, 'ActivityDetail'>;