import React from 'react';
import InfoPage from '../components/InfoPage';

const settingsSections = [
    {
        title: 'Thông báo đẩy (Push Notifications)',
        content: 'Quản lý các loại thông báo bạn muốn nhận từ ParkNow, bao gồm nhắc nhở đặt chỗ, cập nhật trạng thái và các chương trình khuyến mãi.',
    },
    {
        title: 'Bảo mật tài khoản',
        content: 'Thay đổi mật khẩu, quản lý các thiết bị đã đăng nhập và các tùy chọn bảo mật khác để giữ an toàn cho tài khoản của bạn.',
    },
    {
        title: 'Ngôn ngữ',
        content: 'Hiện tại, ParkNow hỗ trợ Tiếng Việt. Chúng tôi sẽ sớm cập nhật thêm các ngôn ngữ khác trong tương lai.',
    },
];

const SettingsScreen = () => {
    return <InfoPage pageTitle="Cài đặt" sections={settingsSections} />;
};

export default SettingsScreen;