// src/navigation/types.ts
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp, NavigatorScreenParams } from '@react-navigation/native';
// Sửa đường dẫn import ở đây
import { Activity } from '../components/ActivityCard';

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  type: 'car' | 'motorcycle';
  isDefault: boolean;
  color?: string;
};

export type BookingSlot = {
  id: number;
  slotNumber: string;
  status: 'available' | 'occupied' | 'reserved';
  vehicleType: string;
  hourlyRate: number;
  rowIndex?: number;
  columnIndex?: number;
  isAvailable?: boolean;
  floorId?: number;
  trafficId?: number;
};

export type BookingDetails = {
  id: number;
  parkingId: number;
  parkingName: string;
  slotId: number;
  slotNumber: string;
  vehicleId?: number;
  vehiclePlate: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentMethod: string;
  bookingCode: string;
  createdAt: string;
  notes?: string;
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
  CompleteProfile: undefined;
  ParkingList: { title: string };
  ParkingDetail: { parkingId: string; name: string };
  ActivityDetail: { activity: Activity };
  PersonalInformation: {
    handleSave?: () => void;
    canSave?: boolean;
  } | undefined;
  Vehicles: undefined;
  Wallet: undefined;
  AddVehicle: undefined;
  VehicleDetail: { vehicle: Vehicle };
  Booking: { parkingId: number; parkingName: string };
  RegistrationFlow: undefined;
  Notification: undefined;
  FavoriteAddress: undefined;
  Help: undefined;
  Settings: undefined;
  AboutUs: undefined;
  ChangePassword: undefined;
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
export type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;
export type RegistrationStackParamList = {
  Step1_Phone: undefined;
  Step2_Gmail: undefined;
  Step3_OTP: undefined;
  Step4_Password: undefined;
};