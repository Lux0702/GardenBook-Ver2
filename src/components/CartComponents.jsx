import React, { useState, useEffect, useCallback } from 'react';
import { Button, Checkbox, List, Row, Col,Spin,Empty,Skeleton } from 'antd';
import CartItem from './CartItem';
import '../assets/css/cart.css';
import LazyLoad from 'react-lazyload';
import noDataImage from '../assets/images/cart_empty_icon.png'
import { useCartData } from '../utils/api';
import { json } from 'react-router-dom';
import { useDeleteCart } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const CartComponent = () => {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [isData, setIsData] = useState(false);
  const {fetchDeleteCart}=useDeleteCart();
  const {fetchCartData}= useCartData();
  const [cartItems, setCartItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState('0 ₫');
  //get data cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const tokenString = localStorage.getItem('token');
        const token = JSON.parse(tokenString);
        setSpinning(true);
        const success = await fetchCartData(token?.accessToken);
        if (success) {
          setCartItems(success.slice().reverse());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchCart()
  }, []);
  useEffect(() => {

    const selectedItems = cartItems.filter(item => item.checked);
    setSelectedItemsCount(selectedItems.length);
    const total = selectedItems.reduce((acc, item) => {
      const priceAfterDiscount = item.book?.price * (1 - item.book?.discountPercent / 100);
      return acc + item.quantity * priceAfterDiscount;
    }, 0);
    
    // const total = selectedItems.reduce((acc, item) => acc + item.quantity * parseInt(item.discountedPrice.replace('₫', '').replace(/\./g, ''), 10), 0);
    setTotalPrice(`${total.toLocaleString('vi-VN')} ₫`);
    console.log('setCartItems:',cartItems);
   }, [cartItems]);

  const handleQuantityChange = (id, value) => {
    const updatedItems = cartItems.map(item => {
      if (item._id === id) {
        return { ...item, quantity: value };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const handleRemoveItem = async(id) => {
    const updatedItems = cartItems.filter(item => item._id !== id);
    setCartItems(updatedItems);
    await fetchDeleteCart(id);
  };

  const handleCheckboxChange = (id, checked) => {
    const updatedItems = cartItems.map(item => {
      if (item._id === id) {
        return { ...item, checked };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const handleSelectAll = (checked) => {
    const updatedItems = cartItems.map(item => ({ ...item, checked }));
    setCartItems(updatedItems);
    setSelectAll(checked);
  };
  const handleCheckout = () => {
    const item = cartItems.filter(item => item.checked === true)
    console.log('item:',item);
    if (item.length === 0) {
      return toast.info('Vui lòng chọn sản phẩm cần thanh toán')
    } 
    if(selectAll){
      localStorage.setItem('cartItem',JSON.stringify(cartItems))
      navigate('/profile/order')
    }else{
      localStorage.setItem('cartItem',JSON.stringify(item))
      navigate('/profile/order')

    }
  }

  return (
    <div className="cart-container">
      <Row className="cart-header">
        <Col span={1}>
        <Checkbox checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)} />
        </Col>
        <Col span={10}>
          <strong>Sản Phẩm</strong>
        </Col>
        <Col span={2} >
          <strong>Đơn Giá</strong>
        </Col>
        <Col span={6} style={{textAlign:'center'}}>
          <strong>Số Lượng</strong>
        </Col>
        <Col span={3}>
          <strong>Số Tiền</strong>
        </Col>
        <Col span={2}>
          <strong>Thao Tác</strong>
        </Col>
      </Row>
      <List
        itemLayout="vertical"
        dataSource={cartItems}
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
          <CartItem
            key={item._id}
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
            onCheckboxChange={handleCheckboxChange}
          />
          // </LazyLoad>
        )}
      />
      <div className="cart-footer">
        <div className="left-section">
          <Checkbox  style={{marginRight:'5px'}} checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)}/>
          <Button type="default" onClick={() => handleSelectAll(true)}>Chọn Tất Cả ({selectedItemsCount})</Button>
          <Button type="default" style={{ marginLeft: '10px' }} onClick={() => handleSelectAll(false)}>Xóa</Button>
        </div>
        <div className="right-section">
        <strong>Tổng thanh toán ({selectedItemsCount} Sản phẩm): {totalPrice}</strong>
          <Button  style={{ marginLeft: '20px' }} onClick={handleCheckout}>Mua Hàng</Button>
        </div>
      </div>
      <Spin spinning={spinning} fullscreen size="large" />

    </div>
  );
};

export default CartComponent;
