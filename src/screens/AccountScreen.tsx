// src/screens/AccountScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../navigation/types';
import ProfileMenuItem from '../components/ProfileMenuItem';

const AccountScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng xuất", style: "destructive", onPress: () => {
            // Quay về màn hình Login và xóa hết lịch sử navigation
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={require('../assets/image/home_banner.png')} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>Lê Văn A</Text>
          <Text style={styles.email}>levana@email.com</Text>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <ProfileMenuItem 
            icon="user" 
            title="Thông tin cá nhân" 
            onPress={() => navigation.navigate('PersonalInformation')} 
          />
          <ProfileMenuItem 
            icon="truck" 
            title="Phương tiện" 
            onPress={() => navigation.navigate('Vehicles')} 
          />
          <ProfileMenuItem 
            icon="credit-card" 
            title="Ví điện tử" 
            onPress={() => navigation.navigate('Wallet')} 
          />
          <ProfileMenuItem 
            icon="log-out" 
            title="Đăng xuất" 
            onPress={handleLogout}
            isLogout={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#3498db',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  menuContainer: {
    marginTop: 10,
  },
});

export default AccountScreen;