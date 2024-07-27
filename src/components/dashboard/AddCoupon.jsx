import React from 'react';
import { Card, Form, Input, DatePicker, Button, InputNumber,message } from 'antd';
import { API_URL } from '../../utils/constant';
const { RangePicker } = DatePicker;

const AddCouponCard = () => {
  const [form] = Form.useForm();

  const handleAddCoupon = async (values) => {
    try {
      const tokenString = localStorage.getItem('tokenAdmin');
      const token = JSON.parse(tokenString);
      const { code, discountAmount, dateRange, quantity } = values;
      const startDate = dateRange ? dateRange[0].format('YYYY-MM-DD') : null;
      const endDate = dateRange ? dateRange[1].format('YYYY-MM-DD') : null;

      const newCoupon = { code, discountAmount, startDate, endDate, quantity };
      console.log('newCoupon', newCoupon);

      const response = await fetch(`${API_URL}/api/v1/coupons/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`,
        },
        body: JSON.stringify(newCoupon),
      });

      if (response.ok) {
        message.success('Thêm mã giảm giá thành công!');
        form.resetFields();
      } else {
        message.error('Thêm mã giảm giá thất bại!');
      }
    } catch (error) {
      message.error('Thêm mã giảm giá thất bại!');
    }
  };

  return (
    <Card title="Tạo mã giảm giá mới" >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddCoupon}
        initialValues={{
          code: '',
          discountAmount: 0,
          dateRange: null,
          quantity: 1,
        }}
      >
        <Form.Item
          name="code"
          label="Mã giảm giá"
          rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá' }]}
        >
          <Input placeholder="Nhập mã giảm giá" />
        </Form.Item>
        <Form.Item
          name="discountAmount"
          label="Số tiền giảm giá"
          rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm giá' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            placeholder="Nhập số tiền giảm giá"
          />
        </Form.Item>
        <Form.Item
          name="dateRange"
          label="Thời gian giảm giá"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian giảm giá' }]}
        >
          <RangePicker
            format="YYYY-MM-DD"
            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Số lượng"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            placeholder="Nhập số lượng"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm mã giảm giá
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddCouponCard;
