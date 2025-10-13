import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import ProfileInfoRow from '../components/ProfileInfoRow';
import Button from '../components/Button';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

type Nav = StackNavigationProp<RootStackParamList, 'CompleteProfile'>;

const CompleteProfileScreen = ({ navigation }: { navigation: Nav }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(''); // dd/mm/yyyy simple input for now
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const parseDate = (s: string) => {
    const parts = s.split('/');
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts.map(p => parseInt(p, 10));
    if (!dd || !mm || !yyyy) return null;
    const d = new Date(yyyy, mm - 1, dd);
    return isNaN(d.getTime()) ? null : d.toISOString();
  };

  const onSave = async () => {
    if (!name) { Alert.alert('Lỗi', 'Vui lòng nhập họ tên.'); return; }
    const dobIso = dateOfBirth ? parseDate(dateOfBirth) : null;
    if (dateOfBirth && !dobIso) { Alert.alert('Lỗi', 'Ngày sinh không hợp lệ (dd/mm/yyyy).'); return; }
    setLoading(true);
    const payload = {
      name,
      gender,
      avatar,
      dateOfBirth: dobIso || new Date().toISOString(),
    };
    const res = await api.updateUserProfile(payload as any);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Cập nhật thất bại', res.message || 'Vui lòng thử lại.');
      return;
    }
    navigation.reset({ index: 0, routes: [{ name: 'MainApp', params: { screen: 'HomeTab' } as any }] });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}
      </TouchableOpacity>
      <View style={styles.form}>
        <ProfileInfoRow label="Họ và tên" icon="person-outline" value={name} onChangeText={setName} />
        <View style={styles.divider} />
        <ProfileInfoRow label="Giới tính" icon="male-female-outline" value={gender} onChangeText={setGender} />
        <View style={styles.divider} />
        <ProfileInfoRow label="Ngày sinh (dd/mm/yyyy)" icon="calendar-outline" value={dateOfBirth} onChangeText={setDateOfBirth} />
      </View>
      <Button title="Lưu và tiếp tục" onPress={onSave} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', padding: 16, gap: 16 },
  avatarWrap: { alignItems: 'center', marginVertical: 12 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee' },
  avatarPlaceholder: { borderWidth: 2, borderColor: '#ddd' },
  form: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 56 },
});

export default CompleteProfileScreen;
