import React, { useEffect, useState } from 'react';
import { Table, Avatar, Tag, Input, Row, Col, Card, Popconfirm, message, Spin, Modal, Button, Form, Select } from 'antd';
import { MessageOutlined, StopOutlined, PlusOutlined } from '@ant-design/icons';
import UserDetailCard from './UserDetailCard';
import '../../assets/css/CustomerList.css';
import { useGetAllUser, useAddBlackList, useRegisterManager } from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Search } = Input;
const { Option } = Select;

const getStatusTag = (isActive) => {
  return isActive ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngưng hoạt động</Tag>;
};

const columns = (onStopClick, handleConfirmStop) => [
  {
    title: '#',
    dataIndex: 'userId',
    key: 'userId',
    render: (text, record, index) => <span>{index + 1}</span>,
  },
  {
    title: 'Tên tài khoản',
    dataIndex: 'fullName',
    key: 'fullName',
    render: (text, record) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={record.avatar} />
        <div style={{ marginLeft: 8 }}>
          <div>{text}</div>
          <div>{record.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Vai trò',
    dataIndex: 'role',
    key: 'role',
    render: (role) => <span>{role === 'Admin' ? 'Quản lý' : role === 'Customer' ? 'Khách hàng' : 'Nhân viên'}</span>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (isActive) => getStatusTag(isActive),
  },
  {
    title: 'Thao tác',
    key: 'actions',
    render: (text, record) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <MessageOutlined style={{ color: '#1890ff' }} />
        <Popconfirm
          title="Thêm vào danh sách đen"
          description={
            <div>
              <p>Lí do thêm vào danh sách?</p>
              <Input
                onChange={(e) => onStopClick(record.userId, e.target.value)}
                placeholder="Nhập lý do"
              />
            </div>
          }
          onConfirm={() => handleConfirmStop(record.userId)}
          okText="Đồng ý"
          cancelText="Không"
        >
          <StopOutlined style={{ color: 'red' }} />
        </Popconfirm>
      </div>
    ),
  },
];

const ManageUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [reason, setReason] = useState({});
  const { allUser, fetchGetAllUser } = useGetAllUser();
  const { fetchAddBlackList } = useAddBlackList();
  const { fetchRegisterManager } = useRegisterManager();
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(allUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchGetAllUser();
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, [loading]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = (value) => {
    setSearchTerm(value);
  };

  const handleRowClick = (record) => {
    setSelectedUser(record);
  };

  const handleStopClick = (userId, reason) => {
    setReason((prev) => ({ ...prev, [userId]: reason }));
  };

  const handleConfirmStop = async (userId) => {
    if(!reason[userId]){
        return toast.info('Vui lòng nhập lý do');
    }
    try {
      setSpinning(true);
      const success = await fetchAddBlackList(userId, reason[userId]);
      if (success) {
        toast.success('Đã thêm vào danh sách đen');
        setLoading(!loading);
      } else {
        toast.warning('Thêm vào danh sách đen lỗi');
      }
    } catch (error) {
      message.error('Error adding user to blacklist');
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    const employee = allUser.filter((item) => item.role !== 'Customer');
    const newFilteredData = employee.filter((item) =>
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredData(newFilteredData);
  }, [searchTerm, allUser]);

  const handleAddUser = async (values) => {
    try {
      setSpinning(true);
      setLoading(true);
      const success = await fetchRegisterManager(values);
      if (success) {
        toast.success('Thêm tài khoản thành công');
        setLoading(!loading);
        setIsModalOpen(false);
      } else {
        toast.warning('Thêm tài khoản thất bại');
        setLoading(false);

      }
    } catch (error) {
      message.error('Error adding user');
    } finally {
      setSpinning(false);
    }
  };

  const openAddUserModal = () => {
    setIsModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="customer-list-container">
      <Card style={{ marginBottom: 10, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Danh sách tài khoản</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <Search
              placeholder="Search"
              onSearch={handleSearchClick}
              onChange={handleSearch}
              style={{ width: 300 }}
              className="custom-search-input"
            />
            
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddUserModal} style={{background:'#3697A6'}}>
              Thêm tài khoản
            </Button>
      </Card>
      <Row gutter={16}>
        <Col span={16}>
          <Table
            columns={columns(handleStopClick, handleConfirmStop)}
            dataSource={filteredData}
            pagination={{ pageSize: 5, showSizeChanger: false }} // Ẩn phần 10/page
            rowKey="userId"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' },
            })}
          />
        </Col>
        <Col span={8}>
          <UserDetailCard user={selectedUser} />
        </Col>
      </Row>
      <Spin spinning={spinning} fullscreen size="large" />
      <Modal
        title="Thêm tài khoản mới"
        open={isModalOpen}
        onCancel={closeAddUserModal}
        footer={null}
        style={{padding:0}}

      >
        <Form
          onFinish={handleAddUser}
          labelCol={{ span: 8, textAlign:'left' }}
          wrapperCol={{ span: 16 }}

        >
          <Form.Item
            name="fullName"
            label="Tên tài khoản"
            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="passWord"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassWord"
            label="Nhập lại mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>
          {/* <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Option value="Admin">Quản lý</Option>
              <Option value="Employee">Nhân viên</Option>
            </Select>
          </Form.Item> */}
          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ textAlign: 'center' }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm tài khoản
            </Button>
          </Form.Item>
        </Form>
      </Modal>
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

export default ManageUser;
