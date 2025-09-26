import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SocialButtonProps {
  iconName: string;
  text: string;
  onPress: () => void;
}

const SocialButton = ({ iconName, text, onPress }: SocialButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name={iconName} size={20} color="#000" style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
      <View style={{width: 20}} />{/* Spacer */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 15,
  },
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SocialButton;