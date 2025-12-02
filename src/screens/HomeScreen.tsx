import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { PARKING_DATA } from '../data/mockData';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
// Import các component mới
import LocationBar from '../components/home/LocationBar';
import SectionHeader from '../components/home/SectionHeader';
import NearbyCard from '../components/home/NearbyCard';
import FeaturedListItem from '../components/home/FeaturedListItem';
import CurrentBookingBar from '../components/home/CurrentBookingBar';
import { getDistanceInKm } from '../utils/geolocation';
import api from '../services/api';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ParkingApiResponse {
  parkingShowInCusDto: {
    parkingId: number;
    name: string;
    address: string;
    avatar: string;
    stars: number;
  };
  priceCar: number;
  priceMoto: number;
}

interface NearbyParkingApiResponse {
  getListParkingNearestWithDistanceResponse: {
    parkingId: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    stars: number;
    avatar: string;
    isPrepayment: boolean;
    isOvernight: boolean;
  };
  priceCar: number;
  priceMoto: number;
  distance: number;
}

interface ProcessedParking {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceCar: number;
  priceMoto: number;
  avatar: string;
  isFavorite: boolean;
  imageUrl: string;
  coordinate: { latitude: number; longitude: number };
  tags: string[];
  price: number;
  distance?: number; // Khoảng cách đến bãi xe (km) - chỉ có ở nearby parkings
}

