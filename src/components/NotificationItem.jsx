import React from 'react';
import { List, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../assets/css/notifications.css';
import { useChangeRead } from '../utils/api';

const NotificationItem = ({ item, onRead }) => {
  const { fetchChangeRead } = useChangeRead();
  const navigate = useNavigate();

  const handleViewDetail = async () => {
    const success = await fetchChangeRead(item.id, true);
    if (success) {
      onRead(item.id);
      if(item.url){
        window.location.href = item.url
      }

    }
  };

  return (
    <List.Item className={`notification-item ${item.read ? 'read' : 'unread'}`}>
      <List.Item.Meta
        title={<span style={{ padding: '10px' }}>{item.title}</span>}
        description={
          <>
            <span style={{ padding: '10px' }}>{item.message}</span>
            <br />
            <span style={{ padding: '10px' }}>Thời gian: {new Date(item.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
          </>
        }
      />
      <div className="button-container">
        <Button type="link" className="span-more" onClick={handleViewDetail}>Xem Chi Tiết</Button>
      </div>
    </List.Item>
  );
};

export default NotificationItem;
