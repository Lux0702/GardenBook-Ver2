import React, { useState } from 'react';
import {
  Layout, Menu, Card, Row, Col, Statistic, Spin, List, Avatar, Image
} from 'antd';
import {
  UserOutlined, LineChartOutlined, ShoppingCartOutlined, BarChartOutlined, MenuFoldOutlined, MenuUnfoldOutlined, FileTextOutlined, DatabaseOutlined, InteractionOutlined, TagsOutlined, BookOutlined
} from '@ant-design/icons';
import LineChart from '../../components/dashboard/LineChart';
import BarChart from '../../components/dashboard/BarChart';
import "../../assets/css/dashboard.css";
import Logo from "../../assets/images/logo-home.png";
import DashboardCard from '../../components/dashboard/DashboardCard';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [spinning, setSpinning] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <Image width={'100%'} src={Logo} />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<LineChartOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Users
          </Menu.Item>
          <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
            Products
          </Menu.Item>
          <Menu.Item key="4" icon={<BarChartOutlined />}>
            Reports
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <MenuFoldOutlined className="trigger" onClick={() => setCollapsed(!collapsed)} />
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
          {/* <Spin spinning={!spinning} > */}
            <DashboardCard/>

            
          {/* </Spin> */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
