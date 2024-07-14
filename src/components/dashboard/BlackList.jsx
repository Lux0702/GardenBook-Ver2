import React, { useEffect, useState } from 'react';
import { Table, Avatar, Tag, Input, Row, Col, Card, Popconfirm, message, Spin } from 'antd';
import { MessageOutlined, HistoryOutlined  } from '@ant-design/icons';
import UserDetailCard from './UserDetailCard';
import '../../assets/css/CustomerList.css';
import { useAddBlackList, useGetBlackList, useRestoreBlackList } from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Search } = Input;

const getStatusTag = (isActive) => {
  return isActive ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngưng hoạt động</Tag>;
};

const columns = (handleConfirmStop) => [
  {
    title: '#',
    dataIndex: 'userInfo.userId',
    key: 'userInfo.userId',
    render: (text, record, index) => <span>{index + 1}</span>,
  },
  {
    title: 'Tên tài khoản',
    dataIndex: 'userInfo.fullName',
    key: 'userInfo.fullName',
    render: (text, record) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={record.userInfo.avatar} />
        <div style={{ marginLeft: 8 }}>
          <div>{record.userInfo.fullName}</div>
          <div>{record.userInfo.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Vai trò',
    dataIndex: ['userInfo', 'role'],
    key: 'userInfo.role',
    render: (text, record) => <span>{record.userInfo.role === 'Admin' ? 'Quản lý' : record.userInfo.role === 'Manager' ? 'Nhân viên' : 'Khách hàng'}</span>,
  },
  {
    title: 'Lí do',
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'userInfo.isActive',
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
          title="Xóa khỏi danh sách đen"
          description='Bạn có chắc muốn xóa khỏi danh sách'
          onConfirm={() => handleConfirmStop(record.id)}
          okText="Đồng ý"
          cancelText="Không"
          onCancel={()=> {console.log('userID',record.id)}}
        >
          <HistoryOutlined  style={{ color: 'green' }} />
        </Popconfirm>
      </div>
    ),
  },
];

const BlackList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { blacklist, fetchGetAllUser } = useGetBlackList();
  const { fetchRestoreBlackList } = useRestoreBlackList();
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(blacklist);

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

  const handleConfirmStop = async (userId) => {
    try {
      setSpinning(true);
      const success = await fetchRestoreBlackList(userId);
      if (success) {
        toast.success('Đã thêm xóa khỏi danh sách đen');
        setLoading(!loading);
      } else {
        toast.warning('lỗi xóa khỏi danh sách đen');
      }
    } catch (error) {
      message.error('Error removing user from blacklist');
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    const newFilteredData = blacklist?.filter((item) =>
      item.userInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(newFilteredData);
  }, [searchTerm, blacklist]);

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
            columns={columns(handleConfirmStop)}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
            rowKey="userInfo.userId"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' },
            })}
          />
        </Col>
        <Col span={8}>
          <UserDetailCard user={selectedUser?.userInfo} />
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

export default BlackList;
