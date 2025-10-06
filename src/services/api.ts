import * as SecureStore from 'expo-secure-store';

// !!! QUAN TRỌNG: Đảm bảo đây là địa chỉ IP và cổng chính xác của backend
const API_ENDPOINT = 'http://103.56.161.75/api';

/**
 * ====================================================================
 * HÀM TRỢ GIÚP ĐỂ LOG RESPONSE VÀ PHÂN TÍCH JSON
 * ====================================================================
 * @param response Đối tượng response gốc từ fetch
 * @returns Dữ liệu JSON đã được phân tích
 */
const logAndParseResponse = async (response: Response) => {
    // Sao chép response để có thể đọc body 2 lần (1 cho log, 1 cho logic)
    const clonedResponse = response.clone();

    // Chuẩn bị một đối tượng để log, chứa các thông tin bạn muốn xem
    const responseLog = {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        ok: clonedResponse.ok,
        url: clonedResponse.url,
        headers: Object.fromEntries(clonedResponse.headers.entries()), // Chuyển headers thành object
        body: await clonedResponse.json().catch(() => 'Không thể đọc body dưới dạng JSON'), // Lấy body để log
    };

    // In ra console
    console.log('✅ [API RESPONSE]:', JSON.stringify(responseLog, null, 2));

    // Trả về dữ liệu JSON từ response gốc để logic ứng dụng tiếp tục sử dụng
    return response.json();
};


const api = {
    /**
     * Hàm xử lý đăng nhập người dùng
     * @param phoneNumber Số điện thoại
     */
    login: async (phone: string) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/mobile/customer-authentication/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone }),
            });

            // Sử dụng hàm trợ giúp để log và lấy dữ liệu
            const responseData = await logAndParseResponse(response);

            if (response.ok && responseData.statusCode === 200 && responseData.data) {
                await SecureStore.setItemAsync('userToken', responseData.data);
                return { success: true, data: responseData.data };
            } else {
                return { success: false, message: responseData.message || 'Đăng nhập thất bại.' };
            }

        } catch (error) {
            console.error('❌ [API REQUEST FAILED]:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },

    /**
     * Hàm đăng xuất, xóa token khỏi bộ nhớ
     */
    logout: async () => {
        try {
            await SecureStore.deleteItemAsync('userToken');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, message: 'Lỗi khi đăng xuất.' };
        }
    },
    /**
   * Hàm xử lý đăng ký tài khoản mới
   * @param data Dữ liệu đăng ký từ các bước
   */
    register: async (data: any) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/mobile/customer-authentication/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json(); // Luôn parse để xem message

            if (response.ok && responseData.statusCode === 201) { // Thường mã 201 cho Created
                return { success: true };
            } else {
                return { success: false, message: responseData.message || 'Đăng ký thất bại.' };
            }
        } catch (error) {
            console.error('Register API error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },
};

export default api;