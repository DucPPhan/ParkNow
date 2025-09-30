import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, MainTabParamList } from '../navigation/types';

import SearchBar from '../components/SearchBar';
import ParkingCard from '../components/ParkingCard';
import ParkingListItem from '../components/ParkingListItem';
// SỬA LỖI: Import đúng tên biến 'parkings'
import { PARKING_DATA } from '../data/mockData';

type ParentNavigationProp = StackNavigationProp<RootStackParamList>;
type CurrentScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'HomeTab'>;
type HomeScreenNavigationProp = CompositeNavigationProp<
  ParentNavigationProp,
  CurrentScreenNavigationProp
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

// SỬA LỖI: Đổi tên prop 'onSeeAll_press' thành 'onSeeAllPress'
const SectionHeader = ({ title, onSeeAllPress }: { title: string; onSeeAllPress: () => void }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity onPress={onSeeAllPress}>
      <Text style={styles.seeAllText}>Xem tất cả</Text>
    </TouchableOpacity>
  </View>
);

const HomeScreen = ({ navigation }: Props) => {
  // SỬA LỖI: Sử dụng đúng tên biến 'parkings'
  const nearbyParkings = PARKING_DATA.slice(0, 4);
  const topRatedParkings = PARKING_DATA.slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Chào buổi sáng,</Text>
            <Text style={styles.userName}>ParkNow User</Text>
          </View>
          <TouchableOpacity onPress={() => console.log('Navigate to Notifications')}>
            <Ionicons name="notifications-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        <SearchBar onPress={() => console.log('Navigate to Search')} />

        <Image
          source={require('../assets/image/home_banner.png')}
          style={styles.banner}
        />

        {/* Top Rated List */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => navigation.navigate('ParkingList', { title: 'Đánh giá cao' })}>
            <Text style={styles.sectionTitle}>Đánh giá cao</Text>
            <Text style={styles.seeAll}>Xem thêm</Text>
          </TouchableOpacity>
          <FlatList
            data={topRatedParkings}
            renderItem={({ item }) => (
              <ParkingCard
                item={item}
                onPress={() => navigation.navigate('ParkingDetail', { parkingId: item.id, name: item.name })}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        {/* Nearby List */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => navigation.navigate('ParkingList', { title: 'Bãi xe gần đây' })}>
            <Text style={styles.sectionTitle}>Bãi xe gần đây</Text>
            <Text style={styles.seeAll}>Xem thêm</Text>
          </TouchableOpacity>
          <FlatList
            data={nearbyParkings}
            renderItem={({ item }) => (
              <ParkingCard
                item={item}
                onPress={() => navigation.navigate('ParkingDetail', { parkingId: item.id, name: item.name })}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#8A8A8E',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  banner: {
    width: '90%',
    height: 140,
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 10,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  horizontalList: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  verticalList: {
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  seeAll: {
    fontSize: 15,
    color: '#3498db',
    fontWeight: '600',
  },
  listContainer: {
    paddingLeft: 20,
  },
});

export default HomeScreen;