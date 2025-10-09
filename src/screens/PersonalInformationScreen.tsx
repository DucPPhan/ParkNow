import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../services/api';
import { RootStackParamList } from '../navigation/types';
import ProfileInfoRow from '../components/ProfileInfoRow';
import { Ionicons } from '@expo/vector-icons';

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

type NavigationProp = StackNavigationProp<RootStackParamList, 'PersonalInformation'>;

const PersonalInformationScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // State cho dữ liệu gốc (không thay đổi)
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  // State cho dữ liệu đang chỉnh sửa
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [loading, setLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const result = await api.getUserProfile();

      if (result.success) {
        // Gán dữ liệu cho cả 2 state khi fetch thành công
        setProfile(result.data);
        setOriginalProfile(result.data);
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể tải thông tin.');
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // So sánh dữ liệu gốc và dữ liệu hiện tại để xác định có thay đổi hay không
  const isModified = originalProfile && profile ? JSON.stringify(originalProfile) !== JSON.stringify(profile) : false;

  // Memoize handleSaveChanges to avoid infinite update loop
  const handleSaveChanges = useCallback(async () => {
    if (!profile || !isModified) return;

    setIsSaving(true);

    // Chuẩn bị payload đúng theo yêu cầu của API
    const updateUserProfile = {
      userId: profile.userId,
      name: profile.name,
      avatar: profile.avatar,
      dateOfBirth: new Date(profile.dateOfBirth).toISOString(),
      gender: profile.gender,
      address: profile.address,
    };

    try {
      const result = await api.updateUserProfile(updateUserProfile);
      setIsSaving(false);

      if (result.success) {
        Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân!');
        // navigation.goBack();
      } else {
        Alert.alert('Cập nhật thất bại', result.message || 'Đã có lỗi xảy ra.');
      }
    } catch (error: any) {
      setIsSaving(false);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại sau.');
      // Optional: log error for debugging
      // console.error('Update profile error:', error);
    }
  }, [profile, navigation, isModified]);

  // Gửi hàm handleSaveChanges và trạng thái isModified lên header
  useLayoutEffect(() => {
    navigation.setParams({ 
      handleSave: handleSaveChanges,
      canSave: isModified, // Gửi trạng thái có thể lưu hay không
    });
  }, [navigation, isModified, handleSaveChanges]); // Effect chạy lại khi isModified hoặc handleSaveChanges thay đổi


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile(prev => prev ? { ...prev, avatar: result.assets[0].uri } : null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#00B14F" /></View>;
  }

  if (!profile) {
    return <View style={styles.center}><Text>Không thể tải thông tin.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={profile.avatar ? { uri: profile.avatar } : require('../assets/image/home_banner.png')}
              style={styles.avatar}
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <ProfileInfoRow
            label="Họ và tên"
            icon="person-outline"
            value={profile.name}
            onChangeText={(text) => setProfile(prev => prev ? { ...prev, name: text } : null)}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            label="Số điện thoại"
            icon="call-outline"
            value={profile.phone}
            editable={false}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            label="Giới tính"
            icon="male-female-outline"
            value={profile.gender}
            onChangeText={(text) => setProfile(prev => prev ? { ...prev, gender: text } : null)}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            label="Ngày sinh"
            icon="calendar-outline"
            value={formatDate(profile.dateOfBirth)}
            editable={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#f4f6f9',
    },
    container: {
      paddingVertical: 20,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f6f9',
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: 30,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#eee',
    },
    cameraIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#00B14F',
      padding: 8,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: '#fff'
    },
    formContainer: {
      backgroundColor: '#fff',
      marginHorizontal: 16,
      borderRadius: 12,
      paddingHorizontal: 16,
    },
    divider: {
      height: 1,
      backgroundColor: '#f0f0f0',
      marginLeft: 56,
    },
  });

export default PersonalInformationScreen;