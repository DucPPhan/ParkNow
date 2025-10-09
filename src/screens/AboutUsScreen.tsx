import React from 'react';
import InfoPage from '../components/InfoPage';

const aboutSections = [
    {
        title: 'Về ParkNow',
        content: 'ParkNow là một ứng dụng di động thông minh giúp bạn tìm kiếm và đặt trước chỗ đỗ xe một cách nhanh chóng và tiện lợi. Sứ mệnh của chúng tôi là giải quyết vấn đề tìm kiếm bãi đỗ xe tại các đô thị lớn.',
    },
    {
        title: 'Phiên bản',
        content: 'Phiên bản hiện tại: 1.0.0\n© 2025 ParkNow Inc.',
    },
    {
        title: 'Điều khoản dịch vụ',
        content: 'Bằng việc sử dụng ứng dụng, bạn đồng ý với các điều khoản và chính sách bảo mật của chúng tôi. Vui lòng đọc kỹ để hiểu rõ quyền và nghĩa vụ của bạn.',
    },
];

const AboutUsScreen = () => {
    return <InfoPage pageTitle="Về chúng tôi" sections={aboutSections} />;
};

export default AboutUsScreen;