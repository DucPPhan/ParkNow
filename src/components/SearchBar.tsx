// src/components/SearchBar.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Import icon library

interface SearchBarProps {
  onPress: () => void;
}

const SearchBar = ({ onPress }: SearchBarProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.inputBox}>
        <Ionicons name="search" size={22} color="#888" style={styles.icon} />
        <Text style={styles.placeholder}>Tìm kiếm bãi đỗ xe...</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20, // Tăng khoảng cách dưới
    backgroundColor: 'transparent', // Nền trong suốt
  },
  inputBox: {
    flexDirection: 'row', // Sắp xếp icon và text theo chiều ngang
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12, // Bo góc ít hơn
    paddingVertical: 14,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    color: '#a9a9a9',
    fontSize: 16,
  },
});

export default SearchBar;