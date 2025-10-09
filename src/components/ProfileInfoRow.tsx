import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ProfileInfoRowProps {
    label: string;
    icon: IoniconName;
    value: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    editable?: boolean;
    keyboardType?: TextInputProps['keyboardType'];
}

const ProfileInfoRow = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    editable = true,
    keyboardType,
}: ProfileInfoRowProps) => {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={24} color="#888" style={styles.icon} />
            <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    style={[styles.value, !editable && styles.valueDisabled]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    editable={editable}
                    keyboardType={keyboardType}
                    placeholderTextColor="#c7c7c7"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    icon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: 'gray',
    },
    value: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        marginTop: 2,
        // Xóa gạch chân trên Android
        borderBottomWidth: 0,
        padding: 0,
    },
    valueDisabled: {
        color: '#a0a0a0',
    },
});

export default ProfileInfoRow;