// src/components/Button.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';

// Định nghĩa các thuộc tính (props) mà component Button sẽ nhận
interface ButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
  minWidth?: number;
  minHeight?: number;
  borderRadius?: number;
}

const Button = ({
  title,
  onPress,
  backgroundColor,
  textColor,
  minWidth = 150,   // Giá trị mặc định
  minHeight = 42,   // Giá trị mặc định
  borderRadius = 50,// Giá trị mặc định
}: ButtonProps) => {

  // Tạo style động dựa trên props
  const buttonStyle: ViewStyle = {
    backgroundColor: backgroundColor,
    minWidth: minWidth,
    minHeight: minHeight,
    borderRadius: borderRadius,
  };

  const textStyle: TextStyle = {
    color: textColor,
  };

  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

// Định nghĩa các style cố định
const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 0, // Tương đương với elevation: 0.0 trong Flutter
  },
  text: {
    fontSize: 13,
    fontWeight: '600', // '600' tương đương với SemiBold
  },
});

export default Button;