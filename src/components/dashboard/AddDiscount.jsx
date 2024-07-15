import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Slider, DatePicker, Select, Spin, message, Table, Tooltip, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { API_URL } from '../../utils/constant';
import { useDataBook, useDeleteDiscount } from '../../utils/api';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;
const AddDiscount = () => {
  const [form] = Form.useForm();
  const { dataBook, fetchBooks } = useDataBook();
  const { fetchDeleteDiscount } = useDeleteDiscount();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchBooks();
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, [loading]);
  useEffect(() => {
    setFilteredData(
      dataBook.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, dataBook]);
  const handleAddDiscount = async (values) => {
    try {
      setLoading(true);
      const tokenString = localStorage.getItem('tokenAdmin');
      const token = JSON.parse(tokenString);
      const { discountPercent, dateRange, bookId } = values;
      const startDate = dateRange ? dateRange[0].format('YYYY-MM-DD') : null;
      const endDate = dateRange ? dateRange[1].format('YYYY-MM-DD') : null;

      const newDiscount = { discountPercent, startDate, endDate };

      if (bookId === 'all') {
        const promises = dataBook.map(book => {
          return fetch(`${API_URL}/api/v1/books/${book._id}/discounts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token?.accessToken}`,
            },
            body: JSON.stringify(newDiscount),
          });
        });
        await Promise.all(promises);
        message.success('Thêm giảm giá cho tất cả sách thành công!');
      } else {
        const response = await fetch(`${API_URL}/api/v1/books/${bookId}/discounts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.accessToken}`,
          },
          body: JSON.stringify(newDiscount),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Thêm giảm giá thất bại!');
        }
        message.success('Thêm giảm giá thành công!');
      }

      form.resetFields();
    } catch (error) {
      message.error('Thêm giảm giá thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async (bookId) => {
    setLoading(true);
    const success = await fetchDeleteDiscount(bookId);
    if (success) {
      message.success('Xóa giảm giá thành công!');
    } else {
      message.error('Xóa giảm giá thất bại!');
    }
    setLoading(false);
  };

  const handleDeleteSelectedDiscounts = async () => {
    setLoading(true);
    const promises = selectedRowKeys.map(bookId => fetchDeleteDiscount(bookId));
    const results = await Promise.all(promises);
    if (results.every(result => result)) {
      message.success('Đã xóa giảm giá cho các sách đã chọn!');
    } else {
      message.error('Xóa giảm giá thất bại!');
    }
    setSelectedRowKeys([]);
    setLoading(false);
  };

  const handleDeleteAllDiscounts = async () => {
    setLoading(true);
    const promises = dataBook.map(book => fetchDeleteDiscount(book._id));
    const results = await Promise.all(promises);
    if (results.every(result => result)) {
      message.success('Đã xóa giảm giá cho tất cả sách!');
    } else {
      message.error('Xóa giảm giá thất bại!');
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'Tên sách',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discountPercent',
      key: 'discountPercent',
      render: (discountPercent) => `${discountPercent}%`,
    },
    {
      title: 'Giá gốc (VND)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
    {
      title: 'Giá sau giảm (VND)',
      dataIndex: 'price',
      key: 'discountedPrice',
      render: (text, record) => {
        const discountedPrice = record.price - (record.price * (record.discountPercent / 100));
        return discountedPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Tooltip title="Xóa giảm giá">
          <Button
            type="danger"
            icon={<DeleteOutlined style={{ color: 'red' }} />}
            onClick={() => handleDeleteDiscount(record._id)}
          />
        </Tooltip>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
          <Card style={{ marginBottom: 10, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Danh sách giảm giá</h2>
          <Search
            placeholder="Tìm kiếm sách"
            onChange={handleSearch}
            style={{ width: 300 }}
            className="custom-search-input"
          />
        </div>
      </Card>
    <div className="discount-container" style={{ display: 'flex', gap: '20px' }}>

      <Card title="Danh sách sách" extra={
        <Tooltip title="Xóa giảm giá các sách đã chọn">
          <Button type="danger" icon={<DeleteOutlined />} onClick={handleDeleteSelectedDiscounts} disabled={!selectedRowKeys.length} />
        </Tooltip>
      } style={{ flex: 1 }}>
        <Spin spinning={spinning}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredData.map((book, index) => ({ key: book._id, ...book }))}
            scroll={{ y: 500 }}
          />
        </Spin>
      </Card>
      <Card title="Tạo giảm giá mới" style={{ height: '400px' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddDiscount}
            initialValues={{
              discountPercent: 0,
              dateRange: null,
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
              <RangePicker
                format="YYYY-MM-DD"
                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
              />
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
              <Button type="primary" htmlType="submit" loading={loading}>
                Thêm giảm giá
              </Button>
            </Form.Item>
          </Form>
      </Card>
    </div>  </>
  );
};

export default AddDiscount;