interface UpcomingBooking {
  bookingId: number;
  startTime: string;
  endTime: string;
  parkingName: string;
  parkingAddress: string;
  vehicleLicensePlate: string;
  slotName: string;
}

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [upcomingBooking, setUpcomingBooking] = useState<UpcomingBooking | null>(null);

  const [featuredParkings, setFeaturedParkings] = useState<ProcessedParking[]>([]);
  const [nearbyParkings, setNearbyParkings] = useState<ProcessedParking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNearby, setIsLoadingNearby] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Hàm lấy vị trí hiện tại
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  // Hàm lấy danh sách bãi xe gần đây
  const fetchNearbyParkings = async (location: Location.LocationObject | null) => {
    if (!location) return;

    setIsLoadingNearby(true);
    const { latitude, longitude } = location.coords;
    const distance = 10; // Khoảng cách tối đa 10km

    const result = await api.getNearbyParkings(latitude, longitude, distance);

    if (result.success && result.data) {
      const processedList: ProcessedParking[] = result.data.map((parking: NearbyParkingApiResponse) => {
        const parkingInfo = parking.getListParkingNearestWithDistanceResponse;
        
        // Tạo tags dựa trên thông tin từ API
        const tags: string[] = [];
        if (parkingInfo.isPrepayment) tags.push('Trả trước');
        if (parkingInfo.isOvernight) tags.push('Qua đêm');
        if (parking.priceCar > 0) tags.push('Ô tô');
        if (parking.priceMoto > 0) tags.push('Xe máy');
        
        return {
          id: parkingInfo.parkingId.toString(),
          name: parkingInfo.name,
          address: parkingInfo.address,
          rating: parkingInfo.stars,
          priceCar: parking.priceCar,
          priceMoto: parking.priceMoto,
          avatar: parkingInfo.avatar,
          isFavorite: false,
          imageUrl: parkingInfo.avatar,
          coordinate: { 
            latitude: parkingInfo.latitude, 
            longitude: parkingInfo.longitude 
          },
          tags: tags.length > 0 ? tags : ['Bãi xe'],
          price: parking.priceMoto || parking.priceCar,
          distance: parking.distance,
        };
      });

      setNearbyParkings(processedList);
    } else {
      console.error(result.message);
    }
    setIsLoadingNearby(false);
  };

  // Hàm lấy danh sách bãi xe nổi bật
  const fetchFeaturedParkings = async () => {
    setIsLoading(true);

    const result = await api.getFeaturedParkings();

    if (result.success && result.data) {
      const processedList: ProcessedParking[] = result.data.map((parking: ParkingApiResponse) => {
        return {
          id: parking.parkingShowInCusDto.parkingId.toString(),
          name: parking.parkingShowInCusDto.name,
          address: parking.parkingShowInCusDto.address,
          rating: parking.parkingShowInCusDto.stars,
          priceCar: parking.priceCar,
          priceMoto: parking.priceMoto,
          avatar: parking.parkingShowInCusDto.avatar,
          isFavorite: false,
          imageUrl: parking.parkingShowInCusDto.avatar,
          coordinate: { latitude: 0, longitude: 0 },
          tags: ['Xe máy', 'Ô tô'],
          price: parking.priceMoto || parking.priceCar,
        };
      });

      setFeaturedParkings(processedList);
    } else {
      console.error(result.message);
    }
    setIsLoading(false);
  };

  // Hàm lấy booking đang hoạt động
  const fetchUpcomingBooking = async () => {
    try {
      const result = await api.bookingApi.getUpcomingBooking();
      
      if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
        const bookingData = result.data[0]; // Lấy booking đầu tiên
        const booking = bookingData.bookingSearchResult || {};
        const vehicle = bookingData.vehicleInforSearchResult || {};
        const parking = bookingData.parkingSearchResult || {};
        const slot = bookingData.parkingSlotSearchResult || {};

        setUpcomingBooking({
          bookingId: booking.bookingId,
          startTime: booking.startTime,
          endTime: booking.endTime,
          parkingName: parking.name || '',
          parkingAddress: parking.address || '',
          vehicleLicensePlate: vehicle.licensePlate || '',
          slotName: slot.name || '',
        });
      } else {
        setUpcomingBooking(null);
      }
    } catch (error) {
      console.error('Error fetching upcoming booking:', error);
      setUpcomingBooking(null);
    }
  };

  // Hàm refresh toàn bộ dữ liệu
  const onRefresh = async () => {
    setRefreshing(true);
    
    // Lấy lại vị trí hiện tại
    const location = await getCurrentLocation();
    if (location) {
      setCurrentLocation(location);
    }
    
    // Reload cả 3 danh sách song song
    await Promise.all([
      fetchNearbyParkings(location || currentLocation),
      fetchFeaturedParkings(),
      fetchUpcomingBooking(),
    ]);
    
    setRefreshing(false);
  };

  // Lấy vị trí hiện tại khi mount
  useEffect(() => {
    const initLocation = async () => {
      const location = await getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      } else {
        setIsLoadingNearby(false);
      }
    };

    initLocation();
  }, []);

  // Lấy danh sách bãi xe gần đây khi có vị trí
  useEffect(() => {
    fetchNearbyParkings(currentLocation);
  }, [currentLocation]);

  // Lấy danh sách bãi xe nổi bật khi mount
  useEffect(() => {
    fetchFeaturedParkings();
  }, []);

  // Lấy upcoming booking khi mount
  useEffect(() => {
    fetchUpcomingBooking();
  }, []);

  // Quick actions data
  const quickActions = [
    { id: '1', icon: 'search', label: 'Tìm kiếm', color: '#3498db', onPress: () => navigation.navigate('ParkingList', { title: 'Tìm kiếm' }) },
    { id: '2', icon: 'wallet', label: 'Ví', color: '#e74c3c', onPress: () => navigation.navigate('Wallet') },
    { id: '3', icon: 'car', label: 'Xe của tôi', color: '#f39c12', onPress: () => navigation.navigate('Vehicles') },
    { id: '4', icon: 'help-circle', label: 'Trợ giúp', color: '#9b59b6', onPress: () => navigation.navigate('Help') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LocationBar navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: upcomingBooking ? 90 : 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498db']} // Android
            tintColor="#3498db" // iOS
            title="Đang tải..." // iOS
            titleColor="#666" // iOS
          />
        }
      >
        {/* Banner với overlay gradient */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../assets/image/home_banner.png')}
            style={styles.banner}
          />
          {/* <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Tìm bãi đỗ xe</Text>
            <Text style={styles.bannerSubtitle}>Nhanh chóng & Tiện lợi</Text>
          </View> */}
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mục "Gần đây" */}
        <SectionHeader
          title="Gần đây"
          onSeeAll={() => navigation.navigate('ParkingList', { title: 'Gần đây' })}
        />
        {isLoadingNearby ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        ) : nearbyParkings.length > 0 ? (
          <FlatList
            data={nearbyParkings}
            renderItem={({ item }) => (
              <NearbyCard
                item={item}
                onPress={() => navigation.navigate('ParkingDetail', { parkingId: item.id, name: item.name })}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy bãi xe gần đây</Text>
          </View>
        )}

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Ionicons name="gift" size={32} color="#fff" />
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoTitle}>Ưu đãi đặc biệt</Text>
              <Text style={styles.promoSubtitle}>Giảm 20% cho lần đặt đầu tiên</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Xem ngay</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Mục "Danh sách nổi bật" */}
        <SectionHeader
          title="Danh sách nổi bật"
          onSeeAll={() => navigation.navigate('ParkingList', { title: 'Danh sách nổi bật' })}
        />
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        ) : (
          <View style={styles.verticalList}>
            {featuredParkings.map(item => (
              <FeaturedListItem
                key={item.id}
                item={item}
                onPress={() => navigation.navigate('ParkingDetail', { parkingId: item.id, name: item.name })}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Thanh đặt chỗ hiện tại */}
      <CurrentBookingBar 
        booking={upcomingBooking}
        onPress={() => {
          if (upcomingBooking) {
            navigation.navigate('ActivityDetail', { bookingId: upcomingBooking.bookingId });
          }
        }}
        onClose={() => setUpcomingBooking(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  bannerContainer: {
    width: '100%',
    height: 180,
    alignSelf: 'center',
    // marginTop: 15,
    marginBottom: 5,
    // borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    paddingLeft: 25,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 6,
    paddingVertical: 18,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  horizontalList: {
    paddingLeft: 16,
  },
  promoBanner: {
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#3498db',
    elevation: 5,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  promoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 5,
  },
  verticalList: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default HomeScreen;