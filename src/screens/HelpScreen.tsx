import React from 'react';
import InfoPage from '../components/InfoPage';

const helpSections = [
    {
        title: 'Làm thế nào để đặt chỗ?',
        content: 'Từ màn hình chính, bạn có thể tìm kiếm bãi đỗ xe theo vị trí. Sau khi chọn bãi, hãy chọn thời gian và loại xe, sau đó tiến hành thanh toán để hoàn tất đặt chỗ.',
    },
    {
        title: 'Tôi có thể hủy đặt chỗ không?',
        content: 'Có, bạn có thể hủy đặt chỗ trong mục "Hoạt động". Lưu ý rằng chính sách hoàn tiền có thể được áp dụng tùy thuộc vào thời gian bạn hủy so với giờ đặt.',
    },
    {
        title: 'Liên hệ hỗ trợ',
        content: 'Nếu có bất kỳ vấn đề nào, vui lòng liên hệ với chúng tôi qua email support@parknow.com hoặc số điện thoại 1900 1234 để được hỗ trợ nhanh nhất.',
    },
];

const HelpScreen = () => {
    return <InfoPage pageTitle="Trợ giúp & Hỗ trợ" sections={helpSections} />;
};

export default HelpScreen;