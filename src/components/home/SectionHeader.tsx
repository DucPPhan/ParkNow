import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
  title: string;
  onSeeAll: () => void;
}

const SectionHeader = ({ title, onSeeAll }: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAll}>Xem thêm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 15,
    marginTop: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  seeAll: {
    fontSize: 15,
    color: '#3498db',
    fontWeight: '600',
  },
});

export default SectionHeader;