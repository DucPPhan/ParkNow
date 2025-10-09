import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import api from '../services/api';
import FavoriteAddressCard, { FavoriteAddress } from '../components/FavoriteAddressCard';
import Button from '../components/Button';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const FavoriteAddressesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const [addresses, setAddresses] = useState<FavoriteAddress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    const result = await api.getFavoriteAddresses();
    if (result.success && Array.isArray(result.data)) {
      setAddresses(result.data);
    } else {
      Alert.alert('Lỗi', result.message || 'Không thể tải danh sách địa chỉ.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchAddresses();
    }
  }, [isFocused, fetchAddresses]);

  const handleDelete = (addressId: number) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa địa chỉ này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            const result = await api.deleteFavoriteAddress(addressId);
            if (result.success) {
              Alert.alert("Thành công", "Đã xóa địa chỉ.");
              fetchAddresses(); // Tải lại danh sách
            } else {
              Alert.alert("Lỗi", result.message || "Xóa thất bại.");
            }
          },
        },
      ]
    );
  };
  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <FlatList
        data={addresses}
        renderItem={({ item }) => (
          <FavoriteAddressCard
            item={item}
            onPress={() => { /* Navigate to edit screen if needed */ }}
            onDelete={() => handleDelete(item.favoriteAddressId)}
          />
        )}
        keyExtractor={(item) => item.favoriteAddressId.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Bạn chưa có địa chỉ yêu thích nào.</Text>
          </View>
        }
      />
      <View style={styles.footer}>
        <Button 
          title="Thêm địa chỉ mới" 
          onPress={() => { /* navigation.navigate('AddEditFavoriteAddress') */ }} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default FavoriteAddressesScreen;