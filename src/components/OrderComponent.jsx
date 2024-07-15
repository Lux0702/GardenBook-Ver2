import React, { useState, useEffect, useCallback } from 'react';
import { Button, Checkbox, List, Row, Col,Spin,Empty, Skeleton } from 'antd';
import OrderItem from './OrderItem';
import '../assets/css/cart.css';
import LazyLoad from 'react-lazyload';
import noDataImage from '../assets/images/cart_empty_icon.png'
import { useCartData } from '../utils/api';
import { json } from 'react-router-dom';
import { useDeleteCart } from '../utils/api';
import { useNavigate } from 'react-router-dom';
const OrderComponent = ({dataOrder}) => {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [isData, setIsData] = useState(false);
  const {fetchDeleteCart}=useDeleteCart();
  // const {fetchCartData}= useCartData();
  const [orderItems, setorderItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState('0 ₫');
  //get data cart
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const Items = localStorage.getItem('cartItem');
        const cartItems = JSON.parse(Items);
        setSpinning(true);
        await setorderItems(cartItems);
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchOrder()
  }, []);
  useEffect(() => {

    setSelectedItemsCount(orderItems?.length);
    const total = orderItems.reduce((acc, item) => {
      const priceAfterDiscount = item.book?.price * (1 - item.book?.discountPercent / 100);
      return acc + item.quantity * priceAfterDiscount;
    }, 0);
    

    // const total = selectedItems.reduce((acc, item) => acc + item.quantity * parseInt(item.discountedPrice.replace('₫', '').replace(/\./g, ''), 10), 0);
    setTotalPrice(`${total?.toLocaleString('vi-VN')} ₫`);
    dataOrder(orderItems?.length,total,orderItems)
   }, [orderItems]);

  const handleQuantityChange = (id, value) => {
    const updatedItems = orderItems.map(item => {
      if (item._id === id) {
        return { ...item, quantity: value };
      }
      return item;
    });
    setorderItems(updatedItems);
  };

  const handleRemoveItem = async(id) => {
    const updatedItems = orderItems.filter(item => item._id !== id);
    setorderItems(updatedItems);
    await fetchDeleteCart(id);
  };

  const handleCheckboxChange = (id, checked) => {
    const updatedItems = orderItems.map(item => {
      if (item._id === id) {
        return { ...item, checked };
      }
      return item;
    });
    setorderItems(updatedItems);
  };

  const handleSelectAll = (checked) => {
    const updatedItems = orderItems.map(item => ({ ...item, checked }));
    setorderItems(updatedItems);
    setSelectAll(checked);
  };

  return (
    <div className="cart-container">
      <Skeleton loading={!orderItems} active>
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
          dataSource={orderItems}
          locale={{
            emptyText: (
              <Empty
                image={noDataImage}
                imageStyle={{ height: 60 }}
                description={<div style={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                <span>Chưa có sản phẩm</span>
                <Button  type='default' style={{maxWidth:'max-content', marginTop: '10px'}} onClick={()=> navigate('/books')}>Xem sản phẩm</Button>
                
                </div>}
              />
            ),
          }}
          renderItem={item => (
            // <LazyLoad height={100} offset={100}>
            <OrderItem
              key={item._id}
              item={item}
            />
            // </LazyLoad>
          )}
        />
      </Skeleton>
      <Spin spinning={spinning} fullscreen style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} size="large" />

    </div>
  );
};

export default OrderComponent;
