import React, { useState, useCallback, useEffect } from 'react';
import { Layout, Menu, Input, Avatar, Dropdown ,Modal} from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { items } from '../../components/dashboard/menuItems';
import Logo from '../../assets/images/Book-logos_black.png';
import { useProfileAdmin, useLogoutAdmin } from '../../utils/api';
import { ToastContainer, collapseToast, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfoAdmin from '../../components/dashboard/InfoAdmin';
const { Header, Sider, Content } = Layout;
const { Search } = Input;

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

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(['1']);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState(['1']); // Open the first menu by default
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { userData, setUserDataAdmin, fetchProfileDataAdmin } = useProfileAdmin();
  const { fetchLogoutAdmin } = useLogoutAdmin();

  useEffect(() => {
    const tokenString = localStorage.getItem('tokenAdmin');
    const token = JSON.parse(tokenString);
    const userInfo = localStorage.getItem('AdminInfo');
    if (userInfo) {
      setUserDataAdmin(JSON.parse(userInfo));
    } else if (token) {
      fetchProfileDataAdmin(token?.accessToken);
    }
  }, [fetchProfileDataAdmin, setUserDataAdmin]);
  const handleView = async () => {
    setIsDetailModalOpen(true);
  };
  const handleDetailCancel = () => {
    setIsDetailModalOpen(false);
  };
  const handleMenuClick = (e) => {
    const { keyPath } = e;
    const selectedItem = keyPath.length === 2 ?
      items.find(item => item.key === keyPath[1]).children.find(child => child.key === keyPath[0]) :
      items.find(item => item.key === keyPath[0]);

    navigate(`/admin/${selectedItem.path}`);
  };

  const handleLogout = async () => {
    const tokenString = localStorage.getItem('tokenAdmin');
    const token = JSON.parse(tokenString);
    await fetchLogoutAdmin(token);
  };

  const updateMenuSelection = useCallback(() => {
    const currentPath = location.pathname.replace("/admin/", "");
    const selectedItem = items.find(item => item.path === currentPath) ||
      items.find(item => item.children?.find(child => child.path === currentPath))?.children?.find(child => child.path === currentPath) ||
      items[0];
    const parentItem = items.find(item => item.children?.find(child => child.path === currentPath)) || { key: selectedItem.key };
    setDefaultSelectedKeys([selectedItem.key]);
    setDefaultOpenKeys([parentItem.key]);
  }, [location.pathname]);

  useEffect(() => {
    updateMenuSelection();
  }, [updateMenuSelection]);

  const itemAccount = [
    {
      key: '1',
      label: <span onClick={handleView}>Thông tin cá nhân</span>,
    },
    {
      key: '4',
      label: <span onClick={handleLogout}>Đăng xuất</span>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={250} style={{ background: 'linear-gradient(45deg, rgba(24, 90, 157, 0.7), rgba(67, 206, 162, 0.5))' }}>
        <div className="logo" style={{ marginBottom: !collapsed ? 50 : 0 }}>
          <img src={Logo} alt="Logo" style={{ width: '100%' }} />
        </div>
        <Menu
          style={{ background: 'none' }}
          mode="inline"
          selectedKeys={defaultSelectedKeys}
          openKeys={defaultOpenKeys}
          onClick={handleMenuClick}
          onOpenChange={(openKeys) => setDefaultOpenKeys(openKeys)}
          items={generateMenuItems(items)}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ display: 'flex', justifyContent: 'space-between', padding: 0, alignItems: 'center' }}>
          <div>
            {collapsed ? <MenuUnfoldOutlined className="trigger" onClick={() => setCollapsed(!collapsed)} /> : <MenuFoldOutlined className="trigger" onClick={() => setCollapsed(!collapsed)} />}
          </div>
          <Search
            placeholder="Tìm kiếm..."
            style={{ width: 500 }}
            onSearch={value => console.log(value)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Dropdown menu={{ items: itemAccount }} trigger={['click']}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 50 }}>
                <Avatar src={userData?.avatar} icon={!userData?.avatar && <UserOutlined />} />
                <span style={{ marginLeft: '8px' }}>{userData?.fullName}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
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
      </Layout>
      <Modal 
        title={null}
        open={isDetailModalOpen}
        footer={null}
        onCancel={handleDetailCancel}
        >
          <InfoAdmin/>
      </Modal>
    </Layout>
  );
};

export default Dashboard;
