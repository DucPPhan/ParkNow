// src/screens/ParkingListScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Alert } from 'react-native';
import ParkingListItem from '../components/ParkingListItem';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Dữ liệu giả cho màn hình danh sách
const PARKING_LIST_DATA = [
    { id: '1', name: 'Bãi xe Ga Sài Gòn', address: '1 Nguyễn Thông, P. 9, Q. 3', rating: 4.5, distance: '1.2 km', imageUrl: require('../assets/image/home_banner.png') },
    { id: '2', name: 'Bãi xe Nowzone', address: '235 Nguyễn Văn Cừ, P. 4, Q. 5', rating: 4.2, distance: '2.5 km', imageUrl: require('../assets/image/home_banner.png') },
    { id: '3', name: 'Bãi xe Sân bay Tân Sơn Nhất', address: 'Trường Sơn, P. 2, Q. Tân Bình', rating: 4.9, distance: '8.1 km', imageUrl: require('../assets/image/home_banner.png') },
    { id: '4', name: 'Bãi xe Dinh Độc Lập', address: '135 Nam Kỳ Khởi Nghĩa, P. Bến Thành, Q. 1', rating: 4.8, distance: '3.0 km', imageUrl: require('../assets/image/home_banner.png') },
    // Thêm dữ liệu khác nếu muốn
];

type RootStackParamList = {
    ParkingList: undefined;
    ParkingDetail: { parkingId: string; name: string }; // Truyền tham số
    // ... các route khác
};
type ParkingListNavigationProp = StackNavigationProp<RootStackParamList, 'ParkingList'>;

const ParkingListScreen = () => {
    const navigation = useNavigation<ParkingListNavigationProp>();
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <FlatList
                    data={PARKING_LIST_DATA}
                    renderItem={({ item }) => (
                        <ParkingListItem
                            item={item}
                            onPress={() => navigation.navigate('ParkingDetail', {
                                parkingId: item.id,
                                name: item.name
                            })}
                        />
                    )}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={
                        <Text style={styles.headerTitle}>Bãi xe gần đây</Text>
                    }
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    container: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 15,
    },
    listContainer: {
        paddingTop: 10,
    }
});

export default ParkingListScreen;