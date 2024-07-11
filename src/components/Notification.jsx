import React, { useState } from 'react';
import { List, Button, Pagination } from 'antd';
import NotificationItem from './NotificationItem';
import '../assets/css/notifications.css';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "DEAL 0Đ DÀNH RIÊNG Sang",
      description: "⚡ Cùng ưu đãi Freeship 0Đ mọi đơn hàng 🛒 Chỉ bạn mới có đặc quyền này 🛍️ Mua sắm ngay!",
      date: "10:00 03-07-2024",
      isRead: false,
    },
    {
      id: 2,
      title: "kochinokaro ơi!",
      description: "👟 \"Giày Jordan Cổ Tháp, Giày...\" chỉ ₫275.000 trong giỏ hàng đang đợi bạn chốt đơn 👉 Mua ngay kẻo hết!",
      date: "07:00 02-07-2024",
      isRead: false,
    },
    {
      id: 3,
      title: "VOUCHER 500K NẠP ĐẦY CHUYẾN CUỐI🔥",
      description: "🛒Shop mới GIẢM ĐẾN 50% tới bến 🚴‍♀️ Thêm mã FREESHIP muôn nơi 🌞 Deal hời đang đợi, đặt liền bạn ơi!",
      date: "20:48 01-07-2024",
      isRead: false,
    },
    {
      id: 4,
      title: "HÀNG CAO CẤP MUA 1 TẶNG 1🌟",
      description: "💝 Áp thêm mã giảm 15% quá hời 💛Thêm deal xu hướng giảm giá 15 ngày 🎉 Săn liền máy \"bánh\" ơi!",
      date: "10:07 01-07-2024",
      isRead: false,
    },
    {
      id: 5,
      title: "Thông báo mới",
      description: "Đây là một thông báo mới.",
      date: "10:07 30-06-2024",
      isRead: false,
    },
    {
      id: 6,
      title: "Thông báo mới",
      description: "Đây là một thông báo mới.",
      date: "10:07 30-06-2024",
      isRead: false,
    },
    {
      id: 7,
      title: "Thông báo mới",
      description: "Đây là một thông báo mới.",
      date: "10:07 30-06-2024",
      isRead: false,
    },
    {
      id: 8,
      title: "Thông báo mới",
      description: "Đây là một thông báo mới.",
      date: "10:07 30-06-2024",
      isRead: false,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const paginatedNotifications = notifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="notification-list">
      <div className="notification-header">
        <h2 style={{fontWeight:'bold'}}>Thông báo</h2>
        <Button type="link" onClick={markAllAsRead}>Đánh dấu Đã đọc tất cả</Button>
      </div>
      <List
        itemLayout="vertical"
        dataSource={paginatedNotifications}
        renderItem={item => (
          <NotificationItem key={item.id} item={item} />
        )}
      />
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
