import React from 'react';
import { StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import ParkingListItem from '../components/ParkingListItem';
// Sử dụng dữ liệu tập trung từ mockData
import { PARKING_DATA } from '../data/mockData';
import { RootStackParamList } from '../navigation/types';

type ParkingListScreenRouteProp = RouteProp<RootStackParamList, 'ParkingList'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const ParkingListScreen = () => {
    const route = useRoute<ParkingListScreenRouteProp>();
    const navigation = useNavigation<NavigationProp>();

    // Lấy title từ màn hình Home truyền qua
    const { title } = route.params;

    // Sử dụng dữ liệu chung
    const data = PARKING_DATA;

    const renderItem = ({ item }: { item: typeof PARKING_DATA[0] }) => (
        // SỬA LỖI:
        // 1. Dùng spread operator {...item} để truyền các thuộc tính của item
        // 2. Truyền trực tiếp prop 'navigation'
        <ParkingListItem
            //   {...item}
            item={item}
            onPress={() => {
                navigation.navigate('ParkingDetail', {
                    parkingId: item.id,
                    name: item.name
                })
            }}
            navigation={navigation}
        />
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListHeaderComponent={<Text style={styles.header}>{title}</Text>}
            // contentContainerStyle={styles.container}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        margin: 20,
    },
});

export default ParkingListScreen;