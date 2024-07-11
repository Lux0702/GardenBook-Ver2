import React, { useState } from 'react';
import { Layout, Menu, Card, Col, Row,Avatar,theme, Statistic, Typography, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  DollarCircleOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const cardsData = [
    {
      title: 'Users',
      value: '26K',
      change: '-12.4%',
      color: '#6f42c1',
    },
    {
      title: 'Income',
      value: '$6.200',
      change: '40.9%',
      color: '#17a2b8',
    },
    {
      title: 'Conversion Rate',
      value: '2.49%',
      change: '84.7%',
      color: '#ffc107',
    },
    {
      title: 'Sessions',
      value: '44K',
      change: '-23.6%',
      color: '#dc3545',
    },
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            Sales
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            Products
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
            Customers
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
      <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 24 }}>Username</span>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: 'rgb(245, 247, 247)',
          }}
        >
            <Title level={3}>Dashboard</Title>
          <Row gutter={16}>
            {cardsData.map((card, index) => (
              <Col span={6} key={index}>
                <Card
                  style={{
                    borderLeft: `5px solid ${card.color}`,
                    borderRadius: borderRadiusLG,
                  }}
                  bordered={false}
                >
                  <div style={{ fontSize: '24px', color: card.color }}>{card.value}</div>
                  <div>{card.title}</div>
                  <div style={{ color: card.color }}>{card.change}</div>
                </Card>
              </Col>
            ))}
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Sales"
                  value={112893}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<DollarCircleOutlined />}
                  suffix="USD"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Top-Selling Products"
                  value={50}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Top Customers"
                  value={200}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Sales Performance">
                <Title level={4}>Monthly Sales</Title>
                {/* Add your chart component here */}
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Top-Selling Products">
                <Title level={4}>Product List</Title>
                {/* Add your top-selling products list component here */}
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Top Customers">
                <Title level={4}>Customer List</Title>
                {/* Add your top customers list component here */}
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
