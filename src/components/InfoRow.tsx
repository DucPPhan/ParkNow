import React from 'react';
// 1. Import 'Alert' từ 'react-native'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

interface InfoRowProps {
  label: string;
  value: string;
  isCopyable?: boolean;
}

const InfoRow = ({ label, value, isCopyable = false }: InfoRowProps) => {
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(value);
    // 2. Sử dụng Alert.alert() thay vì alert()
    Alert.alert('Đã sao chép!');
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {isCopyable && (
          <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
            <Ionicons name="copy-outline" size={20} color="#3498db" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  copyButton: {
    marginLeft: 8,
  },
});

export default InfoRow;