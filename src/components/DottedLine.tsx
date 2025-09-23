// src/components/DottedLine.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const DottedLine = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    height: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    marginVertical: 15,
  },
});

export default DottedLine;