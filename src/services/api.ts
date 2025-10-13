import * as SecureStore from 'expo-secure-store';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

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

    // Nếu là 204 No Content thì không parse body
    if (clonedResponse.status === 204) {
        const responseLog = {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            ok: clonedResponse.ok,
            url: clonedResponse.url,
            headers: Object.fromEntries(clonedResponse.headers.entries()),
            body: null,
        };
        console.log('✅ [API RESPONSE]:', JSON.stringify(responseLog, null, 2));
        return {};
    }

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
    return response.json().catch(() => ({}));
};


const api = {
    /**
     * Hàm xử lý đăng nhập người dùng
     * @param phoneNumber Số điện thoại
     */
    login: async (phone: string, password: string) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/mobile/customer-authentication/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Backend expects phoneNumber sometimes; current client uses { phone, password }
                body: JSON.stringify({ phone, password }),
            });

            // Sử dụng hàm trợ giúp để log và lấy dữ liệu
            const responseData = await logAndParseResponse(response);

            if (response.ok && (responseData.statusCode === 200 || responseData.statusCode === 201) && responseData.data) {
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
     * Kiểm tra số điện thoại đã tồn tại hay chưa
     */
    checkPhone: async (phoneNumber: string) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/mobile/customer-authentication/check-phone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber }),
            });
            const responseData = await logAndParseResponse(response);
            if (response.ok && responseData.statusCode === 200) {
                return { success: true, data: responseData.data };
            }
            return { success: false, message: responseData.message || 'Kiểm tra số điện thoại thất bại.' };
        } catch (error) {
            console.error('Check phone API error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },
    /**
     * Gửi OTP đến email
     */
    sendEmailOtp: async (email: string, phoneNumber: string) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/mobile/customer-authentication/send-email-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phoneNumber }),
            });
            const responseData = await logAndParseResponse(response);
            if (
                response.ok && (
                    response.status === 204 ||
                    responseData.statusCode === 200 ||
                    responseData.statusCode === 201
                )
            ) {
                return { success: true };
            }
            return { success: false, message: responseData.message || 'Gửi OTP thất bại.' };
        } catch (error) {
            console.error('Send email OTP error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },
    /**
     * Xác minh OTP email, trả về token
     */
    verifyEmailOtp: async (email: string, otp: string) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/mobile/customer-authentication/verify-email-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const responseData = await logAndParseResponse(response);
            if (response.ok && responseData.statusCode === 200 && responseData.data) {
                return { success: true, data: responseData.data };
            }
            return { success: false, message: responseData.message || 'Xác minh OTP thất bại.' };
        } catch (error) {
            console.error('Verify email OTP error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },
    /**
   * Hàm xử lý đăng ký tài khoản mới
   * @param data Dữ liệu đăng ký từ các bước
   */
    register: async (data: { phoneNumber: string; email: string; password: string; token: string; }) => {
        console.log('Registering with data:', data); // Log dữ liệu đăng ký
        try {
            const response = await fetch(`${API_ENDPOINT}/mobile/customer-authentication/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await logAndParseResponse(response); // parse + log

            if (response.ok && (responseData.statusCode === 200 || responseData.statusCode === 201)) {
                return { success: true, data: responseData.data };
            }
            return { success: false, message: responseData.message || 'Đăng ký thất bại.' };
        } catch (error) {
            console.error('Register API error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },

    /**
     * Lấy danh sách bãi xe nổi bật (sắp xếp theo rating từ API)
     */
    getFeaturedParkings: async (pageNo = 1, pageSize = 50) => { // Lấy nhiều để có dữ liệu sắp xếp
        try {
            const response = await fetch(`${API_ENDPOINT}/parkings-for-cus/ratings?PageNo=${pageNo}&PageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseData = await logAndParseResponse(response);

            if (response.ok && responseData.statusCode === 200 && responseData.data) {
                return { success: true, data: responseData.data };
            } else {
                return { success: false, message: responseData.message || 'Lấy danh sách nổi bật thất bại.' };
            }
        } catch (error) {
            console.error('Get Featured Parkings API error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },

    /**
     * Lấy danh sách bãi xe gần vị trí người dùng
     * @param latitude Vĩ độ của người dùng
     * @param longitude Kinh độ của người dùng
     */
    getNearbyParkings: async (latitude: number, longitude: number) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await fetch(`${API_ENDPOINT}/parking-nearest?currentLatitude=${latitude}&currentLongtitude=${longitude}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // API này yêu cầu xác thực, nên chúng ta cần gửi token
                    'Authorization': `Bearer ${token}`,
                },
            });

            const responseData = await logAndParseResponse(response);

            if (response.ok && responseData.statusCode === 200 && responseData.data) {
                return { success: true, data: responseData.data };
            } else {
                return { success: false, message: responseData.message || 'Lấy danh sách bãi xe gần đây thất bại.' };
            }
        } catch (error) {
            console.error('Get Nearby Parkings API error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },

    /**
     * lấy danh sách địa chỉ yêu thích
     */
    getFavoriteAddresses: async (pageNo= 1, pageSize= 50) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                return { success: false, message: 'Người dùng chưa đăng nhập.' };
            }   
            const response = await fetch(`${API_ENDPOINT}/favorite-address?PageNo=${pageNo}&PageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
            });
            const responseData = await logAndParseResponse(response);

            if (response.ok && responseData.statusCode === 200 && responseData.data) {
                return { success: true, data: responseData.data };
            } else {
                return { success: false, message: responseData.message || 'Lấy danh sách địa chỉ yêu thích thất bại.' };
            }
        } catch (error) {
            console.error('Get Favorite Addresses API error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },

    /**
     * Thêm địa chỉ yêu thích mới
     * TODO: Cần xác định rõ API yêu cầu gì trong body
     */
    addFavoriteAddress: async (address: string, latitude: number, longitude: number) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                return { success: false, message: 'Người dùng chưa đăng nhập.' };
            }
            const response = await fetch(`${API_ENDPOINT}/favorite-address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ address, latitude, longitude }),
            });
            const responseData = await logAndParseResponse(response);
            if (response.ok && responseData.statusCode === 201) { // Thường mã 201 cho Created
                return { success: true };
            } else {
                return { success: false, message: responseData.message || 'Thêm địa chỉ yêu thích thất bại.' };
            }
        } catch (error) {
            console.error('Add Favorite Address API error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },

    /**
     * 
     * @returns Xóa địa chỉ yêu thích theo ID
     */
    deleteFavoriteAddress: async (addressId: number) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                return { success: false, message: 'Người dùng chưa đăng nhập.' };
            }
            const response = await fetch(`${API_ENDPOINT}/favorite-address/${addressId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
            });
            const responseData = await logAndParseResponse(response);

            if (response.ok && (response.status === 200 || response.status === 204)) {
                return { success: true };
            } else {
                return { success: false, message: responseData.message || 'Xóa địa chỉ yêu thích thất bại.' };
            }
        } catch (error) {
            console.error('Delete Favorite Address API error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },

    /**
     * Lấy thông tin hồ sơ của người dùng
     */
    getUserProfile: async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                return { success: false, message: 'Người dùng chưa đăng nhập.' };
            }

            const response = await fetch(`${API_ENDPOINT}/mobile/account`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const responseData = await logAndParseResponse(response);

            if (response.ok && responseData.statusCode === 200 && responseData.data) {
                return { success: true, data: responseData.data };
            } else {
                return { success: false, message: responseData.message || 'Lấy thông tin thất bại.' };
            }

        } catch (error) {
            console.error('Get Profile API error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },

    /**
     * Cập nhật thông tin hồ sơ người dùng
     * @param profileData Dữ liệu hồ sơ cần cập nhật
     * @return Kết quả của thao tác cập nhật
     */
    updateUserProfile: async (profileData: any) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                return { success: false, message: 'Người dùng chưa đăng nhập.' };
            }
            const response = await fetch(`${API_ENDPOINT}/mobile/account`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            // Nếu là 204 No Content thì coi như thành công
            if (response.status === 204) {
                await logAndParseResponse(response); // vẫn log để debug
                return { success: true };
            }

            const responseData = await logAndParseResponse(response);

            if (response.ok && responseData.statusCode === 200) {
                return { success: true };
            } else {
                return { success: false, message: responseData.message || 'Cập nhật thông tin thất bại.' };
            }
        } catch (error) {
            console.error('Update Profile API error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },

    /**
     * Lấy thông tin chi tiết của bãi đỗ xe
     * @param parkingId ID của bãi đỗ xe
     * @return Thông tin chi tiết bãi đỗ xe
     */
    getParkingDetail: async (parkingId: number) => {
        try {
            const response = await fetch(`${API_ENDPOINT}/parkings/mobile/parking-details?ParkingId=${parkingId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseData = await logAndParseResponse(response);

            if (response.ok && responseData.statusCode === 200 && responseData.data) {
                return { success: true, data: responseData.data };
            } else {
                return { success: false, message: responseData.message || 'Lấy thông tin chi tiết bãi đỗ xe thất bại.' };
            }
        } catch (error) {
            console.error('Get Parking Detail API error:', error);
            return { success: false, message: 'Không thể kết nối đến máy chủ.' };
        }
    },
};

export default api;