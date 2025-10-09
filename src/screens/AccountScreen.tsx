import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import ProfileMenuItem from '../components/ProfileMenuItem';
import api from '../services/api';

type AccountScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainApp'>;

type Props = {
  navigation: AccountScreenNavigationProp;
};
interface UserProfile {
  userId: number;
  name: string;
  phone: string;
  avatar: string | null;
  dateOfBirth: string;
  gender: string;
  idCardNo: string;
  idCardDate: string;
  idCardIssuedBy: string;
  address: string;
}
const AccountScreen = ({ navigation }: Props) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const result = await api.getUserProfile();

      if (result.success) {
        setProfile(result.data);
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể tải thông tin người dùng.');
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text>Đang tải dữ liệu...</Text>
        </View>
      );
    }
  
    if (!profile) {
      return (
        <View style={styles.center}>
          <Text>Không thể tải thông tin cá nhân.</Text>
        </View>
      );
    }

  const handleLogout = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: async () => {
            await api.logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Tài khoản</Text>
        </View>

        {/* === Header Hồ sơ === */}
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => navigation.navigate('PersonalInformation')}
        >
          <Image
            source={{ uri: profile.avatar ||  `https://i.pravatar.cc/150?u=a042581f4e29026704d` }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userPhone}>{profile.phone}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        {/* SỬA LỖI: Gom các nhóm menu vào các card có nền trắng */}

        {/* === Nhóm Menu 1: Quản lý tài khoản === */}
        <View style={styles.menuContainer}>
          <ProfileMenuItem
            icon="wallet-outline"
            title="Ví của tôi"
            onPress={() => navigation.navigate('Wallet')}
          />
          <View style={styles.divider} />
          <ProfileMenuItem
            icon="car-sport-outline"
            title="Phương tiện"
            onPress={() => navigation.navigate('Vehicles')}
          />
          <View style={styles.divider} />
          <ProfileMenuItem
            icon="heart-outline"
            title="Địa chỉ yêu thích"
            onPress={() => { /* Thêm navigation khi có màn hình */ }}
          />
        </View>

        {/* === Nhóm Menu 2: Hỗ trợ & Ứng dụng === */}
        <View style={styles.menuContainer}>
          <ProfileMenuItem
            icon="help-circle-outline"
            title="Trợ giúp & Hỗ trợ"
            onPress={() => { }}
          />
          <View style={styles.divider} />
          <ProfileMenuItem
            icon="settings-outline"
            title="Cài đặt"
            onPress={() => { }}
          />
          <View style={styles.divider} />
          <ProfileMenuItem
            icon="information-circle-outline"
            title="Về chúng tôi"
            onPress={() => { }}
          />
        </View>

        {/* === Nút Đăng xuất === */}
        <View style={styles.menuContainer}>
          <ProfileMenuItem
            icon="log-out-outline"
            title="Đăng xuất"
            onPress={handleLogout}
            isLogout
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userPhone: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  // SỬA LỖI: Style cho container của menu
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', // Giúp bo góc cho các item bên trong
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 60, // Căn lề với vị trí của text
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AccountScreen;