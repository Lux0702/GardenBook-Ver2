import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Badge, Image, Upload, Modal, Spin, Divider, Typography, Form, Input, Select } from 'antd';
import { UserOutlined, CommentOutlined, RightOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDataPost, useCreatePost } from '../utils/api';
import "../assets/css/post.css";
import avatar_img from '../assets/images/avatar.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommentInput from '../components/comment';

const { Meta } = Card;
const { Text, Paragraph } = Typography;
const { Option } = Select;

const PostList = () => {
  const [form] = Form.useForm();
  const { dataPost, fetchPosts } = useDataPost();
  const { fetchCreatePost } = useCreatePost();
  const [commentPost, setCommentPost] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [postVisibility, setPostVisibility] = useState({});
  const [fileList, setFileList] = useState([]);
  const [postValues, setPostValues] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo') || 'null'));
  const [rejected_FE, setRejected_FE] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
      if (storedUser !== user) {
        setUser(storedUser);
      }
      if (storedUser) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchPosts();
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, [loading]);

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

  useEffect(() => {
    if (selectedPost) {
      setCommentPost(dataPost.find((item) => item.id === selectedPost.id));
    }
  }, [selectedPost, dataPost]);

  const handleCommentClick = (post) => {
    setSelectedPost(post);
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
    try {
      setLoading(true);
      setPostValues(values);
      console.log('values', values);
      if (fileList.length > 0) {
        const image = fileList[0]?.originFileObj;
        console.log('image url,', image);
        await handleSubmit(image);
      } else {
        await submitPost(values);
      }
    } catch (error) {
      console.log("lỗi kết nối");
      setLoading(false);
    }
  };

  const submitPost = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('bookId', values.bookId);
      formData.append('rejected_FE', rejected_FE);
      if (fileList.length > 0) {
        formData.append('image', fileList[0]?.originFileObj);
      }
      console.log("formData", formData);
      const success = await fetchCreatePost(formData);
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
      console.log("lỗi kết nối sai");
      setLoading(false);
    }
  };

  const handleSubmit = async (image) => {
    const formData = new FormData();
    formData.append('media', image);
    formData.append('workflow', 'wfl_gE5EBpgnMkUx5gUtx170J');
    formData.append('api_user', '1182660997');
    formData.append('api_secret', 'PF9hTPxGkTQB6Lvw4rhwPkiviNb3fEre');

    try {
      const response = await axios.post(
        'https://api.sightengine.com/1.0/check-workflow.json',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      handleImageModerationComplete(response.data);
    } catch (error) {
      toast.error('Không thể kiểm tra ảnh. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleImageModerationComplete = async (result) => {
    if (result && result.someConditionToCheckIfImageIsValid) {
      console.log('result', result);
      setRejected_FE(false);
      await submitPost(postValues);
    } else {
      setRejected_FE(true);
      await submitPost(postValues);
      setLoading(false);
    }
  };

  const handleChange = (reply) => {
    setLoading(reply);
  };

  const handleImageChange = ({ file, fileList }) => {
    setFileList(fileList);
  };

  const handleCancelCreateModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
    setFileList([]);
    setPostValues(null);
  };

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Avatar src={user ? user.avatar : avatar_img} size={64} />
        <div style={{ marginLeft: 20, border: '1px solid #d9d9d9', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ marginRight: 10 }}>{user ? `${user.fullName} ơi,bạn đang nghĩ gì thế?` : 'Đăng nhập để thảo luận'}</Text>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreatePost}>
            Đăng bài
          </Button>
        </div>
      </div>
      {dataPost.map((post, index) => (
        <React.Fragment key={index}>
          <Card
            className="mb-2"
            actions={[
              <Button type="link" icon={<RightOutlined />} onClick={() => navigate(`/book-detail/${post.book.id}`)} disabled={!post.book?.id}>
                Xem sản phẩm
              </Button>,
              <Button type="link" icon={<CommentOutlined />} onClick={() => handleCommentClick(post)}>
                Bình luận
              </Button>
            ]}
          >
            <Meta
              avatar={<Avatar src={post.postedBy.avatar || <UserOutlined />} />}
              title={
                <div>
                  <strong>{post.postedBy.fullname}</strong>
                </div>
              }
              description={<div style={{ fontWeight: '700', fontStyle: 'italic', fontSize: 15, color: 'black' }}>
                Tựa đề: {post.title}
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
        <CommentInput comment={commentPost ? commentPost.comments : null} id={selectedPost?.id} onload={handleChange} />
        <Divider />
      </Modal>

      <Modal
        title="Đăng bài mới"
        open={isCreateModalOpen}
        onCancel={handleCancelCreateModal}
        footer={null}
      >
        <Form form={form} onFinish={handleCreatePostSubmit}>
          <Form.Item
            name="bookId"
            label="Chọn sách"
          >
            <Select placeholder="Chọn sách" defaultValue="">
              <Option value="">Không chọn sách</Option>
              {dataPost.map((post) => (
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
          <Form.Item
            name="image"
            label="Hình ảnh"
          >
            <Upload
              name="image"
              listType="picture"
              fileList={fileList}
              onChange={handleImageChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="dashed" htmlType="submit" loading={loading}>
              Đăng bài
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

export default PostList;
