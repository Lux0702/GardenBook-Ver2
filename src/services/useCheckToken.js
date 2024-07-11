import { useState } from 'react';
import { API_URL } from '../utils/constant';
import { decode as base64Decode } from 'base-64';


export const useTokenExpirationCheck = () => {
  const [isChange, setIsChange] = useState(false);

  const refreshAccessToken = async (token) => {
    console.log('Bắt đầu refresh token');
    console.log('Kiểm tra token:', token.refreshToken);
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        console.log('Refresh token thành công');
        setIsChange(true);
        localStorage.setItem('tokenAdmin', JSON.stringify(responseData.data));
      } else {
        console.log('Lỗi khi refresh token:', responseData.message);
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error('Lỗi kết nối khi refresh token:', error);
      throw error;
    }
  };

  const checkTokenExpirationAdmin = async () => {
    try {
      console.log('Kiểm tra token expiration');
      const tokenFromStorage = localStorage.getItem('tokenAdmin');
      console.log('Token retrieved:', tokenFromStorage);
      if (tokenFromStorage) {
        const token = JSON.parse(tokenFromStorage);
        const encodedPayload = token.accessToken.split('.')[1];
        const decodedPayload = base64Decode(encodedPayload);

        const parsedPayload = JSON.parse(decodedPayload);
        const expirationTime = parsedPayload.exp * 1000;

        const currentTime = Date.now();
        console.log('Expiration time:', expirationTime);
        console.log('Current time:', currentTime);
        if (expirationTime < currentTime) {
          console.log('Refresh token:', token.refreshToken);
          await refreshAccessToken(token);
        } else {
          console.log('Token còn hạn');
        }
      }
    } catch (error) {
      console.log('Lỗi khi kiểm tra token expiration:', error);
    }
  };

  return { isChange, checkTokenExpirationAdmin };
};
