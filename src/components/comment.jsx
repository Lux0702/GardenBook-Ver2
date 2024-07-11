import React, { useState, useEffect } from 'react';
import { Avatar, Button, Input, Spin, Form, List } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import avatar from "../assets/images/avatar.png";
import { API_URL } from '../utils/constant';
import Comment from './commentItem'; // Import component Comment

const { TextArea } = Input;

const CommentInput = ({ comment, id, onClose ,isload}) => {
  const [userCurrent, setUserCurrent] = useState(JSON.parse(localStorage.getItem('userInfo') || 'null'));
  const [spinning, setSpinning] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(comment || []);
  const [textareaRows, setTextareaRows] = useState(1);
  const [isReply, setIsReply] = useState(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
      if (storedUser !== userCurrent) {
        setUserCurrent(storedUser);
      }
      if (storedUser) {
        clearInterval(intervalId);
      }
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [userCurrent]);

  useEffect(() => {
    if (!onClose) {
      setTextareaRows(1);
    }
  }, [onClose]);
  useEffect(() => {
    setComments(comment || []);
  }, [comment]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setSpinning(true);
  //       await fetchHistoryPost();
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setSpinning(false);
  //     }
  //   };
  //   fetchData();
  // }, [loading]);
  const handleCommentPost = async () => {
    if (!newComment.trim()) {
      return; // Nếu không có nội dung mới, không gửi bình luận
    }
    try {
      setSpinning(true);
      const userString = localStorage.getItem('token');
      const user = JSON.parse(userString);
      const token = user.accessToken;
      const response = await fetch(`${API_URL}/api/v1/posts/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: newComment,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.data]);
        setNewComment(''); 
      } else {
        console.error('Error fetching comment data:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSpinning(false);
    }
  };

  const handleReply = async (commentId, replyContent) => {
    console.log('data reply',commentId, replyContent)
    try {
      setSpinning(true);
      const userString = localStorage.getItem('token');
      const user = JSON.parse(userString);
      const token = user.accessToken;
      const response = await fetch(`${API_URL}/api/v1/posts/${id}/comment/${commentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: replyContent,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setComments(data.data.comments);
        setIsReply(!isReply)
        isload(!isReply)
      } else {
        console.error('Error fetching reply data:', data.data);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <h3>{comments.length} Bình luận</h3>
      <Form.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={userCurrent?.avatar || avatar} alt="avatar" style={{ marginRight: '10px' }} />
          <TextArea
            rows={textareaRows}
            placeholder="Nhập bình luận ở đây"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => setTextareaRows(5)}
            onBlur={() => setTextareaRows(1)}
            style={{ flex: 1, borderRadius: 20 }}
          />
          <Button
            type="link"
            icon={<SendOutlined />}
            onClick={handleCommentPost}
            style={{ marginLeft: '10px' }}
          />
        </div>
      </Form.Item>
      <Spin spinning={spinning} fullscreen />
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <List
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={(item) => <Comment key={item.id} comment={item} onReply={handleReply} user={userCurrent} />}
      />
      </div>
      
    </div>
  );
};

export default CommentInput;
