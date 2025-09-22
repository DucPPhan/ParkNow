// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
  FlatList, Alert, SafeAreaView, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../navigation/types'; // Import từ file types
import Icon from 'react-native-vector-icons/Feather';
import SearchBar from '../components/SearchBar';
import ParkingCard from '../components/ParkingCard';

// ... dữ liệu giả NEARBY_DATA, TOP_RATED_DATA ...
const NEARBY_DATA = [
  { id: '1', name: 'Bãi xe Ga Sài Gòn', address: '1 Nguyễn Thông, P. 9, Q. 3', rating: 4.5, imageUrl: require('../assets/image/home_banner.png')},
  { id: '2', name: 'Bãi xe Nowzone', address: '235 Nguyễn Văn Cừ, P. 4, Q. 5', rating: 4.2, imageUrl: require('../assets/image/home_banner.png')},
];

const TOP_RATED_DATA = [
  { id: '3', name: 'Bãi xe Sân bay Tân Sơn Nhất', address: 'Trường Sơn, P. 2, Q. Tân Bình', rating: 4.9, imageUrl: require('../assets/image/home_banner.png')},
  { id: '4', name: 'Bãi xe Dinh Độc Lập', address: '135 Nam Kỳ Khởi Nghĩa, Q. 1', rating: 4.8, imageUrl: require('../assets/image/home_banner.png')},
];

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                {/* Header, SearchBar, Banner... */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerGreeting}>Hi, Le!</Text>
                        <Text style={styles.headerSubText}>Tìm chỗ đậu xe nào</Text>
                    </View>
                    <TouchableOpacity onPress={() => Alert.alert('Thông báo', 'Xem thông báo!')}>
                        <Icon name="bell" size={26} color="#333" />
                    </TouchableOpacity>
                </View>

                <SearchBar onPress={() => Alert.alert('Tìm kiếm', 'Chuyển đến màn hình tìm kiếm!')} />

                <View style={styles.bannerContainer}>
                    <Image
                        source={require('../assets/image/home_banner.png')}
                        style={styles.bannerImage}
                    />
                </View>

                {/* Nearby List */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.sectionHeader} onPress={() => navigation.navigate('ParkingList', { title: 'Bãi xe gần đây' })}>
                        <Text style={styles.sectionTitle}>Bãi xe gần đây</Text>
                        <Text style={styles.seeAll}>Xem thêm</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={NEARBY_DATA}
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

                {/* Top Rated List */}
                <View style={styles.section}>
                     <TouchableOpacity style={styles.sectionHeader} onPress={() => navigation.navigate('ParkingList', { title: 'Đánh giá cao' })}>
                        <Text style={styles.sectionTitle}>Đánh giá cao</Text>
                        <Text style={styles.seeAll}>Xem thêm</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={TOP_RATED_DATA}
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

// ... styles ...
const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    headerGreeting: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#333',
    },
    headerSubText: {
      fontSize: 16,
      color: '#777',
    },
    bannerContainer: {
      marginHorizontal: 20,
      borderRadius: 15,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    bannerImage: {
      width: '100%',
      height: 160,
      resizeMode: 'cover',
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
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