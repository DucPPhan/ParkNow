// src/data/mockData.ts
import { Vehicle } from '../navigation/types';
import { ActivityItem } from '../screens/ActivityScreen';

// Thêm tọa độ vào đây
export const PARKING_DATA = [
  { id: '1', name: 'Bãi xe Ga Sài Gòn', address: '1 Nguyễn Thông, P. 9, Q. 3', rating: 4.5, imageUrl: require('../assets/image/home_banner.png'), coordinate: { latitude: 10.7850, longitude: 106.6853 }, tags: ['Trả trước', 'Xe máy', 'Qua đêm'], isFavorite: true, price: 15000},
  { id: '2', name: 'Bãi xe Nowzone', address: '235 Nguyễn Văn Cừ, P. 4, Q. 5', rating: 4.2, imageUrl: require('../assets/image/home_banner.png'), coordinate: { latitude: 10.7606, longitude: 106.6818 }, tags: ['Trả trước', 'Xe máy'], isFavorite: false, price: 15000},
  { id: '3', name: 'Sân bay Tân Sơn Nhất', address: 'Trường Sơn, P. 2, Q. Tân Bình', rating: 4.9, imageUrl: require('../assets/image/home_banner.png'), coordinate: { latitude: 10.8187, longitude: 106.6585 }, tags: ['Trả trước', 'Ô tô', 'Qua đêm'], isFavorite: true, price: 15000},
  { id: '4', name: 'Dinh Độc Lập', address: '135 Nam Kỳ Khởi Nghĩa, Q. 1', rating: 4.8, imageUrl: require('../assets/image/home_banner.png'), coordinate: { latitude: 10.7770, longitude: 106.6953 }, tags: ['Trả trước', 'Xe máy'], isFavorite: false, price: 15000},
];

export const UPCOMING_DATA: ActivityItem[] = [
    { id: '1', name: 'Bãi xe Ga Sài Gòn', date: '24/09/2025', time: '14:00 - 16:00', status: 'Sắp tới', imageUrl: require('../assets/image/home_banner.png'), licensePlate: '51A-123.45', vehicleType: 'Ô tô'},
];
export const HISTORY_DATA: ActivityItem[] = [
    { id: '2', name: 'Bãi xe Nowzone', date: '15/09/2025', time: '09:00 - 11:30', status: 'Hoàn thành', imageUrl: require('../assets/image/home_banner.png'), licensePlate: '72D-543.21', vehicleType: 'Xe máy'},
];

export const VEHICLES_DATA: Vehicle[] = [
  { id: '1', name: 'Honda Wave RSX', plate: '72D1-54321', type: 'motorcycle', isDefault: true },
  { id: '2', name: 'Mazda CX-5', plate: '51A-12345', type: 'car', isDefault: false },
];