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
  Modal,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useHeaderHeight } from '@react-navigation/elements';
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
  name: string | null;
  email?: string | null;
  phone: string | null;
  avatar: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  idCardNo: string | null;
  idCardDate: string | null;
  idCardIssuedBy: string | null;
  address: string | null;
}

type NavigationProp = StackNavigationProp<RootStackParamList, 'PersonalInformation'>;

const PersonalInformationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();

  // State cho dữ liệu gốc (không thay đổi)
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  // State cho dữ liệu đang chỉnh sửa
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [loading, setLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDobModal, setShowDobModal] = useState(false);
  const [tempDob, setTempDob] = useState<Date | null>(null);

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
      name: profile.name || '',
      avatar: profile.avatar,
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString() : null,
      gender: profile.gender || '',
      address: profile.address || '',
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

  const formatDate = (dateString: string | null | undefined) => {
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
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior="always"
      >
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
            value={profile.name || ''}
            onChangeText={(text) => setProfile(prev => prev ? { ...prev, name: text } : null)}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            label="Email"
            icon="mail-outline"
            value={profile.email || ''}
            editable={false}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            label="Số điện thoại"
            icon="call-outline"
            value={profile.phone || ''}
            editable={false}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            label="Giới tính"
            icon="male-female-outline"
            value={profile.gender || 'Chọn giới tính'}
            onPress={() => setShowGenderModal(true)}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            label="Ngày sinh"
            icon="calendar-outline"
            value={formatDate(profile.dateOfBirth) || 'Chọn ngày sinh'}
            onPress={() => {
              const current = profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date(2000, 0, 1);
              setTempDob(current);
              setShowDobModal(true);
            }}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            label="CMND/CCCD"
            icon="card-outline"
            value={profile.idCardNo || ''}
            onChangeText={(text) => setProfile(prev => prev ? { ...prev, idCardNo: text } : null)}
          />
          {/* <View style={styles.divider} />
          <ProfileInfoRow
            label="Ngày cấp"
            icon="calendar-outline"
            value={formatDate(profile.idCardDate)}
            editable={false}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            label="Nơi cấp"
            icon="business-outline"
            value={profile.idCardIssuedBy || ''}
            editable={false}
          /> */}
          <View style={styles.divider} />
          <ProfileInfoRow
            label="Địa chỉ"
            icon="home-outline"
            value={profile.address || ''}
            onChangeText={(text) => setProfile(prev => prev ? { ...prev, address: text } : null)}
          />
        </View>
  </ScrollView>
  </KeyboardAvoidingView>

      {/* Gender Modal */}
      <Modal
        transparent
        visible={showGenderModal}
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowGenderModal(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Chọn giới tính</Text>
            {['Nam', 'Nữ', 'Khác'].map((g) => (
              <Pressable
                key={g}
                style={styles.modalOption}
                onPress={() => {
                  setProfile(prev => prev ? { ...prev, gender: g } : prev);
                  setShowGenderModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{g}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Date of Birth Modal with DateTimePicker */}
      <Modal
        transparent
        visible={showDobModal}
        animationType="fade"
        onRequestClose={() => setShowDobModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowDobModal(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Chọn ngày sinh</Text>
            <View style={{ alignItems: 'center' }}>
              <DateTimePicker
                value={tempDob || new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selectedDate) => {
                  if (selectedDate) setTempDob(selectedDate);
                }}
                maximumDate={new Date()}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <Pressable style={[styles.actionBtn, { marginRight: 8 }]} onPress={() => setShowDobModal(false)}>
                <Text>Hủy</Text>
              </Pressable>
              <Pressable
                style={[styles.actionBtn, styles.primaryActionBtn]}
                onPress={() => {
                  if (tempDob) {
                    setProfile(prev => prev ? { ...prev, dateOfBirth: tempDob.toISOString() } : prev);
                  }
                  setShowDobModal(false);
                }}
              >
                <Text style={{ color: '#fff' }}>Lưu</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    kav: {
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '85%',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
    },
    modalOption: {
      paddingVertical: 12,
    },
    modalOptionText: {
      fontSize: 16,
    },
    actionBtn: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: '#eee',
    },
    primaryActionBtn: {
      backgroundColor: '#00B14F',
    },
  });

export default PersonalInformationScreen;