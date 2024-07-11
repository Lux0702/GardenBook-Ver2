import React from 'react';
import { Card, List, Avatar } from 'antd';
import { StarOutlined, ShopFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../assets/css/topbook.css';

const CardBooks = ({ books, isBook }) => {
  const navigate = useNavigate();

  const handleBookClick = (id) => {
    navigate(`/book-detail/${id}`);
  };

  return (
    <Card 
      title={
        <div >
          <span style={{ fontWeight: '700', fontSize: 20 }}>
            {isBook === 'rating' ? 'Top đánh giá' : 'Top sách bán chạy'}
          </span>
        </div>
      } 
      extra={isBook === 'rating' ? <StarOutlined /> : <ShopFilled />} 
      style={{ marginTop: 10 }}
      className='ant'
    >
      <List
        itemLayout="horizontal"
        dataSource={books}
        renderItem={book => (
          <List.Item onClick={() => handleBookClick(book._id)} className="book-item"> 
            <List.Item.Meta
              avatar={<Avatar src={book.image} shape='square' size={40} />}
              title={book.title.length > 20 ? book.title.substring(0, 50) : book.title}
              description={book.authors.slice(0, 3).map(author => author.authorName).join(', ')}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CardBooks;
