import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { PARKING_DATA } from '../data/mockData';
import * as Location from 'expo-location';
// Import các component mới
import LocationBar from '../components/home/LocationBar';
import SectionHeader from '../components/home/SectionHeader';
import NearbyCard from '../components/home/NearbyCard';
import FeaturedListItem from '../components/home/FeaturedListItem';
import CurrentBookingBar from '../components/home/CurrentBookingBar';
import { getDistanceInKm } from '../utils/geolocation';
import api from '../services/api';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ProcessedParking {
  id: string;
  name: string;
  address: string;
  rating: number;
  price: number;
  tags: string[];
  isFavorite: boolean;
  imageUrl: any;
  coordinate: { latitude: number; longitude: number };
  distance?: number;
  distanceBucket?: number;
}

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showBookingBar, setShowBookingBar] = useState(true);

  const [featuredParkings, setFeaturedParkings] = useState<ProcessedParking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndSortParkings = async () => {
      setIsLoading(true);

      // 1. Lấy vị trí hiện tại của người dùng
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        setIsLoading(false);
        return;
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;

      // 2. Gọi API để lấy danh sách bãi xe nổi bật
      const result = await api.getFeaturedParkings();

      if (result.success && result.data) {
        // 3. Xử lý và sắp xếp dữ liệu
        const processedList: ProcessedParking[] = result.data.map((parking: any) => {
          const distance = getDistanceInKm(
            latitude,
            longitude,
            parking.latitude,
            parking.longtitude
          );
          // Chia các bãi xe vào các "nhóm khoảng cách" (1km, 2km, 3km...)
          const distanceBucket = Math.ceil(distance);
          return { ...parking, distance, distanceBucket };
        });

        // 4. Sắp xếp theo yêu cầu: ưu tiên nhóm khoảng cách, sau đó đến rating
        processedList.sort((a, b) => {
          if (a.distanceBucket !== b.distanceBucket) {
            return (a.distanceBucket || 0) - (b.distanceBucket || 0); // Sắp xếp theo nhóm khoảng cách tăng dần
          }
          return b.rating - a.rating; // Sắp xếp theo rating giảm dần
        });

        setFeaturedParkings(processedList);
      } else {
        console.error(result.message);
      }
      setIsLoading(false);
    };

    fetchAndSortParkings();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LocationBar navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: showBookingBar ? 90 : 10 }} // Thêm padding để không bị thanh booking che
      >
        <Image
          source={require('../assets/image/home_banner.png')}
          style={styles.banner}
        />

        {/* Mục "Gần đây" */}
        <SectionHeader
          title="Gần đây"
          onSeeAll={() => navigation.navigate('ParkingList', { title: 'Gần đây' })}
        />
        <FlatList
          data={PARKING_DATA}
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

        {/* Mục "Danh sách nổi bật" */}
        <SectionHeader
          title="Danh sách nổi bật"
          onSeeAll={() => navigation.navigate('ParkingList', { title: 'Danh sách nổi bật' })}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 20 }} />
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
      {showBookingBar && <CurrentBookingBar onClose={() => setShowBookingBar(false)} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Màu nền xám nhẹ
  },
  banner: {
    width: '92%',
    height: 150,
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 10,
  },
  horizontalList: {
    paddingLeft: 16,
  },
  verticalList: {
    paddingHorizontal: 16,
  },
});

export default HomeScreen;