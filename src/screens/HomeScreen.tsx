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
}

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showBookingBar, setShowBookingBar] = useState(true);

  const [featuredParkings, setFeaturedParkings] = useState<ProcessedParking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedParkings = async () => {
      setIsLoading(true);

      // Gọi API để lấy danh sách bãi xe nổi bật
      const result = await api.getFeaturedParkings();

      if (result.success && result.data) {
        // Xử lý dữ liệu từ API response
        const processedList: ProcessedParking[] = result.data.map((parking: ParkingApiResponse) => {
          return {
            id: parking.parkingShowInCusDto.parkingId.toString(),
            name: parking.parkingShowInCusDto.name,
            address: parking.parkingShowInCusDto.address,
            rating: parking.parkingShowInCusDto.stars,
            priceCar: parking.priceCar,
            priceMoto: parking.priceMoto,
            avatar: parking.parkingShowInCusDto.avatar,
            isFavorite: false, // Default value, có thể cập nhật từ API khác
            imageUrl: parking.parkingShowInCusDto.avatar,
          };
        });

        setFeaturedParkings(processedList);
      } else {
        console.error(result.message);
      }
      setIsLoading(false);
    };

    fetchFeaturedParkings();
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