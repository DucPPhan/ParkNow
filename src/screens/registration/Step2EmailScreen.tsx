import React, { useState } from 'react';
import { View, Alert, StyleSheet, Keyboard } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RegistrationStackParamList } from '../../navigation/types';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import { useRegistration } from '../../context/RegistrationContext';
import api from '../../services/api';

type Nav = StackNavigationProp<RegistrationStackParamList, 'Step2_Gmail'>;

const Step2EmailScreen = ({ navigation }: { navigation: Nav }) => {
    const { data, updateRegistrationData } = useRegistration();
    const [email, setEmail] = useState(data.email || '');
        const [loading, setLoading] = useState(false);

    const onNext = async () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert('Lỗi', 'Email không hợp lệ.');
            return;
        }
        if (!data.phoneNumber) {
            Alert.alert('Lỗi', 'Thiếu số điện thoại.');
            return;
        }
            setLoading(true);
            try {
                const res = await api.sendEmailOtp(email, data.phoneNumber);
                if (!res.success) {
                    Alert.alert('Lỗi', res.message || 'Gửi OTP thất bại.');
                    return;
                }
                updateRegistrationData({ email });
                Keyboard.dismiss();
                // Điều hướng ngay sau khi UI settle để tránh kẹt do state/alert
                requestAnimationFrame(() => navigation.replace('Step3_OTP'));
            } finally {
                setLoading(false);
            }
    };

    return (
        <View style={styles.container}>
            <FormInput
                label="Email"
                icon="mail-outline"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email"
                autoCapitalize="none"
            />
            <Button title="Gửi OTP" onPress={onNext} loading={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
});

export default Step2EmailScreen;
