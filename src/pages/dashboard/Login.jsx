import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Form,
  Spin,
  message,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useLogin } from '../../utils/api';
import background from '../../assets/images/backGroundLogo.png';
import backgroundLogin from '../../assets/images/backgroundLogin.jpg';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const { fetchLogin } = useLogin();
  const [username, setUsername] = useState('');
  const [passWord, setPassword] = useState('');
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({}); // State để lưu thông báo lỗi

  const handleLogin = async () => {
    if (validateFormLogin()) {
      setErrors({});
      try {
        setSpinning(true);
        const success = await fetchLogin(username, passWord);
        console.log('success là:', success);
        if (success === true) {
          
          navigate('/admin/dashboard');
        }
      } catch (error) {
        console.log('Login google failed');
        toast.error('Đăng nhập thất bại.');
      } finally {
        setSpinning(false);
      }
    }
  };

  const validateFormLogin = () => {
    // Kiểm tra các trường dữ liệu và cập nhật thông báo lỗi
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Vui lòng nhập email.';
    } else if (!/\S+@\S+\.\S+/.test(username)) {
      newErrors.username = 'Email sai định dạng.';
    }

    if (!passWord.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (passWord.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự.';
    }
    setErrors(newErrors);

    // Kiểm tra xem có lỗi hay không
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Spin spinning={spinning}>
        <Card
          style={{
            width: 400,
            padding: '20px',
            backgroundImage: `url(${backgroundLogin})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            border: 'none',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Form>
            <h1>Đăng nhập</h1>
            <p className="text-medium-emphasis">Đăng nhập tài khoản của bạn</p>
            <Form.Item
              // label="Email"
              name="username"
              validateStatus={errors.username ? 'error' : ''}
              help={errors.username}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              // label="Mật khẩu"
              name="password"
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                value={passWord}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Row justify="space-between">
              <Col>
                <Button type="primary" onClick={handleLogin}>
                  Đăng nhập
                </Button>
              </Col>
              <Col>
                <Link to="/forgot-password">
                  <Button type="text">Forgot password?</Button>
                </Link>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
      <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"/>
    </div>
  );
};

export default Login;
