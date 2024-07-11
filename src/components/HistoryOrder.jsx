import React, {useState} from 'react';
import { Card, Button, Modal, Divider, Tag, Row, Col, Typography, Image, Empty } from 'antd';
import { HeartOutlined, MessageOutlined, ShopOutlined, CheckCircleOutlined ,CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import OrderDetail from './OrderDetail';
import noDataImage from '../assets/images/cart_empty_icon.png'
import { useNavigate } from 'react-router-dom';
import { useCreateOrder, useCancelOrder } from '../utils/api';
const formatCurrency = (value) => {
  const formattedValue = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
  }).format(value);
  return formattedValue;
};
const { Text, Title } = Typography;
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const OrderHistory = ({ orders,onStatusChange }) => {
  const navigate =useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {fetchPayment} =useCreateOrder();
  const {fetchCancelOrder} =useCancelOrder();

  const [order, setOrder] = useState();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleDetail = (order)=>{
    setOrder(order)
    showModal();
  }
  const isCancelable = (orderDate) => {
    const now = dayjs();
    const orderTime = dayjs(orderDate);
    return now.diff(orderTime, 'minute') <= 15;
  };
  const paymentAgain = (orderDate) => {
    const now = dayjs();
    const orderTime = dayjs(orderDate);
    return now.diff(orderTime, 'minute') <= 30;
  };
  if (orders.length === 0) {
    return (
      <Empty
        image={noDataImage}
        imageStyle={{ height: 60 }}
        description={
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span>Chưa có sản phẩm</span>
            <Button type='default' style={{ maxWidth: 'max-content', marginTop: '10px' }} onClick={() => navigate('/books')}>
              Xem sản phẩm
            </Button>
          </div>
        }
      />
    );
  }
  const handlePayment = async (totalAmount,id)=>{
    await fetchPayment(totalAmount)
    localStorage.setItem('orderID',JSON.stringify(id))
  }
  const handleCancelOrder = async (id)=>{
    const success = await fetchCancelOrder(id)
    if (success){
      onStatusChange();
    }
  }
  return (
    <div className="list-order-scroll">
       
      {orders.map((order) => (
        <>
        <Card key={order._id} style={{ marginBottom: '10px' ,  backgroundColor: 'rgb(245, 247, 247)'
        }}>
          <Row gutter={16}>
          <Col span={24}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ marginBottom: 0 }}><span style={{ fontWeight: '700' }}>Ngày:</span> {formatDate(order.orderDate)}</p>
              {order.status === 'PENDING' ?
                <Tag color="gray">Chờ xử lí</Tag>
                : order.status === 'PROCESSING' ?
                <Tag color="blue">Đã xác nhận</Tag>
                : order.status === 'DELIVERING' ?
                <Tag color="orange">Đang vận chuyển</Tag>
                : order.status === 'DELIVERED' ?
                <Tag color="success" icon={<CheckCircleOutlined />} >Giao hàng thành công</Tag>
                : <Tag color="red">Đã hủy</Tag>
              }
            </div>
            <Divider style={{ margin: '10px 0' }} />
          </Col>
        </Row>
        {order.orderItems.map((item, index) => (
          <div key={item._id}>
            
            <Row gutter={16}>
              <Col span={4}>
                <Image width={100} src={item.book.image} />
              </Col>
              <Col span={20}>
                <Title level={4} style={{ fontWeight: '700' }}>{item.book.title}</Title>
                <Text>{item.book.description.substring(0, 97)}...</Text>
                <p style={{marginBottom:'1px'}}>Phân loại hàng: {item.book.categories.map(cat => cat.categoryName).join(', ')}</p>
                {order.paymentStatus==='NOT_PAID' ?
                  <Tag icon={<CloseCircleOutlined  />} color="gold">Chưa thanh toán</Tag>:
                  <Tag icon={<CheckCircleOutlined />} color="success">Đã thanh toán</Tag>
                }
                <Row gutter={16} style={{ marginTop: 'px' }}>
                  <Col span={12}>
                    <Text strong>Số lượng: <span style={{fontSize: '20px'}}>x{item.quantity}</span></Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Thành tiền: </Text>
                    <span style={{ color: 'red', fontSize: '20px', fontWeight: 'bold' }}>{formatCurrency(item.book.price * item.quantity)}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
            {index !== order.orderItems.length - 1 && <Divider style={{ margin: '10px 0' }} />}
          </div>
          
        ))}
        <Row gutter={16}>
          <Col span={24}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Text strong>Tổng tiền:<span style={{ color: 'red', fontSize: '20px', fontWeight: 'bold' }}>{formatCurrency(order.totalAmount)}</span> </Text>
            </div>
          </Col>
        </Row>
        <Divider style={{ margin: '10px 0' }} />
        <Row gutter={16}>
          <Col span={24}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
            <Button
              type="dashed"
              style={{ marginRight: 10,display:order.paymentStatus==='NOT_PAID' && order.paymentMethod ==='ONLINE' && paymentAgain(order.orderDate) ?'inline-block' : 'none' }}
              disabled={order.status==='CANCELLED'}
              onClick={()=> handlePayment(order.totalAmount, order._id)}
            >
              Thanh toán
            </Button>
            <Button
              type="primary"
              style={{ marginRight: 10,display:order.status==='PENDING' && isCancelable(order.orderDate)?'inline-block' : 'none' }}
              onClick={()=>handleCancelOrder(order._id)}
            >
              Hủy đơn
            </Button>
              <Button type="primary" style={{ marginRight: 10, display:order.paymentStatus==='PAID'?'inline-block' : 'none' }}>Mua Lại</Button>
              <Button type="default" onClick={() => handleDetail(order)}>Chi tiết sản phẩm</Button>
            </div>
          </Col>
          
        </Row>
      </Card>
        
      </>
      ))}
       <Modal title={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000} footer={null}> 
            <OrderDetail data={order} />
        </Modal>
        
      
    </div>
  );
};

export default OrderHistory;
