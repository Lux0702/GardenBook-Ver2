import React from 'react';
import { List, Button } from 'antd';
import '../assets/css/notifications.css';

const NotificationItem = ({ item }) => (
  <List.Item className={`notification-item ${item.isRead ? 'read' : 'unread'}`}>
    <List.Item.Meta
      title={<>
      <span style={{padding:'10px'}}>{item.title}</span>
      </>}
      description={
        <>
          <span style={{padding:'10px'}}>{item.description}</span>
          <br />
          <span style={{padding:'10px'}}>{item.description}</span>
          <span >{item.date}</span>
        </>
      }
    />
    <div  className="button-container">
        <Button type="link" className='span-more' >Xem Chi Tiết</Button>
    </div>
  </List.Item>
);

export default NotificationItem;
