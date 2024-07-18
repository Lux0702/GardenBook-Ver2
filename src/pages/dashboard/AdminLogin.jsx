import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Input, Button, Form, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLoginAdmin } from '../../utils/api';
import background from '../../assets/images/backGroundLogo.png';
import backgroundLogin from '../../assets/images/backgroundLogin.jpg';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import '../../assets/css/login.css'
const Login = () => {
  const { fetchLoginAdmin } = useLoginAdmin();
  const [username, setUsername] = useState('');
  const [passWord, setPassword] = useState('');
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    if (validateFormLogin()) {
      setErrors({});
      try {
        setSpinning(true);
        const success = await fetchLoginAdmin(username, passWord);
        console.log('success là:', success);
        if (success === true) {
          navigate('/admin/dashboard');
        }
      } catch (error) {
        console.log('Login failed');
        toast.error('Đăng nhập thất bại.');
      } finally {
        setSpinning(false);
      }
    }
  };

  const validateFormLogin = () => {
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

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100% ! important',
      }}
    >   
    {/* <Spin spinning={spinning} fullscreen> */}
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
              <Button type="primary" onClick={handleLogin} style={{backgroundColor:'#3697A6'}} loading={spinning}>
                Đăng nhập
              </Button>
            </Col>
            <Col>
              {/* <Link to="/forgot-password">
                <Button type='primary' ></Button>
              </Link> */}
            </Col>
          </Row>
        </Form>
      </Card>
      {/* </Spin> */}
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
        theme="light"
      />
    </div>
  );
};

export default Login;
