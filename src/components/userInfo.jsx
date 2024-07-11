import React, { useEffect, useState, useCallback } from 'react';
import { Form, Input, Button, Radio, Upload, Avatar, DatePicker ,Spin} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import "../assets/css/userpage.css";
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import avatar_user from '../assets/images/avatar.png';
import { useUploadProfile } from '../utils/api';
import { toast } from 'react-toastify';
const UserInfo = () => {
  const [spinning, setSpinning]=useState(false)
  const [form] = Form.useForm();
  const {userUpdate, fetchUploadProfile} =useUploadProfile();
  const [username, setUserName] = useState('');
  const [fullName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthdate] = useState(null); // Initial birthdate
  const [avatar, setAvatar] = useState(null);
  const [avatarChange, setAvatarChange] = useState(null);
  const [isAvatarUpload, setIsAvatarUpload] = useState(false);
  const [points, setPoints] = useState(0);
  const [isUpload, setUpload]= useState(false);
  const handleAvatarChange = (info) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      getBase64(info.file.originFileObj, (url) => {
        setAvatar(url);
        setAvatarChange(info.file.originFileObj)
        setIsAvatarUpload(true);
        // console.log('url avatar change',url);
      });
    }
  };

  const getBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
  };

  const updateUserData = useCallback(() => {
    const userString = localStorage.getItem('userInfo');
    const userData = JSON.parse(userString);
    console.log('profile:', userData);
    if (userData) {
      setName(userData.fullName);
      setEmail(userData.email);
      setPhone(userData.phone);
      setGender(userData.gender);
      setBirthdate(userData.birthday);
      setAvatar(userData.avatar);
      setUserName(userData.email);
      setPoints(userData.points);
      form.setFieldsValue({
        username: userData.email,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        birthday: userData.birthday ? dayjs(userData.birthday) : null,
        points: userData.points,
      });
      setUpload(false);
    }
  }, [form]);

  useEffect(() => {
    updateUserData();
    if(isUpload){
      window.scrollTo(0, 0);
    }
  }, [updateUserData, isUpload]);

  const handleSave = async() => {
    console.log('Form values:', form.getFieldsValue());
    const tokenSring =localStorage.getItem('token');
    const token = JSON.parse(tokenSring);
    try{
      setSpinning(true);
      const values = await form.validateFields();
      const formData =new FormData()
      formData.append('fullName', values.fullName);
      formData.append('phone', values.phone);
      formData.append('gender', values.gender);
      formData.append('birthday', values.birthday ? values.birthday.format('YYYY-MM-DD') : '');
      console.log('is load image',isAvatarUpload)
      if (isAvatarUpload) {
        formData.append('avatar', avatarChange);
      }
      console.log('formData',...formData)
      const success = await fetchUploadProfile(token?.accessToken,formData)
      if (success) {
        setUpload(true)
        toast.success('Cập nhật thành công')
        setIsAvatarUpload(false)
      }
    }catch(error){
      console.log('error',error)
      toast.error('Cập nhật không thành công')

    } finally{
      setSpinning(false);

    }
    
  };

  const handleDateChange = (date) => {
    setBirthdate(date);
  };
useEffect(()=>{
  
})
  return (
    <div className="user-info">
      <div className="user-info-left">
        <h2>Hồ Sơ Của Tôi</h2>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item label="Tên đăng nhập" name="username">
            <Input disabled value={username} />
          </Form.Item>
          <Form.Item label="Tên" name="fullName" rules={[
          {
            required: true,
            message: 'Vui lòng nhập số điện thoại!',
          },
        ]}>
            <Input value={fullName} onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled />
          </Form.Item>
          <Form.Item label="Điểm tích lũy" name="points">
            <Input value={points} disabled />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={[
          {
            required: true,
            message: 'Vui lòng nhập số điện thoại!',
          },
          {
            pattern: /^[0-9]{10}$/,
            message: 'Số điện thoại phải là 10 chữ số!',
          },
          // {
          //   validator: (_, value) => 
          //     value && value.trim() !== '' ? 
          //       Promise.resolve() : 
          //       Promise.reject(new Error('Số điện thoại không được để trống!')),
          // },
        ]}>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Form.Item>
          <Form.Item label="Giới tính" name="gender">
            <Radio.Group value={gender} onChange={(e) => setGender(e.target.value)}>
              <Radio value="Male">Nam</Radio>
              <Radio value="Female">Nữ</Radio>
              <Radio value="Other">Khác</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Ngày sinh" name="birthday">
            <DatePicker
              value={birthday ? dayjs(birthday) : null}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              // defaultPickerValue={dayjs('1900-01-01')}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="user-info-right">
        <Avatar
          size={100}
          icon={<UserOutlined />}
          src={  avatar ? avatar : avatar_user}
        />
        <Upload
            showUploadList={false}
            onChange={handleAvatarChange}
        >
          <Button>Chọn Ảnh</Button>
        </Upload>
        <p>Dung lượng file tối đa 20 MB</p>
        <p>Định dạng: .JPEG, .PNG</p>
      </div>
      <Spin spinning={spinning} fullscreen style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} size="large" />

    </div>
  );
};

export default UserInfo;
