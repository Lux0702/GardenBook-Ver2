import { useState } from 'react';
import { API_URL } from '../utils/constant';
import { decode as base64Decode } from 'base-64';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useTokenExpirationCheck = () => {
  const [isChange, setIsChange] = useState(false);
  const navigate = useNavigate();

  const refreshAccessToken = async (token, tokenType) => {
    console.log(`Bắt đầu refresh ${tokenType}`);
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
      if (response.ok && responseData.success) {
        console.log(`Refresh ${tokenType} thành công`);
        setIsChange(true);
        localStorage.setItem(tokenType, JSON.stringify(responseData.data));
      } else {
        console.log(`Lỗi khi refresh ${tokenType}:`, responseData.message);
        toast.error('Xác thực hết hạn, vui lòng đăng nhập lại');
        navigate(tokenType === 'token' ? '/login' : '/adminlogin');
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(`Lỗi kết nối khi refresh ${tokenType}:`, error);
      // toast.error('Xác thực hết hạn, vui lòng đăng nhập lại');
      navigate(tokenType === 'token' ? '/login' : '/adminlogin');
      throw error;
    }
  };

  const checkTokenExpiration = async (tokenType) => {
    try {
      console.log(`Kiểm tra ${tokenType} expiration`);
      const tokenFromStorage = localStorage.getItem(tokenType);
      if (!tokenFromStorage) {
        return;
      }
      console.log(`${tokenType} retrieved:`, tokenFromStorage);
      const token = JSON.parse(tokenFromStorage);
      const encodedPayload = token.accessToken.split('.')[1];
      const decodedPayload = base64Decode(encodedPayload);

      const parsedPayload = JSON.parse(decodedPayload);
      const expirationTime = parsedPayload.exp * 1000;
      const currentTime = Date.now();
      
      console.log('Expiration time:', expirationTime);
      console.log('Current time:', currentTime);

      // Refresh token if time remaining is less than 10 minutes (600,000 milliseconds)
      if (expirationTime - currentTime <= 10 * 60 * 1000) {
        console.log(`Refresh ${tokenType}:`, token.refreshToken);
        await refreshAccessToken(token, tokenType);
      } else {
        console.log(`${tokenType} còn hạn`);
      }
    } catch (error) {
      console.log(`Lỗi khi kiểm tra ${tokenType} expiration:`, error);
    }
  };

  const checkAllTokenExpirations = async () => {
    await Promise.all([
      checkTokenExpiration('token'),
      checkTokenExpiration('tokenAdmin'),
    ]);
  };

  return { isChange, checkAllTokenExpirations };
};
