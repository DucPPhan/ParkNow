import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

// Lấy ra kiểu dữ liệu chính xác cho tên của các icon trong bộ Ionicons
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ProfileMenuItemProps {
  icon: IoniconName; // SỬA LỖI: Sử dụng kiểu dữ liệu chính xác thay vì 'string'
  title: string;
  onPress: () => void;
  isLogout?: boolean;
}

const ProfileMenuItem = ({ icon, title, onPress, isLogout = false }: ProfileMenuItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, isLogout && styles.logoutIconBg]}>
        <Ionicons name={icon} size={20} color={isLogout ? '#e74c3c' : '#3498db'} />
      </View>
      <Text style={[styles.title, isLogout && styles.logoutText]}>{title}</Text>
      
      {/* Sửa lại để thống nhất dùng Ionicons */}
      {!isLogout && <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#eaf5ff',
    marginRight: 15,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutIconBg: {
    backgroundColor: '#feeef0',
  },
  logoutText: {
    color: '#e74c3c',
    fontWeight: '600',
  }
});

export default ProfileMenuItem;