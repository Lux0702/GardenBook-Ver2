import React, { useEffect, useState } from 'react';
import { Table, Avatar, Tag, Input, Row, Col, Card, Popconfirm, message, Spin } from 'antd';
import { MessageOutlined, StopOutlined } from '@ant-design/icons';
import UserDetailCard from './UserDetailCard';
import '../../assets/css/CustomerList.css';
import { useGetAllUser, useAddBlackList } from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Search } = Input;

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

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [reason, setReason] = useState({});
  const { allUser, fetchGetAllUser } = useGetAllUser();
  const { fetchAddBlackList } = useAddBlackList();
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(allUser);

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
        toast.warning('Thêm vào  danh sách đen lỗi');
      }
    } catch (error) {
      message.error('Error adding user to blacklist');
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    const temp = allUser.filter((item) => item.role ==='Customer')
    const newFilteredData = temp.filter((item) =>
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredData(newFilteredData);
  }, [searchTerm, allUser]);

  return (
    <div className="customer-list-container">
      <Card style={{ marginBottom: 10, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Danh sách tài khoản</h2>
          <Search
            placeholder="Search"
            onSearch={handleSearchClick}
            onChange={handleSearch}
            style={{ width: 300 }}
            className="custom-search-input"
          />
        </div>
      </Card>
      <Row gutter={16}>
        <Col span={16}>
          <Table
            columns={columns(handleStopClick, handleConfirmStop)}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
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

export default CustomerList;
