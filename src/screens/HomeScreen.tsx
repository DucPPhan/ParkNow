// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import ParkingCard from '../components/ParkingCard';

// Dữ liệu giả để hiển thị
const NEARBY_DATA = [
  {
    id: '1',
    name: 'Bãi xe Ga Sài Gòn',
    address: '1 Nguyễn Thông, P. 9, Q. 3',
    rating: 4.5,
    imageUrl: require('../assets/image/home_banner.png'), // Tạo ảnh giả trong assets
  },
  {
    id: '2',
    name: 'Bãi xe Nowzone',
    address: '235 Nguyễn Văn Cừ, P. 4, Q. 5',
    rating: 4.2,
    imageUrl: require('../assets/image/home_banner.png'), // Tạo ảnh giả trong assets
  },
];

const TOP_RATED_DATA = [
  {
    id: '3',
    name: 'Bãi xe Sân bay Tân Sơn Nhất',
    address: 'Trường Sơn, P. 2, Q. Tân Bình',
    rating: 4.9,
    imageUrl: require('../assets/image/home_banner.png'), // Tạo ảnh giả trong assets
  },
  {
    id: '4',
    name: 'Bãi xe Dinh Độc Lập',
    address: '135 Nam Kỳ Khởi Nghĩa, P. Bến Thành, Q. 1',
    rating: 4.8,
    imageUrl: require('../assets/image/home_banner.png'), // Tạo ảnh giả trong assets
  },
];


const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Xin chào!</Text>
        {/* Có thể thêm Icon ở đây */}
      </View>

      {/* Search Bar */}
      <SearchBar onPress={() => Alert.alert('Thông báo', 'Chuyển đến màn hình tìm kiếm!')} />

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={require('../assets/image/home_banner.png')}
          style={styles.bannerImage}
        />
      </View>

      {/* Nearby List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gần bạn</Text>
        <FlatList
          data={NEARBY_DATA}
          renderItem={({ item }) => (
            <ParkingCard 
              item={item} 
              onPress={() => Alert.alert('Chi tiết', `Bạn đã chọn ${item.name}`)}
            />
          )}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Top Rated List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đánh giá tốt</Text>
        <FlatList
          data={TOP_RATED_DATA}
          renderItem={({ item }) => (
            <ParkingCard 
              item={item} 
              onPress={() => Alert.alert('Chi tiết', `Bạn đã chọn ${item.name}`)}
            />
          )}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  bannerContainer: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden', // Đảm bảo ảnh không tràn ra ngoài bo góc
    elevation: 5,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 10,
  },
  listContainer: {
    paddingLeft: 20,
  },
});

export default HomeScreen;