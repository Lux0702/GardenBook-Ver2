import React, { useCallback, useEffect, useState } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import UserInfo from '../components/userInfo';
import ChangePassWord from '../components/ChangePassWord';
import AddressManager from '../components/AddressManager';
import NotificationList from '../components/Notification';
import HistoryOrderList from '../components/HistoryListOrder';
const { Content, Sider } = Layout;

const items = [
  {
    key: '0',
    icon: React.createElement(UserOutlined),
    label: 'Tài khoản của tôi',
    children: [
      {
        key: '1',
        label: 'Thông tin tài khoản',
        component: UserInfo,
        path: '/profile/account'
      },
      {
        key: '2',
        label: 'Đổi mật khẩu',
        component: ChangePassWord,
        path: '/profile/change-password'
      },
      {
        key: '3',
        label: 'Sổ địa chỉ',
        component: AddressManager,
        path: '/profile/address'
      },
    ],
  },
  {
    key: '4',
    icon: React.createElement(LaptopOutlined),
    label: 'Lịch sử mua hàng',
    component: HistoryOrderList,
    path: '/profile/order-history'
  },
  {
    key: '5',
    icon: React.createElement(NotificationOutlined),
    label: 'Thông báo',
    component: NotificationList,
    path: '/profile/notification'
  },
  {
    key: '6',
    icon: React.createElement(HeartOutlined),
    label: <Link className='link' to="/profile/wishlist">Danh sách yêu thích</Link>,
    path: '/profile/wishlist'
  }
];

const generateMenuItems = (items) => {
  return items.map(item => {
    if (item.children) {
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        children: item.children.map(child => ({
          key: child.key,
          label: child.label,
          component: child.component,
          path: child.path
        })),
      };
    }
    return {
      key: item.key,
      icon: item.icon,
      label: item.label,
      component: item.component,
      path: item.path
    };
  });
};

const UserAccount = () => {
  const [selectedComponent, setSelectedComponent] = useState(<UserInfo />);
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(['1']);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState(['0']);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    const { keyPath } = e;
    const selectedItem = keyPath.length === 2 ? 
      items.find(item => item.key === keyPath[1]).children.find(child => child.key === keyPath[0]) :
      items.find(item => item.key === keyPath[0]);

    setSelectedComponent(React.createElement(selectedItem.component));
    navigate(selectedItem.path); // Điều hướng đến đường dẫn của mục được chọn
  };

  const updateMenuSelection = useCallback(() => {
    const pathMap = {
      '/profile/account': { openKey: '0', selectedKey: '1' },
      '/profile/change-password': { openKey: '0', selectedKey: '2' },
      '/profile/address': { openKey: '0', selectedKey: '3' },
      '/profile/order-history': { openKey: '4', selectedKey: '4' },
      '/profile/notification': { openKey: '5', selectedKey: '5' },
      '/profile/wishlist': { openKey: '6', selectedKey: '6' },
      // Add more mappings as needed
    };
    const currentPath = location.pathname;
    const defaultKeys = pathMap[currentPath] || { openKey: '0', selectedKey: '1' };
    setDefaultOpenKeys([defaultKeys.openKey]);
    setDefaultSelectedKeys([defaultKeys.selectedKey]);

    // Cập nhật selectedComponent dựa trên đường dẫn hiện tại
    const selectedItem = items.find(item => item.path === currentPath) || items.find(item => item.children?.find(child => child.path === currentPath));
    if (selectedItem) {
      const childItem = selectedItem.children?.find(child => child.path === currentPath);
      setSelectedComponent(React.createElement(childItem ? childItem.component : selectedItem.component));
    }
  }, [location.pathname]);

  useEffect(() => {
    updateMenuSelection();
  }, [updateMenuSelection]);

  return (
    <Layout className='user-account'>
      <Header />
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 48px',
          minHeight: 'calc(100vh - 200px)' // Đảm bảo chiều cao tối thiểu để căn giữa theo chiều dọc
        }}
      >
        <div style={{ width: '80%' }}>
          <Breadcrumb
            style={{
              margin: '16px 0',
              fontSize: '15px',
            }}
          >
            <Breadcrumb.Item>
              <Link to="/" className='link'>Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Thông tin tài khoản</Breadcrumb.Item>
          </Breadcrumb>
          <Layout
            style={{
              padding: '24px 0',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Sider
              style={{
                background: colorBgContainer,
              }}
              width={240}
            >
              <Menu
                mode="inline"
                selectedKeys={defaultSelectedKeys}
                openKeys={defaultOpenKeys}
                style={{
                  height: '100%',
                }}
                items={generateMenuItems(items)}
                onClick={handleMenuClick}
                onOpenChange={(openKeys) => setDefaultOpenKeys(openKeys)}
              />
            </Sider>
            <Content
              style={{
                padding: '0 24px',
                minHeight: 'calc(100vh - 200px)'
              }}
            >
              {selectedComponent}
            </Content>
          </Layout>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default UserAccount;
