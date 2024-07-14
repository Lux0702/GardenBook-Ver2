import React, { useState, useEffect } from 'react';
import { Table, Tag, Input, Row, Col, Card, Tooltip, Checkbox, Modal, Spin, Select, Button, message } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import OrderDetail from '../OrderDetail'; // Adjust the import path as needed
import { useGetAllOrder, useUpdateOrderStatus } from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Search } = Input;
const { Option } = Select;

const getStatusTag = (status) => {
  switch (status) {
    case 'PENDING':
      return <Tag color="gray">Chờ xác nhận</Tag>;
    case 'PROCESSING':
      return <Tag color="blue">Đang xử lý</Tag>;
    case 'DELIVERING':
      return <Tag color="orange">Đang vận chuyển</Tag>;
    case 'DELIVERED':
      return <Tag color="green">Hoàn thành</Tag>;
    case 'CANCELLED':
      return <Tag color="red">Đã hủy</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const columns = (handleView, handleEdit) => [
  {
    title: '',
    dataIndex: 'checkbox',
    key: 'checkbox',
    render: () => <Checkbox />,
  },
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id',
    render: (id) => `#${id.slice(-6).toUpperCase()}`,
  },
  {
    title: 'Tên người nhận',
    dataIndex: 'fullName',
    key: 'fullName',
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Tổng số tiền',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    render: (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount),
  },
  {
    title: 'Ngày đặt hàng',
    dataIndex: 'orderDate',
    key: 'orderDate',
    sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    render: (date) => new Date(date).toLocaleDateString(),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status.localeCompare(b.status),
    render: (status) => getStatusTag(status),
  },
  {
    title: 'Thao tác',
    key: 'action',
    render: (text, record) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Tooltip title="Xem">
          <EyeOutlined style={{ color: '#1890ff' }} onClick={() => handleView(record)} />
        </Tooltip>
        <Tooltip title="Cập nhật trạng thái">
          <EditOutlined style={{ color: '#722ed1' }} onClick={() => handleEdit(record)} />
        </Tooltip>
      </div>
    ),
  },
];

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderData, setOrderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { fetchGetOrder } = useGetAllOrder();
  const { fetchUpdateOrderStatus } = useUpdateOrderStatus();
  const [spinning, setSpinning] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (page = 1, size = 10, isInitialLoad = false) => {
    try {
      setSpinning(true);
      const response = await fetchGetOrder(page, size);
      if (response) {
        setOrderData(response.content);
        setFilteredData(response.content);
        setPagination({
          current: page,
          pageSize: size,
          total: response.totalElements,
        });
        if (isInitialLoad) {
          const allOrdersResponse = await fetchGetOrder(1, response.totalElements);
          if (allOrdersResponse) {
            console.log('allOrdersResponse', allOrdersResponse.content);
            setAllOrders(allOrdersResponse.content);
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, true);
  }, []);

  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  const showDetailModal = () => {
    setIsDetailModalOpen(true);
  };

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleDetailOk = () => {
    setIsDetailModalOpen(false);
  };

  const handleDetailCancel = () => {
    setIsDetailModalOpen(false);
  };

  const handleEditOk = async () => {
    try {
      const response = await fetchUpdateOrderStatus(selectedOrder._id, selectedOrder.status);
      if (response) {
        toast.success('Cập nhật đơn hàng thành công');
        const updatedOrders = orderData.map(order =>
          order._id === selectedOrder._id ? { ...order, status: selectedOrder.status } : order
        );
        setOrderData(updatedOrders);
        setFilteredData(updatedOrders);
      } else {
        message.error('Cập nhật lỗi');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Failed to update order status');
    }
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleDetail = (order) => {
    setOrderItems(order);
    showDetailModal();
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    showEditModal();
  };

  useEffect(() => {
    if (searchTerm) {
      console.log('Searching in allOrders:', allOrders);
      const newFilteredData = allOrders.filter((item) =>
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(newFilteredData);
    } else {
      setFilteredData(orderData);
    }
  }, [searchTerm, allOrders, orderData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (order) => {
    console.log("Order details:", order);
    setOrderItems(order);
    showDetailModal();
  };

  const handleEditStatusChange = (value) => {
    setSelectedOrder({ ...selectedOrder, status: value });
  };

  return (
    <div className="order-list-container">
      <Card style={{ marginBottom: 10, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Danh sách đơn hàng</h2>
          <Search
            placeholder="Search"
            onChange={handleSearch}
            style={{ width: 300 }}
            className="custom-search-input"
          />
        </div>
      </Card>
      <Row gutter={16}>
        <Col span={24}>
          <Table
            columns={columns(handleView, handleEdit)}
            dataSource={filteredData}
            pagination={pagination}
            onChange={handleTableChange}
            rowKey="_id"
            
          />
        </Col>
      </Row>
      <Modal title={null} open={isDetailModalOpen} onOk={handleDetailOk} onCancel={handleDetailCancel} width={1000} footer={null}>
        <OrderDetail data={orderItems} />
      </Modal>
      <Modal title="Cập nhật trạng thái" open={isEditModalOpen} onOk={handleEditOk} onCancel={handleEditCancel} width={400} okText="Đồng ý"
        cancelText="Không">
        <Row gutter={16}>
          <Col span={24}>
            <Select
              value={selectedOrder ? selectedOrder.status : ''}
              onChange={handleEditStatusChange}
              style={{ width: '100%' }}
            >
              <Option value="PENDING">Chờ xác nhận</Option>
              <Option value="PROCESSING">Đang xử lý</Option>
              <Option value="DELIVERING">Đang vận chuyển</Option>
              <Option value="DELIVERED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
        </Row>
      </Modal>
      <Spin spinning={spinning} fullscreen />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default OrderList;
