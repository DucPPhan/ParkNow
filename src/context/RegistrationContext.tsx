import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa cấu trúc dữ liệu đăng ký
interface RegistrationData {
  phoneNumber: string;
  email: string;
  password: string;
  token: string; // token nhận được sau verify email OTP
}

// Định nghĩa kiểu cho Context
interface RegistrationContextType {
  data: RegistrationData;
  updateRegistrationData: (newData: Partial<RegistrationData>) => void;
  resetRegistrationData: () => void;
}

// Tạo Context
const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

// Tạo Provider
export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<RegistrationData>({
    phoneNumber: '',
    email: '',
    password: '',
    token: '',
  });

  const updateRegistrationData = (newData: Partial<RegistrationData>) => {
    setData(prevData => ({ ...prevData, ...newData }));
  };

  const resetRegistrationData = () => {
    setData({
      phoneNumber: '',
      email: '',
      password: '',
      token: '',
    });
  };

  return (
    <RegistrationContext.Provider value={{ data, updateRegistrationData, resetRegistrationData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

// Tạo custom hook để dễ dàng sử dụng context
export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};