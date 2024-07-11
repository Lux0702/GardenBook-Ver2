import React, {useEffect} from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartComponents from '../components/CartComponents'
import { Link } from 'react-router-dom';
const { Content } = Layout;
const items = new Array(15).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));
const Cart = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  return (
    <Layout>
      <Header/>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
            fontSize: '15px',

          }}
        >
          <Breadcrumb.Item><Link to='/' style={{textDecoration:'none'}}>Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/profile/account' style={{textDecoration:'none'}}>Thông tin tài khoản</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Giỏ hàng</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <CartComponents/>
        </div>
      </Content>
      <Footer/>
    </Layout>
  );
};
export default Cart;