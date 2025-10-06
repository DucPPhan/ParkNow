import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean; // THÊM PROP NÀY
  loading?: boolean; // Thêm prop loading để hiển thị ActivityIndicator
}

const Button = ({
  title,
  onPress,
  type = 'primary',
  style,
  disabled = false, // THÊM PROP NÀY
  loading = false,  // Thêm prop loading
}: ButtonProps) => {
  const isPrimary = type === 'primary';

  // Thêm style cho trạng thái disabled
  const buttonStyle = [
    styles.button,
    isPrimary ? styles.primaryButton : styles.secondaryButton,
    (disabled || loading) && (isPrimary ? styles.primaryDisabled : styles.secondaryDisabled), // Áp dụng style disabled
    style,
  ];

  const textStyle = [
    styles.text,
    isPrimary ? styles.primaryText : styles.secondaryText,
    (disabled || loading) && styles.disabledText, // Áp dụng style text disabled
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading} // Vô hiệu hóa TouchableOpacity
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#a9a9a9'} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

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
    backgroundColor: '#00B14F', // Màu xanh lá cây
    borderColor: '#00B14F',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: '#00B14F',
  },
  // Style cho trạng thái disabled
  primaryDisabled: {
    backgroundColor: '#a3d3b8',
    borderColor: '#a3d3b8',
  },
  secondaryDisabled: {
    borderColor: '#a9a9a9',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#00B14F',
  },
  disabledText: {
    color: '#FFFFFF',
  },
});

export default Button;