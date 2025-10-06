import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { PARKING_DATA } from '../data/mockData';

// Import các component mới
import LocationBar from '../components/home/LocationBar';
import SectionHeader from '../components/home/SectionHeader';
import NearbyCard from '../components/home/NearbyCard';
import FeaturedListItem from '../components/home/FeaturedListItem';
import CurrentBookingBar from '../components/home/CurrentBookingBar';


type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showBookingBar, setShowBookingBar] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <LocationBar />
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
        <View style={styles.verticalList}>
          {PARKING_DATA.map((item: {
            id: string;
            name: string;
            address: string;
            rating: number;
            imageUrl: any;
            coordinate: {
              latitude: number;
              longitude: number;
            };
            tags: string[];
            isFavorite: boolean;
            price: number;
          }) => (
            <FeaturedListItem
              key={item.id}
              item={item}
              onPress={() => navigation.navigate('ParkingDetail', { parkingId: item.id, name: item.name })}
            />
          ))}
        </View>
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