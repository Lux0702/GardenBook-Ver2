import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Spin, Button, List, Avatar, Image } from 'antd';

import { LineChartOutlined, ShoppingCartOutlined, FileTextOutlined, DatabaseOutlined, BookOutlined, InteractionOutlined, UserOutlined, TagsOutlined } from '@ant-design/icons';
import '../../assets/css/dashboard.css';
import { useGetStatistic } from '../../utils/api';
import LineChart from './LineChart';
import CategoryBarChart from './CategoryBarChart';
import RevenueSummary from './RevenueSummary';
import { Bar } from 'react-chartjs-2';
import { BarChart } from 'recharts';
import CardBooks from '../CardBook';

const icons = {
  LineChartOutlined: <LineChartOutlined style={{ fontSize: '24px' }} />,
  ShoppingCartOutlined: <ShoppingCartOutlined style={{ fontSize: '24px' }} />,
  FileTextOutlined: <FileTextOutlined style={{ fontSize: '24px' }} />,
  DatabaseOutlined: <DatabaseOutlined style={{ fontSize: '24px' }} />,
  BookOutlined: <BookOutlined style={{ fontSize: '24px' }} />,
  InteractionOutlined: <InteractionOutlined style={{ fontSize: '24px' }} />,
  UserOutlined: <UserOutlined style={{ fontSize: '24px' }} />,
  TagsOutlined: <TagsOutlined style={{ fontSize: '24px' }} />,
};

const CardItem = ({ title, value, precision, prefixIcon, suffix, className, borderColor }) => (
  <Card style={{ borderLeft: `5px solid ${borderColor}` }} className={className} bordered={false}>
    <Statistic
      title={<span style={{ fontSize: '24px', color: 'black', fontWeight: '500' }}>{title}</span>}
      value={value}
      precision={precision}
      valueStyle={{ color: 'black', fontSize: '24px' }}
      prefix={icons[prefixIcon]}
      suffix={suffix}
    />
    <div className="wave"></div>
  </Card>
);

const DashboardCard = () => {
  const { statistic, fetchGetStatistic } = useGetStatistic();
  const [spinning, setSpinning] = useState(false);
  const [chartType, setChartType] = useState('ngày');
  const dataBook = JSON.parse(localStorage.getItem('books') || '[]');
  const topBooks = dataBook.sort((a, b) => b.soldQuantity - a.soldQuantity).slice(0, 5);

  const cardData = [
    { title: 'Doanh thu', value: statistic?.totalRevenue, suffix: 'VND', prefixIcon: 'LineChartOutlined', className: 'blue-gradient', borderColor: '#ef5350' },
    { title: 'Số đơn hàng', value: statistic?.orderCount, prefixIcon: 'ShoppingCartOutlined', className: 'cyan-gradient', borderColor: '#66bb6a' },
    { title: 'Số bài viết', value: statistic?.postCount, prefixIcon: 'FileTextOutlined', className: 'purple-gradient', borderColor: '#ffca28' },
    { title: 'Số lượng sản phẩm', value: statistic?.bookCount, prefixIcon: 'DatabaseOutlined', className: 'pink-gradient', borderColor: '#ab47bc' },
    { title: 'Số lượng tác giả', value: statistic?.authorCount, prefixIcon: 'BookOutlined', className: 'green-gradient', borderColor: '#29b6f6' },
    { title: 'Lượt tương tác', value: statistic?.commentCount, prefixIcon: 'InteractionOutlined', className: 'orange-gradient', borderColor: '#ff7043' },
    { title: 'Khách hàng', value: statistic?.userCount, prefixIcon: 'UserOutlined', className: 'red-gradient', borderColor: '#26a69a' },
    { title: 'Thể loại', value: statistic?.categoryCount, prefixIcon: 'TagsOutlined', className: 'yellow-gradient', borderColor: '#8d6e63' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchGetStatistic();
      } catch (error) {
        console.log('error', error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, []);

  const getChartData = () => {
    if (chartType === 'ngày') {
      return {
        labels: statistic?.revenueByDay ? Object.keys(statistic.revenueByDay) : [],
        data: statistic?.revenueByDay ? Object.values(statistic.revenueByDay) : [],
      };
    } else if (chartType === 'tháng') {
      return {
        labels: statistic?.revenueByMonth ? Object.keys(statistic.revenueByMonth) : [],
        data: statistic?.revenueByMonth ? Object.values(statistic.revenueByMonth) : [],
      };
    } else {
      return {
        labels: statistic?.revenueByYear ? Object.keys(statistic.revenueByYear) : [],
        data: statistic?.revenueByYear ? Object.values(statistic.revenueByYear) : [],
      };
    }
  };

  const { labels, data } = getChartData();

  return (
    <>
      <Row gutter={[16, 16]}>
        {cardData.slice(0, 4).map((card, index) => (
          <Col span={6} key={index}>
            <CardItem {...card} />
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        {cardData.slice(4).map((card, index) => (
          <Col span={6} key={index}>
            <CardItem {...card} />
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card
            title={<span style={{ fontSize: '20px', color: 'black', fontWeight: '500' }}>Thống kê doanh thu</span>}
            extra={
              <>
                <span style={{ fontSize: '20px', color: 'black', fontWeight: '200', marginRight: 5 }}>Thống kê theo:</span>
                <Button onClick={() => setChartType('ngày')} style={{ marginRight: 5 }}>Ngày</Button>
                <Button onClick={() => setChartType('tháng')} style={{ marginRight: 5 }}>Tháng</Button>
                <Button onClick={() => setChartType('năm')} style={{ marginRight: 5 }}>Năm</Button>
              </>
            }
          >
            <LineChart data={data} labels={labels} title={`Doanh thu theo ${chartType}`} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <RevenueSummary statistic={statistic} />
        </Col>
        <Col span={12}>
        <Card>
        <CategoryBarChart dataBook={dataBook} />
        </Card>
        </Col>
      </Row>
      {/* <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
              <Col span={12}>
                <Card title="Biểu đồ doanh số">
                  <LineChart />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Doanh thu hàng tuần">
                  <BarChart/>
                </Card>
              </Col>
            </Row> */}

            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
              <Col span={12}>
                  <CardBooks books={topBooks} isBook={'suggest'} />
              </Col>
              <Col span={12}>
                <Card title="Top khách hàng mua nhiều">
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      { name: 'Khách hàng A', purchases: 10 },
                      { name: 'Khách hàng B', purchases: 8 },
                      { name: 'Khách hàng C', purchases: 5 },
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={item.name}
                          description={`Số lần mua: ${item.purchases}`}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
      <Spin spinning={spinning} fullscreen />
    </>
  );
};

export default DashboardCard;
