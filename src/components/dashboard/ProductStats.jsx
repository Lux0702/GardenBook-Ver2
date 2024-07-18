import React, { useEffect, useState } from 'react';
import { Card, Spin, Tabs, List, Row, Col, Pagination } from 'antd';
import BarChart from './BarChart'; // Assume you have a BarChart component
import { useGetAllOrder } from '../../utils/api';

const { TabPane } = Tabs;

const OrderStatistics = () => {
  const { fetchGetOrder } = useGetAllOrder();
  const [orderData, setOrderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, true);
  }, []);

  const fetchData = async (page = 1, size = 10, isInitialLoad = false) => {
    try {
      setSpinning(true);
      const response = await fetchGetOrder(page, size);
      if (response) {
        setOrderData(response.content);
        setFilteredData(response.content);
        setPagination({
          current: page,
          pageSize: size,
          total: response.totalElements,
        });
        setSpinning(false);
        if (isInitialLoad) {
          const allOrdersResponse = await fetchGetOrder(1, response.totalElements);
          if (allOrdersResponse) {
            console.log('allOrdersResponse', allOrdersResponse.content);
            setAllOrders(allOrdersResponse.content);
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
     
    }
  };

  const handleTableChange = (page, pageSize) => {
    fetchData(page, pageSize);
  };

  const getFilteredOrders = (status) => {
    if (['PENDING', 'DELIVERED', 'DELIVERING', 'CANCEL'].includes(status)) {
      return orderData.filter(order => order.status === status);
    }
    return orderData;
  };

  useEffect(() => {
    setFilteredData(getFilteredOrders(currentTab));
    console.log('order:', orderData);
  }, [currentTab, orderData]);

  const getOrderChartData = () => {
    const ordersByDay = allOrders.reduce((acc, order) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'PROCESSING':
        return 'Đã xác nhận';
      case 'DELIVERED':
      case 'CONFIRMED':
        return 'Đã giao';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return 'Đang giao';
    }
  };
useEffect(()=>{
  window.scrollTo(0,0)
},[pagination.current])
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <BarChart data={data} labels={labels} title="Đơn hàng theo ngày" />
        </Col>
      </Row>
      <Card
        title={<span style={{ fontSize: '20px', color: 'black', fontWeight: '500'}}>Thống kê đơn hàng</span>}
      >
        <Spin spinning={spinning}>
          <Tabs defaultActiveKey="all" onChange={(key) => setCurrentTab(key)} style={{maxHeight:500, overflowY:'auto'}}>
            <TabPane tab="Tất cả đơn hàng" key="all">
              <List
                itemLayout="horizontal"
                dataSource={filteredData}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={`Đơn hàng #${item._id}`}
                      description={(
                        <>
                          <p>Trạng thái: {getStatusText(item.status)}</p>
                          <p>Tổng số tiền: {item.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        </>
                      )}
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
                      description={(
                        <>
                          <p>Trạng thái: {getStatusText(item.status)}</p>
                          <p>Tổng số tiền: {item.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        </>
                      )}
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
                      description={(
                        <>
                          <p>Trạng thái: {getStatusText(item.status)}</p>
                          <p>Tổng số tiền: {item.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        </>
                      )}
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
                      description={(
                        <>
                          <p>Trạng thái: {getStatusText(item.status)}</p>
                          <p>Tổng số tiền: {item.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        </>
                      )}
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
                      description={(
                        <>
                          <p>Trạng thái: {getStatusText(item.status)}</p>
                          <p>Tổng số tiền: {item.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        </>
                      )}
                    />
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handleTableChange}
            style={{ marginTop: '20px', textAlign: 'right' }}
          />
        </Spin>
      </Card>
    </>
  );
};

export default OrderStatistics;
