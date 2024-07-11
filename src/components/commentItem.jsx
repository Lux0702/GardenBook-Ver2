import React, { useState } from 'react';
import { Avatar, Tooltip, Button, Input, Form } from 'antd';
import { LikeOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
import avatar from "../assets/images/avatar.png";
import '../assets/css/comment.css'
const { TextArea } = Input;

const Comment = ({ comment, onReply, user }) => {
  const [replyVisible, setReplyVisible] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  // const [spinning, setSpinning] = useState(false);
  // const [newComment, setNewComment] = useState('');
  // const [comments, setComments] = useState(comment || []);
  const [textareaRows, setTextareaRows] = useState(1);
  const handleReplyClick = () => {
    setReplyVisible(!replyVisible);
  };

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      console.log('id, reply',comment.id, replyContent)
      onReply(comment.id, replyContent);
      setReplyContent('');
      setReplyVisible(false);
    }
  };

  const handleBlur = () => {
    if (!replyContent.trim()) {
      setTextareaRows(1);
      setReplyVisible(false);

    }
  };
  return (
    <div style={{ marginBottom: '10px', display: 'flex' }}>
      <Avatar src={comment.user?.avatar || avatar} alt="avatar" />
      <div style={{ marginLeft: '10px', padding: '10px', borderRadius: '10px', flex: 1 }}>
        <div style={{ fontWeight: 'bold' }}>{comment.user.fullname}</div>
        <div>{comment.comment}</div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
            <Button  icon={<MessageOutlined />} onClick={handleReplyClick} style={{ padding: 0, border:'none' }}>Trả lời</Button>
        </div>
        {replyVisible && (
          <div style={{ marginTop: '10px', marginLeft: '40px' }}>
                  <Form.Item>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={user?.avatar || avatar} alt="avatar" style={{ marginRight: '10px' }} />
                        <TextArea
                            rows={textareaRows}
                            placeholder="Nhập bình luận ở đây"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onFocus={() => setTextareaRows(5)}
                            onBlur={handleBlur}
                            style={{ flex: 1,borderRadius:20 }}
                        />
                        <Button
                            type="link"
                            icon={<SendOutlined />}
                            onClick={handleReplySubmit}
                            style={{ marginLeft: '10px' }}
                        />
                        </div>
                    </Form.Item>
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {comment.replies.map(reply => (
              <Comment key={reply.id} comment={reply} onReply={onReply}  user={user}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
