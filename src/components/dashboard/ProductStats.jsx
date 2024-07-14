import React, { useEffect, useState } from 'react';
import { Card, Spin, Tabs, List, Row, Col } from 'antd';
import BarChart from './BarChart'; // Assume you have a BarChart component
import { useGetAllOrder } from '../../utils/api';

const { TabPane } = Tabs;

const OrderStatistics = () => {
  const { fetchGetOrder } = useGetAllOrder();
  const [orderData, setOrderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        const success = await fetchGetOrder(1,10);
        console.log('order là:', success);
        if (success) {
          setOrderData(success.content);
          setFilteredData(success.content);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredOrders = (status) => {
    if (['PENDING', 'DELIVERED', 'DELIVERING', 'CANCEL'].includes(status)) {
      return orderData.filter(order => order.status === status);
    }
    return orderData;
  };

  useEffect(() => {
    setFilteredData(getFilteredOrders(currentTab));
    console.log('order:',orderData)
  }, [currentTab, orderData]);

  const getOrderChartData = () => {
    // Assuming you want to show order count per day for the chart
    const ordersByDay = orderData.reduce((acc, order) => {
      const date = new Date(order.orderDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(ordersByDay),
      data: Object.values(ordersByDay),
    };
  };

  const { labels, data } = getOrderChartData();

  return (
    <Card
      title={<span style={{ fontSize: '20px', color: 'black', fontWeight: '500' }}>Thống kê đơn hàng</span>}
    >
      <Spin spinning={spinning}>
        <Tabs defaultActiveKey="all" onChange={(key) => setCurrentTab(key)}>
          <TabPane tab="Tất cả đơn hàng" key="all">
            <List
              itemLayout="horizontal"
              dataSource={filteredData}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={`Đơn hàng #${item._id}`}
                    description={`Trạng thái: ${item.status}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="Đơn chờ xác nhận" key="PENDING">
            <List
              itemLayout="horizontal"
              dataSource={filteredData}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={`Đơn hàng #${item._id}`}
                    description={`Trạng thái: ${item.status}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="Đơn đã giao" key="DELIVERED">
            <List
              itemLayout="horizontal"
              dataSource={filteredData}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={`Đơn hàng #${item._id}`}
                    description={`Trạng thái: ${item.status}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="Đơn đang giao" key="DELIVERING">
            <List
              itemLayout="horizontal"
              dataSource={filteredData}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={`Đơn hàng #${item._id}`}
                    description={`Trạng thái: ${item.status}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="Đơn đã hủy" key="CANCEL">
            <List
              itemLayout="horizontal"
              dataSource={filteredData}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={`Đơn hàng #${item._id}`}
                    description={`Trạng thái: ${item.status}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <BarChart data={data} labels={labels} title="Đơn hàng theo ngày" />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Card title="Dự đoán chỉ tiêu đơn hàng">
              <p>Chức năng dự đoán chỉ tiêu đơn hàng sẽ được triển khai ở đây.</p>
            </Card>
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default OrderStatistics;
