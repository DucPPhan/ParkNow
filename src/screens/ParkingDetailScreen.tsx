// src/screens/ParkingDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MapView, { Marker } from 'react-native-maps'; // Import MapView
import Button from '../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationProp, ParkingDetailScreenRouteProp } from '../navigation/types';
import api from '../services/api';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

// Interface definitions
interface TimeLine {
  timeLineId: number;
  name: string;
  price: number;
  isActive: boolean;
  startTime: string;
  endTime: string;
  extraFee: number;
}

interface Traffic {
  trafficId: number;
  name: string;
}

interface ParkingPrice {
  parkingPriceId: number;
  parkingPriceName: string;
  startingTime: number;
  traffic: Traffic;
  extraTimeStep: number;
  timeLines: TimeLine[];
  penaltyPrice: number;
  penaltyPriceStepTime: number;
}

interface ParkingSpotImage {
  parkingSpotImageId: number;
  imgPath: string;
}

interface ParkingData {
  parkingId: number;
  name: string;
  address: string;
  description: string;
  stars: number;
  totalStars: number;
  starsCount: number;
  motoSpot: number;
  carSpot: number;
  isFull: boolean;
  isPrepayment: boolean;
  isOvernight: boolean;
  parkingHasPrices: Array<{ parkingPrice: ParkingPrice }>;
  parkingSpotImages: ParkingSpotImage[];
}

const ParkingDetailScreen = () => {
  const [parkingData, setParkingData] = useState<ParkingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<ParkingDetailScreenRouteProp>();

  // Mock coordinate for demo - in real app, this would come from API
  const mockCoordinate = {
    latitude: 10.7850,
    longitude: 106.6853,
  };

  useEffect(() => {
    fetchParkingDetail();
  }, []);

  const fetchParkingDetail = async () => {
    try {
      setLoading(true);
      // Get parkingId from route params
      const { parkingId } = route.params;
      
      // Call the real API
      const response = await api.getParkingDetail(parseInt(parkingId));
      
      if (response.success && response.data) {
        setParkingData(response.data.parking || response.data);
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể tải thông tin bãi đỗ xe');
      }
    } catch (error) {
      console.error('Error fetching parking detail:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin bãi đỗ xe');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const renderPriceCard = (parkingPrice: ParkingPrice) => (
    <View key={parkingPrice.parkingPriceId} style={styles.priceCard}>
      <View style={styles.priceHeader}>
        <FontAwesome 
          name={parkingPrice.traffic.name === 'Ô tô' ? 'car' : 'motorcycle'} 
          size={20} 
          color={parkingPrice.traffic.name === 'Ô tô' ? '#3498db' : '#e74c3c'} 
        />
        <Text style={styles.priceTitle}>{parkingPrice.traffic.name}</Text>
      </View>
      
      {parkingPrice.timeLines.map((timeLine) => (
        <View key={timeLine.timeLineId} style={styles.timeLineItem}>
          <Text style={styles.timeLineName}>{timeLine.name}</Text>
          <Text style={styles.timeLinePrice}>{formatPrice(timeLine.price)}</Text>
        </View>
      ))}
      
      <View style={styles.penaltyInfo}>
        <Text style={styles.penaltyText}>
          Phí phạt quá giờ: {formatPrice(parkingPrice.penaltyPrice)}/{parkingPrice.penaltyPriceStepTime} phút
        </Text>
      </View>
    </View>
  );

  const renderFeatureBadge = (icon: string, label: string, isActive: boolean, key: string) => (
    <View key={key} style={[styles.featureBadge, isActive ? styles.featureActive : styles.featureInactive]}>
      <Icon name={icon} size={16} color={isActive ? '#27ae60' : '#95a5a6'} />
      <Text style={[styles.featureText, isActive ? styles.featureTextActive : styles.featureTextInactive]}>
        {label}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!parkingData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color="#e74c3c" />
          <Text style={styles.errorText}>Không thể tải thông tin bãi đỗ xe</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: (parkingData.parkingSpotImages && parkingData.parkingSpotImages[activeImageIndex]) ? 
              parkingData.parkingSpotImages[activeImageIndex].imgPath : 
              'https://via.placeholder.com/600x400' 
            }} 
            style={styles.image} 
          />
          <View style={styles.imageOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="#ffffff" />
            </TouchableOpacity>
            {parkingData.isFull && (
              <View style={styles.fullBadge}>
                <Text style={styles.fullBadgeText}>HẾT CHỖ</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          {/* Header Info */}
          <View style={styles.header}>
            <Text style={styles.name}>{parkingData.name}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={18} color="#f39c12" />
              <Text style={styles.ratingText}>{(parkingData.stars || 0).toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({parkingData.starsCount || 0})</Text>
            </View>
          </View>
          
          <Text style={styles.address}>{parkingData.address}</Text>

          {/* Spots Available */}
          <View style={styles.spotsContainer}>
            <View style={styles.spotItem}>
              <FontAwesome name="car" size={20} color="#3498db" />
              <Text style={styles.spotText}>{parkingData.carSpot} chỗ ô tô</Text>
            </View>
            <View style={styles.spotItem}>
              <FontAwesome name="motorcycle" size={20} color="#e74c3c" />
              <Text style={styles.spotText}>{parkingData.motoSpot} chỗ xe máy</Text>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {renderFeatureBadge('credit-card', 'Trả trước', parkingData.isPrepayment, 'prepayment')}
            {renderFeatureBadge('moon', 'Qua đêm', parkingData.isOvernight, 'overnight')}
            {renderFeatureBadge('shield', 'An toàn', true, 'secure')}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{parkingData.description}</Text>
          </View>

          {/* Pricing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bảng giá</Text>
            {parkingData.parkingHasPrices && parkingData.parkingHasPrices.length > 0 ? 
              parkingData.parkingHasPrices.map(item => renderPriceCard(item.parkingPrice)) :
              <Text style={styles.description}>Chưa có thông tin bảng giá</Text>
            }
          </View>

          {/* Map */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vị trí trên bản đồ</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: mockCoordinate.latitude,
                longitude: mockCoordinate.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
            >
              <Marker coordinate={mockCoordinate} title={parkingData.name} />
            </MapView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Button 
          title={parkingData.isFull ? "Hết chỗ" : "Đặt chỗ ngay"}
          onPress={() => {
            if (!parkingData.isFull) {
              navigation.navigate('Booking', {
                parkingId: parkingData.parkingId,
                parkingName: parkingData.name
              });
            }
          }}
          disabled={parkingData.isFull}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  fullBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  reviewCount: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6c757d',
  },
  address: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    lineHeight: 20,
  },
  spotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  spotItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  featureActive: {
    backgroundColor: '#e8f5e8',
    borderColor: '#27ae60',
  },
  featureInactive: {
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
  },
  featureText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  featureTextActive: {
    color: '#27ae60',
  },
  featureTextInactive: {
    color: '#6c757d',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#495057',
  },
  priceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  priceTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  timeLineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  timeLineName: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
  },
  timeLinePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  penaltyInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  penaltyText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  map: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bottomBar: {
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ParkingDetailScreen;