import React, { useState, useEffect } from 'react';
import { List, Button, Pagination, Spin, message } from 'antd';
import NotificationItem from './NotificationItem';
import '../assets/css/notifications.css';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { API_URL } from '../utils/constant';
import { useChangeRead } from '../utils/api';

const NotificationList = () => {
  const { fetchChangeRead } = useChangeRead();
  const [notifications, setNotifications] = useState([]);
  const [spinning, setSpinning] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token') || '""'); 
    const user = JSON.parse(localStorage.getItem('userInfo') || '""'); 

    if (!token || !user) {
      console.error('Token hoặc UserId không tồn tại.');
      return;
    }

    setSpinning(true);
    fetch(`${API_URL}/api/v1/notifications`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token.accessToken,
      },
    })
      .then(response => response.json())
      .then(data => {
        setNotifications(
          (data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
         setSpinning(false);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
        setSpinning(false);
      });

      const socket = new SockJS('/ws'); //`${API_URL}/ws`
      const client = Stomp.over(socket);
  
      client.connect({}, (frame) => {
        console.log('Connected: ' + frame);
  
        // Subscribe to notifications channel
        client.subscribe('/topic/notifications/' + user.userId, (notification) => {
          setNotifications(prevNotifications => {
            const newNotifications = [...prevNotifications, JSON.parse(notification.body)];
            return newNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          });
        });
  
        setStompClient(client); // Save the client to state
      });
  
      // Cleanup on component unmount
      return () => {
        if (stompClient) {
          stompClient.disconnect();
        }
      };
  }, [stompClient]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const markAllAsRead = async () => {
    const updateResults = await Promise.all(
      notifications.map(notification => fetchChangeRead(notification.id, true))
    );

    if (updateResults.every(result => result)) {
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      message.success('Đánh dấu tất cả thông báo là đã đọc thành công!');
    } else {
      message.error('Có lỗi xảy ra khi đánh dấu tất cả thông báo là đã đọc.');
    }
  };

  const handleReadNotification = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const paginatedNotifications = notifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="notification-list">
      <div className="notification-header">
        <h2 style={{ fontWeight: 'bold' }}>Thông báo</h2>
        <Button type="link" onClick={markAllAsRead}>Đánh dấu Đã đọc tất cả</Button>
      </div>
      <Spin spinning={spinning}>
        <List
          itemLayout="vertical"
          dataSource={paginatedNotifications}
          renderItem={item => (
            <NotificationItem key={item.id} item={item} onRead={handleReadNotification} />
          )}
        />
      </Spin>
      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={notifications.length}
        onChange={handlePageChange}
        style={{ textAlign: 'center', marginTop: '16px' }}
      />
    </div>
  );
};

export default NotificationList;
