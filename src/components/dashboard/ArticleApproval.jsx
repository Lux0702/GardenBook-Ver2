import React, { useState, useEffect } from 'react';
import { Table, Tag, Input, Row, Col, Card, Tooltip, Checkbox, Modal, Spin, Select, message, Image } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useGetAllPost, useChangeStatusPost } from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import viVN from 'antd/es/locale/vi_VN';

dayjs.locale('vi');
const { Search } = Input;
const { Option } = Select;

const getStatusTag = (status) => {
  switch (status) {
    case 'Pending':
      return <Tag color="gray">Chờ xác nhận</Tag>;
    case 'Approved':
      return <Tag color="blue">Đã duyệt</Tag>;
    case 'Rejected':
      return <Tag color="red">Đã từ chối</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};
const formatDate = (postedDate) => {
    try {
      const date = dayjs(postedDate);
      return date.format('DD/MM/YYYY');
    } catch (error) {
      console.error('Invalid date:', postedDate);
      return 'Invalid date';
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
    title: 'Tiêu đề',
    dataIndex: 'title',
    key: 'title',
    sorter: (a, b) => a.title.localeCompare(b.title),
  },
  {
    title: 'Người đăng',
    dataIndex: 'postedBy',
    key: 'postedBy',
    render: (postedBy) => postedBy?.fullname,
  },
  {
    title: 'Ngày đăng',
    dataIndex: 'postedDate',
    key: 'postedDate',
    render: (postedDate) =>formatDate(postedDate),
    sorter: (a, b) => new Date(a.postedDate) - new Date(b.postedDate),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status) => getStatusTag(status),
    sorter: (a, b) => a.status.localeCompare(b.status),
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

const ArticleApproval = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { allPost, fetchAllPost } = useGetAllPost();
  const [filteredData, setFilteredData] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { fetchChangeStatusPost } = useChangeStatusPost();
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchAllPost();
        setSpinning(false);
      } catch (error) {
        console.log(error);
      } finally {
        // setSpinning(false);
      }
    };
    fetchData();
  }, []);

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
      const response = await fetchChangeStatusPost(selectedPost.id, selectedPost.status);
      if (response) {
        toast.success('Cập nhật bài viết thành công');
        const updatedPosts = allPost.map(post =>
          post.id === selectedPost.id ? { ...post, status: selectedPost.status } : post
        );
        setFilteredData(updatedPosts);
      } else {
        message.error('Cập nhật lỗi');
      }
    } catch (error) {
      console.error('Error updating post status:', error);
      message.error('Failed to update post status');
    }
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleDetail = (post) => {
    setSelectedPost(post);
    showDetailModal();
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    showEditModal();
  };

  useEffect(() => {
    const newFilteredData = allPost.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.postedBy.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(newFilteredData);
  }, [searchTerm, allPost]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (post) => {
    console.log("Post details:", post);
    setSelectedPost(post);
    showDetailModal();
  };

  const handleEditStatusChange = (value) => {
    setSelectedPost({ ...selectedPost, status: value });
  };

  return (
    <div className="post-list-container">
      <Card style={{ marginBottom: 10, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Danh sách bài viết</h2>
          <Search
            placeholder="Search"
            onChange={handleSearch}
            style={{ width: 300 }}
            className="custom-search-input"
          />
        </div>
      </Card>
      <Row gutter={16}>
        <Col span={16}>
          <Table
            columns={columns(handleView, handleEdit)}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => handleDetail(record),
              style: { cursor: 'pointer' },
            })}
          />
        </Col>
        <Col span={8}>
          <Card title="Chi tiết bài viết" bordered={false}>
            {selectedPost ? (
              <div>
                <h3>{selectedPost.title}</h3>
                {selectedPost.book && (
                  <div style={{display:'flex', justifyItems:'space-between'}}>
                    <Image src={selectedPost.book.image} alt={selectedPost.book.title} style={{ width: '100%', maxWidth: '150px', marginBottom: '10px' }} />
                    <h4>{selectedPost.book.title}</h4>
                  </div>
                )}
                <p>{selectedPost.content}</p>
                <p><strong>Người đăng:</strong> {selectedPost.postedBy.fullname}</p>
                <p><strong>Ngày đăng:</strong> {formatDate(selectedPost.postedDate)}</p>
              </div>
            ) : (
              <p>Chọn bài viết để xem chi tiết</p>
            )}
          </Card>
        </Col>
      </Row>
      <Modal title="Cập nhật trạng thái" open={isEditModalOpen} onOk={handleEditOk} onCancel={handleEditCancel} width={400} okText="Đồng ý" cancelText="Không">
        <Row gutter={16}>
          <Col span={24}>
            <Select
              value={selectedPost ? selectedPost.status : ''}
              onChange={handleEditStatusChange}
              style={{ width: '100%' }}
            >
              <Option value="Pending">Chờ xác nhận</Option>
              <Option value="Approved">Đã duyệt</Option>
              <Option value="Rejected">Đã từ chối</Option>
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

export default ArticleApproval;
