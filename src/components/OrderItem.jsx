import React, {useState,useRef ,useEffect} from 'react';
import { Row, Col, Button, Input, Checkbox, Skeleton } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import '../assets/css/cartItem.css';
import { useUpdateCart } from '../utils/api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const OrderItem = ({ item}) => {

  const [imageLoaded, setImageLoaded] = useState(false);
  const {fetchUpdateCart}=useUpdateCart();
//   const handleQuantityChange = async(e) => {
//     const value = parseInt(e.target.value, 10);
//     if (value > 0) {
//       onQuantityChange(item._id, value);
//       await fetchUpdateCart(item.book._id, value);

//     }
//   };
const formatCurrency = (value) => {
    const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
    return formattedValue;
};
  return (
    <Row className="cart-item">
      <Skeleton loading={!item.book?.image} active >
      <Col span={1}>
        {/* <Checkbox checked={item.checked} onChange={(e) => onCheckboxChange(item._id, e.target.checked)} /> */}
      </Col>
      <Col span={10}>
        {item.book && (
          <>
            {/* <img
            srcSet={`${item.book?.image}?w=100 100w, ${item.book?.image}?w=200 200w, ${item.book?.image}?w=300 300w`}
            sizes="(max-width: 600px) 100px, (max-width: 1200px) 200px, 300px"
            src={`${item.book?.image}?w=300`}
            alt={item.book?.title}
            style={{ width: '100px', marginRight: '10px' }}
            ref={imgRef}
            loading='lazy'
          /> */}
              <LazyLoadImage
                src={`${item.book?.image}?w=300`}
                alt={item.book?.title}
                effect="blur"
                placeholderSrc="https://via.placeholder.com/100"
                style={{ width: '100px', marginRight: '10px' }}
                onload={()=> setImageLoaded(true)}
              />
            <span>{item.book.title}</span>

          </>
        )}
      </Col>
      <Col span={4}>
        {item.book && (
          <>
            <span style={{ textDecoration: 'line-through', color:'red' }}>{formatCurrency(item.book.price)}</span><br />
            <span>{formatCurrency(200000)}</span><br />
            <span style={{fontWeight:'700', fontSize:'14px'}}>Giảm Giá 20%</span>
          </>
        )}
      </Col>
      <Col span={6} className="quantity-col">
        <div className="quantity-control">
          {/* <Button onClick={() => handleQuantityChange({ target: { value: item.quantity - 1 } })}>-</Button> */}
          <Input 
            min={1} 
            value={item.quantity} 
            // onChange={handleQuantityChange} 
            style={{ width: '60px', textAlign: 'center' }}
            disabled={true}
          />
          {/* <Button onClick={() => handleQuantityChange({ target: { value: item.quantity + 1 } })}>+</Button> */}
        </div>
      </Col>
      <Col span={3} style={{textAlign:'right'}}>
        {item.book && (
          <span >{formatCurrency(item.quantity * item.book.price)} </span>
        )}
      </Col>
      </Skeleton>
    </Row>
  );
};

export default OrderItem;
