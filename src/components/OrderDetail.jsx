import React, { useState, useEffect, useCallback } from 'react';
import { Button, Checkbox, List, Row, Col,Spin,Empty, Skeleton } from 'antd';
import OrderDetailItem from './OrderDetailItem';
import '../assets/css/cart.css';
import LazyLoad from 'react-lazyload';
import noDataImage from '../assets/images/cart_empty_icon.png'
import { useCartData } from '../utils/api';
import { json } from 'react-router-dom';
import { useDeleteCart } from '../utils/api';
import { useNavigate } from 'react-router-dom';
const OrderDetail = ({data}) => {

  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
//   const {data} = props;
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState('0 ₫');
  //get data cart
console.log('Data:',data)
  useEffect(() => {
    setTotalPrice(data.totalAmount)
  }, [data]);
  



  return (
    <div className="cart-container" style={{marginTop:'10px'}}>
      <Skeleton loading={!data} active>
        <Row className="cart-header">
          <Col span={1}>
          {/* <Checkbox checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)} /> */}
          </Col>
          <Col span={10}>
            <strong>Sản Phẩm</strong>
          </Col>
          <Col span={4} >
            <strong>Đơn Giá</strong>
          </Col>
          <Col span={6} style={{textAlign:'center'}}>
            <strong>Số Lượng</strong>
          </Col>
          <Col span={3} style={{textAlign:'right'}}>
            <strong >Thành Tiền</strong>
          </Col>
        </Row>
        <List
          itemLayout="vertical"
          dataSource={data.orderItems}
          locale={{
            emptyText: (
              <Empty
                image={noDataImage}
                imageStyle={{ height: 60 }}
                description={<div style={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                <span>Chưa đơn hàng</span>
                <Button  type='default' style={{maxWidth:'max-content', marginTop: '10px'}} onClick={()=> navigate('/books')}>Xem sản phẩm</Button>
                
                </div>}
              />
            ),
          }}
          renderItem={item => (
            <OrderDetailItem
              key={item._id}
              item={item}
              data={data}
            />
          )}
        />
        
      </Skeleton>
      <Spin spinning={spinning} fullscreen style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} size="large" />

    </div>
  );
};

export default OrderDetail;
