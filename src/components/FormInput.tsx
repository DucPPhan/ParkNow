// src/components/FormInput.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface FormInputProps extends TextInputProps {
  label: string;
  icon: IoniconName;
}

const FormInput = ({ label, icon, ...props }: FormInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholderTextColor="#a9a9a9"
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  icon: {
    padding: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingRight: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default FormInput;