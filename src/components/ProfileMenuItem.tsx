// src/components/ProfileMenuItem.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface ProfileMenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  isLogout?: boolean;
}

const ProfileMenuItem = ({ icon, title, onPress, isLogout = false }: ProfileMenuItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, isLogout && styles.logoutIconBg]}>
        <Icon name={icon} size={20} color={isLogout ? '#e74c3c' : '#3498db'} />
      </View>
      <Text style={[styles.title, isLogout && styles.logoutText]}>{title}</Text>
      {!isLogout && <Icon name="chevron-right" size={22} color="#ccc" />}
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