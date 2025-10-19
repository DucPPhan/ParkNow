import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const handlePushNotifications = () => {
        Alert.alert(
            'Thông báo đẩy',
            'Quản lý các loại thông báo bạn muốn nhận từ ParkNow, bao gồm nhắc nhở đặt chỗ, cập nhật trạng thái và các chương trình khuyến mãi.\n\nTính năng này sẽ sớm được cập nhật.',
            [{ text: 'OK' }]
        );
    };

    const handleChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    const handleLanguage = () => {
        Alert.alert(
            'Ngôn ngữ',
            'Hiện tại, ParkNow hỗ trợ Tiếng Việt. Chúng tôi sẽ sớm cập nhật thêm các ngôn ngữ khác trong tương lai.',
            [{ text: 'OK' }]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.pageTitle}>Cài đặt</Text>

                {/* Thông báo đẩy */}
                <TouchableOpacity style={styles.settingItem} onPress={handlePushNotifications}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="notifications-outline" size={24} color="#4CAF50" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Thông báo đẩy</Text>
                        <Text style={styles.settingDescription}>
                            Quản lý thông báo bạn muốn nhận
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                {/* Bảo mật tài khoản */}
                <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="shield-checkmark-outline" size={24} color="#4CAF50" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Bảo mật tài khoản</Text>
                        <Text style={styles.settingDescription}>
                            Thay đổi mật khẩu và quản lý bảo mật
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                {/* Ngôn ngữ */}
                <TouchableOpacity style={styles.settingItem} onPress={handleLanguage}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="language-outline" size={24} color="#4CAF50" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Ngôn ngữ</Text>
                        <Text style={styles.settingDescription}>
                            Tiếng Việt
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
});

export default SettingsScreen;