import React, { useState } from 'react';
import { Card, Form, Input, Button, List, Spin, message as antdMessage } from 'antd';

const { TextArea } = Input;

const fakeNotifications = [
  { title: 'Chào mừng', message: '⚡ Cùng ưu đãi Freeship 0Đ mọi đơn hàng 🛒 Chỉ bạn mới có đặc quyền này 🛍️ Mua sắm ngay!' },
  { title: 'Khuyến mãi', message: 'Giảm giá 20% cho tất cả các sách trong tuần này!' },
  { title: 'Khuyến mãi', message: '🛒Shop mới GIẢM ĐẾN 50% tới bến 🚴‍♀️ Thêm mã FREESHIP muôn nơi 🌞 Deal hời đang đợi, đặt liền bạn ơi!' },
];

const NotificationManager = () => {
  const [form] = Form.useForm();
  const [notifications, setNotifications] = useState(fakeNotifications);
  const [spinning, setSpinning] = useState(false);

  const handleAddNotification = async (values) => {
    try {
      setSpinning(true);
      // Giả lập việc gửi thông báo
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Thay bằng hàm sendNotification nếu có API thực
      setNotifications([...notifications, values]);
      antdMessage.success('Gửi thông báo thành công!');
      form.resetFields();
    } catch (error) {
      antdMessage.error('Gửi thông báo thất bại!');
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="notification-manager" style={{ display: 'flex', gap: '20px' }}>
      <Card title="Tạo thông báo mới" style={{ flex: 1 }}>
        <Spin spinning={spinning}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddNotification}
            initialValues={{
              title: '',
              message: '',
            }}
          >
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="message"
              label="Nội dung"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung thông báo' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Gửi thông báo
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
      <Card title="Danh sách thông báo" style={{ flex: 1 }}>
        <Spin spinning={spinning}>
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={notification => (
              <List.Item>
                <List.Item.Meta
                  title={notification.title}
                  description={notification.message}
                />
              </List.Item>
            )}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default NotificationManager;
