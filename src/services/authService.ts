import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hàm xử lý đăng nhập người dùng
 * @param phoneNumber Số điện thoại người dùng nhập vào
 * @returns Token nếu đăng nhập thành công
 */
export const loginUser = async (phoneNumber: string): Promise<string> => {
  try {
    const response = await api.post('/mobile/customer-authentication/login', {
      phone: phoneNumber,
    });
    // Kiểm tra dữ liệu trả về từ API
    if (response.data && response.data.statusCode === 200 && response.data.data) {
      const token = response.data.data;
      await AsyncStorage.setItem('userToken', token); // Lưu token
      console.log('Đăng nhập thành công, token:', token);
      return token;
    } else {
      // Ném ra lỗi với thông báo từ server để component có thể bắt và hiển thị
      throw new Error(response.data.message || "Đã có lỗi xảy ra.");
    }
  } catch (error: any) {
    // Xử lý các lỗi mạng hoặc lỗi không mong muốn
    if (error.response) {
      // Lỗi trả về từ server (ví dụ: 404, 400)
      throw new Error(error.response.data.message || "Lỗi từ máy chủ.");
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được phản hồi
      throw new Error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.");
    } else {
      // Lỗi khác
      throw new Error(error.message);
    }
  }
};

// Bạn có thể thêm các hàm khác như registerUser, logoutUser ở đây trong tương lai
// export const registerUser = async (data) => { ... };
// export const logoutUser = async () => { ... };