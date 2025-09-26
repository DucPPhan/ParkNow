// src/components/Button.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';

// Định nghĩa các thuộc tính (props) mà component Button sẽ nhận
interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary'; // 'primary' là mặc định
  style?: StyleProp<ViewStyle>; // Cho phép truyền style từ bên ngoài
}

const Button = ({
  title,
  onPress,
  type = 'primary', // Mặc định là 'primary' nếu không được cung cấp
  style,
}: ButtonProps) => {

  // Xác định style dựa trên 'type'
  const isPrimary = type === 'primary';

  // Style cho container của nút
  const buttonStyle = [
    styles.button,
    isPrimary ? styles.primaryButton : styles.secondaryButton,
    style, // Áp dụng style tùy chỉnh được truyền vào
  ];

  // Style cho chữ bên trong nút
  const textStyle = [
    styles.text,
    isPrimary ? styles.primaryText : styles.secondaryText,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

// Định nghĩa các style cố định
const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 50,
    borderRadius: 50,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#493d8a',
    borderColor: '#493d8a',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: '#493d8a',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#493d8a',
  },
});

export default Button;