import React, { useEffect, useState, useCallback } from 'react';
import { Form, Input, Button, Radio, Upload, Avatar, DatePicker ,Spin} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import "../assets/css/userpage.css";
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { useUploadProfile } from '../utils/api';
import { toast } from 'react-toastify';
import { useChangePassword } from '../utils/api';
const ChangePassWord = () => {
  const [spinning, setSpinning]=useState(false)
  const [form] = Form.useForm();
  const {fetchChangePassword} =useChangePassword();
  const [oldPassWord, setOldPassword] = useState('');
  const [passWord, setPassWord] = useState('');
  const [confirmPassWord, setConfirmPassWord] = useState('');
 
  const [isUpload, setUpload]= useState(false);
  
//   const updateUserData = useCallback(() => {
//     const userString = localStorage.getItem('userInfo');
//     const userData = JSON.parse(userString);
//     console.log('profile:', userData);
//     if (userData) {
//       setUpload(false);
//     }
//   }, []);


  const handleSubmit = async() => {
    console.log('Form values:', form.getFieldsValue());
    const tokenSring =localStorage.getItem('token');
    const token = JSON.parse(tokenSring);
    try{
      setSpinning(true);
      const values = await form.validateFields();
        
      console.log('formData',values)
      const success = await fetchChangePassword(token?.accessToken,values)
      if (success) {
        setUpload(true)
        form.resetFields()
        toast.success('Cập nhật thành công')
      }
    }catch(error){
      console.log('error',error)
      toast.error('Cập nhật không thành công')

    } finally{
      setSpinning(false);

    }
    
  };

  return (
    <div className="user-info">
      <div className="user-info-left">
        <h2>Đổi mật khẩu</h2>
        <p>Vui lòng nhập mật khẩu cũ và mật khẩu mới để thay đổi !</p>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="Mật khẩu cũ" name="oldPassWord" rules={[
          {
            required: true,
            message: 'Mật khẩu không được để trống!',
          },
        ]}>
            <Input  value={oldPassWord} onChange={(e) => setOldPassword(e.target.value)} />
          </Form.Item>
          <Form.Item label="Mật khẩu mới" name="passWord" rules={[
          {
            required: true,
            message: 'Mật khẩu không được để trống!',
          },
          {
            min: 8,
            message: 'Mật khẩu phải từ 8 kí tự trở lên!',
          },
        ]}>
            <Input value={passWord} onChange={(e) => setPassWord(e.target.value)} />
          </Form.Item>
          <Form.Item label="Xác nhận mật khẩu" name="confirmPassWord" rules={[
          {
            required: true,
            message: 'Mật khẩu không được để trống !',
          },
          
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('passWord') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu không khớp!'));
            },
          }),
        ]}>
            <Input value={confirmPassWord} onChange={(e) => setConfirmPassWord(e.target.value)}  />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Spin spinning={spinning} fullscreen style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} size="large" />

    </div>
  );
};

export default ChangePassWord;
