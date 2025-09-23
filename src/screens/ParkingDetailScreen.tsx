// src/screens/ParkingDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MapView, { Marker } from 'react-native-maps'; // Import MapView
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../navigation/types';

// Giả sử chúng ta nhận được dữ liệu bãi đỗ qua navigation params
// Sẽ cập nhật navigation sau
const PARKING_DETAIL_DATA = {
  id: '1',
  name: 'Bãi xe Ga Sài Gòn',
  address: '1 Nguyễn Thông, Phường 9, Quận 3, Thành phố Hồ Chí Minh',
  rating: 4.5,
  distance: '1.2 km',
  price: '15.000đ/giờ',
  openingHours: '6:00 - 23:00',
  imageUrl: require('../assets/image/home_banner.png'),
  description: 'Bãi đỗ xe rộng rãi, an toàn với hệ thống camera giám sát 24/7. Cung cấp dịch vụ giữ xe máy và ô tô. Vị trí thuận lợi gần trung tâm thành phố.',
  coordinate: {
    latitude: 10.7850,
    longitude: 106.6853,
  },
};

const ParkingDetailScreen = () => {
  const item = PARKING_DETAIL_DATA;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Image source={item.imageUrl} style={styles.image} />
        
        <View style={styles.contentContainer}>
          {/* Info Header */}
          <View style={styles.header}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#f39c12" />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          </View>
          <Text style={styles.address}>{item.address}</Text>

          {/* Extra Info */}
          <View style={styles.extraInfoContainer}>
            <View style={styles.infoBox}>
              <Icon name="clock" size={24} color="#3498db" />
              <Text style={styles.infoText}>{item.openingHours}</Text>
            </View>
            <View style={styles.infoBox}>
               <Icon name="dollar-sign" size={24} color="#27ae60" />
              <Text style={styles.infoText}>{item.price}</Text>
            </View>
            <View style={styles.infoBox}>
              <Icon name="map-pin" size={24} color="#e74c3c" />
              <Text style={styles.infoText}>{item.distance}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {/* Map */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vị trí trên bản đồ</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: item.coordinate.latitude,
                longitude: item.coordinate.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false} // Vô hiệu hóa cuộn/zoom trên bản đồ nhỏ
            >
              <Marker coordinate={item.coordinate} title={item.name} />
            </MapView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Button 
            title="Đặt chỗ ngay"
            onPress={() => navigation.navigate('Booking', {
                parkingId: item.id,
                parkingName: item.name
            })}
            backgroundColor="#3498db"
            textColor="#ffffff"
            // minWidth={100}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    container: {
      flex: 1,
    },
    image: {
      width: '100%',
      height: 250,
    },
    contentContainer: {
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    name: {
      flex: 1, // Cho phép text xuống dòng nếu quá dài
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
      marginLeft: 10,
    },
    ratingText: {
      marginLeft: 5,
      fontSize: 16,
      fontWeight: 'bold',
    },
    address: {
      fontSize: 15,
      color: '#777',
      marginTop: 5,
      marginBottom: 20,
    },
    extraInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        backgroundColor: '#f8f8f8',
        paddingVertical: 15,
        borderRadius: 12,
    },
    infoBox: {
        alignItems: 'center',
    },
    infoText: {
        marginTop: 5,
        fontSize: 14,
        color: '#555',
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: '#555',
    },
    map: {
      height: 200,
      borderRadius: 12,
    },
    bottomBar: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      backgroundColor: '#ffffff',
    }
  });

export default ParkingDetailScreen;