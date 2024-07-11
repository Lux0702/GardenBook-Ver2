import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Badge, Image, Modal, Spin, Divider, Typography, Form, Input, Select } from 'antd';
import { UserOutlined, CommentOutlined, RightOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHistoryPost, useCreatePost, useEditPost } from '../utils/api';
import "../assets/css/post.css";
import avatar_img from '../assets/images/avatar.png';
import { toast } from 'react-toastify';
import CommentInput from '../components/comment';

const { Meta } = Card;
const { Text, Paragraph } = Typography;
const { Option } = Select;

const MyList = () => {
  const { historyPost, fetchHistoryPost } = useHistoryPost();
  const { fetchCreatePost } = useCreatePost();
  const { fetchEditPost } = useEditPost();

  const [commentPost, setCommentPost] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [postVisibility, setPostVisibility] = useState({});
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo') || 'null'));
  const [editForm] = Form.useForm();
  const currentPath = window.location
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
      if (storedUser !== user) {
        setUser(storedUser);
      }
      if (storedUser) {
        clearInterval(intervalId);
      }
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchHistoryPost();
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, [loading]);
  useEffect(() => {
    if (selectedPost) {
      setCommentPost(historyPost.find((item) => item.id === selectedPost.id));
    }
  }, [selectedPost, historyPost]);
  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
  };

  const toggleContent = (postId) => {
    setPostVisibility((prevVisibility) => ({
      ...prevVisibility,
      [postId]: !prevVisibility[postId],
    }));
  };

  const handleCommentClick = (post) => {
    setSelectedPost(post);
    // setCommentPost(historyPost.find((item) => item.id === post.id));
    setIsUserModalOpen(true);
  };

  const handleCreatePost = () => {
    if (user === null) {
      return toast.info('Vui lòng đăng nhập !');
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handleCreatePostSubmit = async (values) => {
    console.log('add post:', values);
    try {
      setLoading(true);
      const success = await fetchCreatePost(values);
      if (success) {
        setLoading(false);
        setIsCreateModalOpen(false);
        toast.success("Đăng bài thành công. Vui lòng đợi duyệt!");
        setTimeout(() => navigate('/profile/my-post'), 1000);
      } else {
        setLoading(false);
        toast.warning("Đăng bài Lỗi. Vui lòng thử lại");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    editForm.setFieldsValue({
      bookId: post.book?.id || '',
      title: post.title,
      content: post.content
    });
    setIsEditModalOpen(true);
  };

  const handleEditPostSubmit = async (values) => {
    try {
      setLoading(true);
      const success = await fetchEditPost(values,selectedPost.id);
      if (success) {
        setLoading(false);
        setIsCreateModalOpen(false);
        toast.success("Đăng bài thành công. Vui lòng đợi duyệt!");
      } else {
        setLoading(false);
        toast.warning(success.message ||"Sửa bài lỗi. Vui lòng thử lại");
      }
    } catch (error) {
      console.log(error);
    }
  };
useEffect(()=>{
    window.scrollTo(0,0);
},[currentPath])
const handleChange = (reply) => {
  setLoading(reply)
}
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Avatar src={user ? user.avatar : avatar_img} size={64} />
        <div style={{ marginLeft: 20, border: '1px solid #d9d9d9', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ marginRight: 10 }}>{user ? `${user.fullName} ơi, bạn đang nghĩ gì thế?` : 'Đăng nhập để thảo luận'}</Text>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreatePost}>
            Đăng bài
          </Button>
        </div>
      </div>
      {historyPost.map((post, index) => (
        <React.Fragment key={index}>
          <Card
            className="mb-2"
            actions={[
              <Button type="link" icon={<RightOutlined />} onClick={() => navigate(`/book-detail/${post.book.id}`)}
              disabled={!post.book?.id}>
                Xem sản phẩm
              </Button>,
              <Button type="link" icon={<CommentOutlined />} onClick={() => handleCommentClick(post)}>
                Bình luận
              </Button>,
              <Button type="link" icon={<EditOutlined />} onClick={() => handleEditPost(post)} 
              disabled={post.status !== 'Pending'}
              >
                Chỉnh sửa
              </Button>
              
            ]}
          >
            <Meta
              avatar={<Avatar src={post.postedBy.avatar || <UserOutlined />} />}
              title={
                <div>
                  <strong style={{ fontSize: 15 }}>{post.postedBy.fullname}</strong>
                  <Badge status={post.status === 'Pending' ? 'processing' :
                    post.status === 'Approved' ? 'success' :
                      'error'}
                    text={post.status === 'Pending' ? 'Chờ duyệt' :
                      post.status === 'Approved' ? 'Đã duyệt' :
                        'Không được duyệt'
                    } style={{ marginLeft: '10px' }} />
                </div>
              }
              description={<div style={{ fontWeight: '700', fontStyle: 'italic', fontSize: 20, color: 'black' }}>
                {post.title}
              </div>}
            />
            <Divider style={{ margin: 5 }} />
            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
              {post.content}
            </Paragraph>
            <div style={{ textAlign: 'center' }}>
              <Image
                src={post.book?.image}
                style={{ maxHeight: '200px', maxWidth: '190px' }}
                alt={post.book?.title}
              />
            </div>
          </Card>
          <Divider style={{ margin: 10 }} />
        </React.Fragment>
      ))}
      <Spin spinning={spinning} fullscreen />

      <Modal
        open={isUserModalOpen}
        onCancel={() => setIsUserModalOpen(false)}
        footer={null}
      >
        <CommentInput comment={commentPost ? commentPost.comments : null} id={selectedPost?.id} isload={handleChange}  />
        <Divider />
      </Modal>

      <Modal
        title="Đăng bài mới"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
      >
        <Form onFinish={handleCreatePostSubmit}>
          <Form.Item
            name="bookId"
            label="Chọn sách"
          >
            <Select placeholder="Chọn sách" defaultValue="">
              <Option value="">Không chọn sách</Option>
              {historyPost.map((post) => (
                <Option key={post.book?.id} value={post.book?.id}>
                  {post.book?.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="Tựa đề"
            rules={[{ required: true, message: 'Vui lòng nhập tựa đề!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="dashed" htmlType="submit" loading={loading}  >
              Đăng bài
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa bài viết"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEditPostSubmit}>
          <Form.Item
            name="bookId"
            label="Chọn sách"
          >
            <Select placeholder="Chọn sách" defaultValue="">
              <Option value="">Không chọn sách</Option>
              {historyPost.map((post) => (
                <Option key={post.book?.id} value={post.book?.id}>
                  {post.book?.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="Tựa đề"
            rules={[{ required: true, message: 'Vui lòng nhập tựa đề!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="dashed" htmlType="submit" loading={loading}  >
              Chỉnh sửa
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyList;
