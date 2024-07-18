import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Slider, DatePicker, Select, Spin, message, Table, Tooltip, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { API_URL } from '../../utils/constant';
import { useDataBook, useDeleteDiscount, useGetDiscounts } from '../../utils/api';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const AddDiscount = () => {
  const [form] = Form.useForm();
  const { discounts, fetchDiscounts } = useGetDiscounts();
  const { dataBook, setBooks, fetchBooks } = useDataBook();
  const { fetchDeleteDiscount } = useDeleteDiscount();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchDiscounts();
        const store = localStorage.getItem('books');
        if (store) {
          setBooks(JSON.parse(store));
        } else {
          await fetchBooks();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, [reload]);

  useEffect(() => {
    setFilteredData(
      discounts.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, discounts]);

  const handleAddDiscount = async (values) => {
    try {
      setLoading(true);
      const tokenString = localStorage.getItem('tokenAdmin');
      const token = JSON.parse(tokenString);
      const { discountPercent, dateRange, bookIds } = values;
      const startDate = dateRange ? dateRange[0].format('YYYY-MM-DD') : null;
      const endDate = dateRange ? dateRange[1].format('YYYY-MM-DD') : null;

      const newDiscount = { discountPercent, startDate, endDate };

      if (bookIds.includes('all')) {
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
        const promises = bookIds.map(bookId => {
          return fetch(`${API_URL}/api/v1/books/${bookId}/discounts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token?.accessToken}`,
            },
            body: JSON.stringify(newDiscount),
          });
        });
        const results = await Promise.all(promises);
        if (results.every(result => result.ok)) {
          message.success('Thêm giảm giá thành công!');
        } else {
          throw new Error('Thêm giảm giá thất bại!');
        }
      }

      form.resetFields();
      setReload(!reload);
    } catch (error) {
      message.error('Thêm giảm giá thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async (bookId) => {
    setLoading(true);
    try {
      const success = await fetchDeleteDiscount(bookId);
      if (success) {
        message.success('Xóa giảm giá thành công!');
        setReload(!reload);
      } else {
        throw new Error('Xóa giảm giá thất bại!');
      }
    } catch (error) {
      message.error('Xóa giảm giá thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelectedDiscounts = async () => {
    setLoading(true);
    try {
      const promises = selectedRowKeys.map(bookId => fetchDeleteDiscount(bookId));
      const results = await Promise.all(promises);
      if (results.every(result => result)) {
        message.success('Đã xóa giảm giá cho các sách đã chọn!');
        setReload(!reload);
      } else {
        throw new Error('Xóa giảm giá thất bại!');
      }
      setSelectedRowKeys([]);
    } catch (error) {
      message.error('Xóa giảm giá thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllDiscounts = async () => {
    setLoading(true);
    try {
      const promises = discounts.map(book => fetchDeleteDiscount(book._id));
      const results = await Promise.all(promises);
      if (results.every(result => result)) {
        message.success('Đã xóa giảm giá cho tất cả sách!');
        setReload(!reload);
      } else {
        throw new Error('Xóa giảm giá thất bại!');
      }
    } catch (error) {
      message.error('Xóa giảm giá thất bại!');
    } finally {
      setLoading(false);
    }
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
      title: 'Thời gian bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => text ? moment(text).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => text ? moment(text).format('DD/MM/YYYY') : 'N/A',
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
        <Card
          title="Danh sách sách"
          extra={
            <Tooltip title="Xóa giảm giá các sách đã chọn">
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                onClick={handleDeleteSelectedDiscounts}
                disabled={!selectedRowKeys.length}
              />
            </Tooltip>
          }
          style={{ flex: 1 }}
        >
          <Spin spinning={spinning}>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredData.map((book) => ({ key: book._id, ...book }))}
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
              bookIds: [],
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
              name="bookIds"
              label="Sách"
              rules={[{ required: true, message: 'Vui lòng chọn sách' }]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn sách"
                style={{ width: '100%' }}
              >
                <Option value="all">Tất cả sách</Option>
                {dataBook.map((book) => (
                  <Option key={book._id} value={book._id}>
                    {book.title}
                  </Option>
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
      </div>
    </>
  );
};

export default AddDiscount;
