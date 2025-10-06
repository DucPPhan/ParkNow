// src/navigation/types.ts
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp, NavigatorScreenParams } from '@react-navigation/native';
// Sửa đường dẫn import ở đây
import { ActivityItem } from '../screens/ActivityScreen';

export type Vehicle = {
    id: string;
    name: string;
    plate: string;
    type: 'car' | 'motorcycle';
    isDefault: boolean;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ActivityTab: undefined;
  MapTab: undefined;
  AccountTab: undefined;
};

// Định nghĩa tất cả các route và tham số của chúng ở đây
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  MainApp: NavigatorScreenParams<MainTabParamList>;
  ParkingList: { title: string };
  ParkingDetail: { parkingId: string; name: string };
  ActivityDetail: { activity: ActivityItem };
  PersonalInformation: undefined;
  Vehicles: undefined;
  Wallet: undefined;
  AddVehicle: undefined;
  VehicleDetail: { vehicle: Vehicle };
  Booking: { parkingId: string; parkingName: string };
  RegistrationFlow: undefined;
  Notification: undefined;
};

// Kiểu cho navigation prop ở các màn hình khác nhau
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainApp'>;
export type ParkingListNavigationProp = StackNavigationProp<RootStackParamList, 'ParkingList'>;
export type ActivityScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainApp'>;
export type BookingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Booking'>;

// Kiểu cho route prop để lấy params
export type ParkingDetailScreenRouteProp = RouteProp<RootStackParamList, 'ParkingDetail'>;
export type ActivityDetailScreenRouteProp = RouteProp<RootStackParamList, 'ActivityDetail'>;
export type RegistrationStackParamList = {
  Step1_Phone: undefined;
  Step2_PersonalInfo: undefined;
  Step3_IDCard: undefined;
};