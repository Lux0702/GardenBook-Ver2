import React, { useState, useEffect } from 'react';
import { Row, Col, Modal,Button, Skeleton,Input, Rate  } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useReviewBook } from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { TextArea } = Input;
const OrderDetailItem = ({ item, data }) => {
  const {fetchReviewBook}=useReviewBook();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [review, setReview] = useState('');
  const [rating,setRating]= useState(0)
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async() => {
    if(!review || !rating){
        return  toast.info('Đánh giá không  thành công');
    }
    try{
        setSpinning(true)
        setLoading(true)
        const success =await fetchReviewBook(item.book._id,review,rating)
        if(success){
            setLoading(false)
            setIsModalOpen(false)
            toast.success('Đánh giá thành công')
        }else{
            setLoading(false)
            toast.warning('Đánh giá không thành công')

        }
    }catch(error){
        console.log(error)
    }finally{
        setSpinning(false)
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
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
      <Skeleton loading={!item.book?.image} active>
        <Col span={1}>
          {/* <Checkbox checked={item.checked} onChange={(e) => onCheckboxChange(item._id, e.target.checked)} /> */}
        </Col>
        <Col span={10}>
          {item.book && (
            <>
              <LazyLoadImage
                src={`${item.book.image}?w=300`}
                alt={item.book.title}
                effect="blur"
                placeholderSrc="https://via.placeholder.com/100"
                style={{ width: '100px', marginRight: '10px' }}
                onLoad={() => setImageLoaded(true)}
              />
              <span>{item.book.title}</span>
            </>
          )}
        </Col>
        <Col span={4}>
        {item.book && (
  <>
          {item.book.discountPercent > 0 ? (
            <>
              <span style={{ textDecoration: 'line-through', color: 'red' }}>
                {formatCurrency(item.book.price)}
              </span>
              <br />
              <span>
                {formatCurrency(item.book.price - (item.book.price * item.book.discountPercent / 100))}
              </span>
              <br />
            </>
          ) : (
            <span>{formatCurrency(item.book.price)}</span>
          )}
        </>
      )}
        </Col>
        <Col span={6} className="quantity-col">
          <div className="quantity-control">
            {/* <Button onClick={() => handleQuantityChange({ target: { value: item.quantity - 1 } })}>-</Button> */}
            <p style={{ width: '60px', textAlign: 'center' }}>{item.quantity}</p>
          </div>
        </Col>
        <Col span={3} style={{ textAlign: 'right' }}>
          {item.book && (
             item.book.discountPercent > 0 ? (
              <>
                <span>
                  {formatCurrency(item.quantity * (item.book.price - (item.book.price * item.book.discountPercent / 100)))}
                </span>
              </>
            ) : (
              <span>{formatCurrency(item.quantity * item.book.price)}</span>
            )
          )}
        </Col>
      </Skeleton>
        <Col span={24}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button type="primary" style={{ marginRight: 10, display: data.paymentStatus === 'PAID' ? 'inline-block' : 'none' }}>Mua Lại</Button>
            <Button type="default" onClick={showModal} style={{ marginRight: 10, display: data.paymentMethod === 'DELIVERED' ? 'inline-block' : 'none' }}>Đánh giá</Button>
          </div>
        </Col>
        <Modal title="Đánh giá sản phẩm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} confirmLoading={loading}>
            <span style={{fontWeight:'700'}}> Tên sách: </span><span>{item.book.title}</span><br/>
            <span style={{ fontWeight: '700', margin: '10px' }}>
                Đánh giá:  
                <Rate
                    allowHalf
                    value={rating}
                    defaultValue={0}
                    style={{ fontSize: '25px' }}
                    onChange={(value) => { setRating(value); console.log('rate', value); }}
                />
                </span>
                <TextArea
                    rows={4}
                    placeholder="Viết đánh giá tại đây..."
                    maxLength={300}
                    value={review}
                    onChange={(e) => { setReview(e.target.value); console.log('review', e.target.value); }}
/>


      </Modal>
    </Row>
  );
};

export default OrderDetailItem;
