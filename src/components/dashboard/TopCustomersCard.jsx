import React, { useState, useEffect } from 'react';
import { Card, List, Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTopOrder } from '../../utils/api';

const TopCustomersCard = () => {
  const {topCustomers, fetchTopCustomers} = useTopOrder();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        await fetchTopCustomers(); 
      } catch (error) {
        console.error("Failed to fetch top customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTop();
  }, []);

  return (
    <div style={{ marginTop: 10 }}>
      <Card
        title={
          <div>
            <span style={{ fontWeight: '700', fontSize: 20 }}>
              Top 5 khách hàng thân thiết
            </span>
          </div>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={topCustomers.slice(0,5)}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} icon={!item.avatar && <UserOutlined />} />}
                  title={item.fullName}
                  description={`Số lần mua: ${item.orderCount}`}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default TopCustomersCard;
