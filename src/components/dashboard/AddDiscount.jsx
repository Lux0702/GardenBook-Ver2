import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Slider, DatePicker, Select, Spin, List, message } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const fakeBooks = [
  { _id: '1', title: 'Book 1' },
  { _id: '2', title: 'Book 2' },
  { _id: '3', title: 'Book 3' },
];

const fakeDiscounts = [
  { discountPercent: 10, startDate: '2024-07-01', endDate: '2024-07-10', bookId: '1' },
  { discountPercent: 15, startDate: '2024-07-06', endDate: '2024-07-15', bookId: '2' },
  { discountPercent: 20, startDate: '2024-07-10', endDate: '2024-07-20', bookId: null },
];

const AddDiscount = () => {
  const [form] = Form.useForm();
  const [dataBook, setDataBook] = useState(fakeBooks);
  const [discounts, setDiscounts] = useState(fakeDiscounts);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    // Giả lập việc lấy dữ liệu sách và giảm giá
    const fetchData = async () => {
      try {
        setSpinning(true);
        // Giả lập delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Thay bằng hàm fetchBooks và fetchDiscounts nếu có API thực
        setDataBook(fakeBooks);
        setDiscounts(fakeDiscounts);
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, []);

  const handleAddDiscount = async (values) => {
    try {
      const { discountPercent, dateRange, bookId } = values;
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      
      const newDiscount = { discountPercent, startDate, endDate, bookId: bookId === 'all' ? null : bookId };
      
      setDiscounts([...discounts, newDiscount]);
      message.success('Thêm giảm giá thành công!');
      form.resetFields();
    } catch (error) {
      message.error('Thêm giảm giá thất bại!');
    }
  };

  return (
    <div className="discount-container" style={{ display: 'flex', gap: '20px' }}>
      <Card title="Tạo giảm giá mới" style={{ flex: 1 }}>
        <Spin spinning={spinning}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddDiscount}
            initialValues={{
              discountPercent: 0,
              dateRange: [moment(), moment().add(7, 'days')],
              bookId: 'all',
            }}
          >
            <Form.Item
              name="discountPercent"
              label="Phần trăm giảm giá"
              rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá' }]}
            >
              <Slider min={0} max={100} />
            </Form.Item>
            <Form.Item
              name="dateRange"
              label="Thời gian giảm giá"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian giảm giá' }]}
            >
              <RangePicker />
            </Form.Item>
            <Form.Item
              name="bookId"
              label="Sách"
              rules={[{ required: true, message: 'Vui lòng chọn sách' }]}
            >
              <Select>
                <Option value="all">Tất cả sách</Option>
                {dataBook.map(book => (
                  <Option key={book._id} value={book._id}>{book.title}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thêm giảm giá
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
      <Card title="Danh sách giảm giá" style={{ flex: 1 }}>
        <Spin spinning={spinning}>
          <List
            itemLayout="horizontal"
            dataSource={discounts}
            renderItem={discount => (
              <List.Item>
                <List.Item.Meta
                  title={`Giảm ${discount.discountPercent}%`}
                  description={`Từ ${discount.startDate} đến ${discount.endDate}`}
                />
                <div>{discount.bookId ? dataBook.find(book => book._id === discount.bookId)?.title : 'Tất cả sách'}</div>
              </List.Item>
            )}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default AddDiscount;
