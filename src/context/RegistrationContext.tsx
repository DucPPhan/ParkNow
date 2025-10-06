import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa cấu trúc dữ liệu đăng ký
interface RegistrationData {
  phone?: string;
  name?: string;
  dateOfBirth?: Date;
  gender?: string;
  idCardNo?: string;
  idCardDate?: Date;
  idCardIssuedBy?: string;
  address?: string;
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
  const [data, setData] = useState<RegistrationData>({});

  const updateRegistrationData = (newData: Partial<RegistrationData>) => {
    setData(prevData => ({ ...prevData, ...newData }));
  };

  const resetRegistrationData = () => {
    setData({});
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