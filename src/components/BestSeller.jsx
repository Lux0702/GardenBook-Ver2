import React from 'react';
import { Card, Row, Col } from 'antd';
import '../assets/css/BestSellerList.css';
import { useNavigate } from 'react-router-dom';
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const BestSellerList = ({ bestSeller ,onStatus}) => {
  const navigate = useNavigate();
  const chunkedBestSellers = chunkArray(bestSeller.slice(0, 6), 3);
  const handleBookClick = (_id) => {
    console.log('id go',_id)
    onStatus()
    navigate(`/book-detail/${_id}`);
};
  return (
    <div style={{ backgroundColor: 'white', padding: '10px' }}>
      {chunkedBestSellers.map((chunk, rowIndex) => (
        <Row gutter={[10, 10]} key={rowIndex} style={{marginBottom:5}}>
          {chunk.map((item, colIndex) => (
            <Col key={colIndex} span={8}> {/* span=4 để mỗi hàng có 6 cột */}
              <Card hoverable className="small-card" onClick={() => handleBookClick(item._id)}>
                <div className="card-content">
                  <img alt={item.title} src={item.image} className="small-image" />
                  <Card.Meta title={item.title} className='card-title' />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ))}
    </div>
  );
};

export default BestSellerList;
