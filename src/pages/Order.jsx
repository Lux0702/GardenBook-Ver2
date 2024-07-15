import React , {useEffect, useState} from 'react';
import { Breadcrumb, Layout, Spin, theme, Card,Button, Row, Col,Modal,Skeleton } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderComponent from '../components/OrderComponent'
import { Link } from 'react-router-dom';
import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons';
import ChooseAddress from '../components/ChooseAddress';
import { toast } from 'react-toastify';
import Select from 'react-select';
import OrderItem from '../components/OrderItem';
import { useCreateOrder } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { Content } = Layout;
const items = new Array(15).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));
const Order = () => {
  const navigate = useNavigate();
  const {fetchCreateOrder,fetchPayment}= useCreateOrder();
  const [spinning, setSpinning] = useState(false);
  const [addresses, setAddresses] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [addressesTemp, setAddressesTemp] = useState(null)
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState('0 ₫');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [orderItems, setorderItems] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleAddressSelect = (address) => {
    setAddressesTemp(address);
  };
  const handleIscheck = (check) => {
    setIsCheck(check);
  };
  const handleok = ()=>{
    if(isCheck){
      setModalOpen(false)
      setAddresses(addressesTemp)
    }else{
      return toast.info('vui lòng chọn địa chỉ giao hàng !!!');
    }
  }
  useEffect(()=>{
    const userString = localStorage.getItem('userInfo');
    if (userString) {
      const userData = JSON.parse(userString);
      const data = userData.addresses.filter(item => item.isDefault === true);
      console.log('get data storage:',data)
      setAddresses(data[0]);
    }
  },[])
  const handleGetDataOrder=(count, totalPrice, orderItems)=>{
    setSelectedItemsCount(count);
    setTotalPrice(totalPrice);
    setorderItems(orderItems)
  }
  const handleDeliveryChange = (selectedOption) => {
    setSelectedDelivery(selectedOption);
  };

  const handlePaymentMethodChange = (selectedOption) => {
    setSelectedPaymentMethod(selectedOption);
  };

  const deliveryMethod = [
    { value: 40000, label: 'Hỏa tốc' },
    { value: 10000, label: 'Giao hàng tiết kiệm' },
    { value: 30000, label: 'Giao hàng nhanh' },
    // Add more address options as needed
  ];
  const paymethodMethod = [
    { value:'ON_DELIVERY', label: 'Thanh toán khi nhận hàng' },
    { value:'ONLINE', label: 'Thanh toán trực tuyến' },
    // Add more address options as needed
  ];
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '0.5em', // Đặt giá trị này sao cho phù hợp với thiết kế của bạn
      border: state.isFocused ? '2px solid #555' : '2px solid #ced4da',
      //boxShadow: state.isFocused ? '0 0 0 0.1em rgba(0, 123, 255, 0.25)' : null,
    }),
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
const handleOrder = async()=>{
  if(!addresses){
    return toast.warning('Vui lòng nhập thông tin địa chỉ giao hàng')
  }
  if(!selectedPaymentMethod || !selectedDelivery){
    return toast.warning('Vui lòng chọn phương thức thanh toán và phương thức vận chuyển!')
  }
  const cartItems = orderItems.map((item) => item._id);
  console.log('dia chi:',addresses)
  console.log('dia chi:',cartItems)
  const orderData = {
    cartItems: cartItems,
    fullName: addresses.name,
    phone: addresses.phoneNumber,
    address: addresses.address,
    totalAmount: totalPrice,
    paymentMethod: selectedPaymentMethod?.value,
  };
  try{
    setSpinning(true);
    const success = await  fetchCreateOrder(orderData);
    if (success) {
      toast.success("Đặt hàng thành công", {
        onClose: async () => {
          if (orderData.paymentMethod === 'ONLINE') {
            await fetchPayment(orderData.totalAmount);
          } else {
            // localStorage.removeItem('cartItem');
            navigate('/profile/cart');
          }
        }
      });
    }
    
  }catch(error){
    console.log(error)
  } finally{setSpinning(false)}
  
}
  return (
    <Layout>
      <Header/>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
            fontSize: '15px',

          }}
        >
          <Breadcrumb.Item><Link to='/' style={{textDecoration:'none'}}>Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/profile/account' style={{textDecoration:'none'}}>Thông tin tài khoản</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/profile/cart' style={{textDecoration:'none'}}>Giỏ hàng</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Đặt hàng</Breadcrumb.Item>
        </Breadcrumb>
        <Card
            bordered={false}
            style={{
            width: '100%',
            marginBottom:'20px',
            }}
        >
            <div style={{ border: '1px dashed #ddd', padding: '10px', borderRadius: '5px' }}>
      <Row>
        <Col span={24}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <EnvironmentOutlined style={{ fontSize: '24px', color: 'red', marginRight: '5px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'black', margin: 0 }}>
              Địa Chỉ Nhận Hàng
            </h3>
          </div>
        </Col>
        {addresses ? 
        <Skeleton loading={!orderItems} active>
        <Col span={22}>
          <span style={{ fontWeight: 'bold' }}>{addresses?.name} </span> 
          <span style={{ marginLeft: '10px' }}>{addresses?.phoneNumber} 
            <span type="default" style={{ marginLeft: '10px', color: 'red' }}>{addresses?.isDefault===true? 'Mặc dịnh':''}</span></span>
        </Col>
        <Col span={2}>
          <Button type='link' onClick={() => setModalOpen(true)}>Thay Đổi</Button>
        </Col>
        <Col span={24}>
          <span>{addresses?.address}</span>
        </Col>
        </Skeleton>
        : 
          <>
          <Col span={22}>          
            <span> Chưa có địa chỉ vui lòng thêm địa chỉ</span>
          </Col>
          <Col span={2}>
          <Button type='link' onClick={() => setModalOpen(true)}>Thay Đổi</Button>
        </Col></>
        
        }
        
        
      </Row>
    </div>
        </Card>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <OrderComponent dataOrder={handleGetDataOrder}/>
        </div>

        <Card
            bordered={false}
            style={{
            width: '100%',
            marginBottom:'20px',
            marginTop:'20px',

            }}
              >
                  <div style={{ border: '1px dashed #ddd', padding: '10px', borderRadius: '5px' }}>
            <Row  style={{ display:'flex', justifyContent:'space-between' }}>
            <Skeleton loading={!orderItems} active>
              <Col span={10} style={{ marginLeft: '60px'}} >
              <p style={{color: 'black', fontWeight:'500',fontSize:'20px', fontStyle:"italic"}}>Phương thức thanh toán</p>
                            <Select
                              isClearable
                              onChange={handlePaymentMethodChange}
                              options={paymethodMethod}
                              value={selectedPaymentMethod ? selectedPaymentMethod : null}
                              styles={customStyles}
                              placeholder='Chọn phương thức thanh toán'

                            />
                            <p style={{color: 'black', fontWeight:'500',fontSize:'20px', fontStyle:"italic"}}>Phương thức vận chuyển</p>
                          <Select
                              isClearable
                              onChange={handleDeliveryChange}
                              options={deliveryMethod}
                              value={selectedDelivery ? selectedDelivery : null}
                              styles={customStyles}
                              placeholder='Chọn phương thức vận chuyển'
                            />
                    </Col>
                    <Col span={5} xs="6" className="mb-3" style={{textAlign:'left'}}>
                    <p style={{color: 'black', fontWeight:'500',fontSize:'20px', fontStyle:"italic"}}>Thành tiền</p>
                      <Col><p style={{color: 'black'}}>
                                        <strong>Tổng tiền hàng: <span style={{color: 'red',marginLeft:'5px'}}>{formatCurrency(totalPrice || 0)}</span></strong>
                            </p>
                      </Col>
                    <Col>
                    <p style={{color: 'black'}}>
                                      <strong>Phí vận chuyển:<span style={{color: 'red',marginLeft:'5px'}}> {selectedDelivery ? formatCurrency(selectedDelivery.value||0) : 0}</span>
                                      </strong>
                                    </p>              
                    </Col>
                    <Col>
                    <p style={{color: 'black'}} >
                        <strong>Tổng thanh toán:<span style={{fontSize:'15px', color:'red', marginLeft:'5px'}}>{formatCurrency(totalPrice + (selectedDelivery ? selectedDelivery.value : 0) || 0)}</span>
                        </strong>
                      </p>
                            
                    </Col>
                         
              </Col>
          
              </Skeleton>
              
            </Row>
          </div>
        </Card>
        <div className="cart-footer">
            <div className="left-section">
              {/* <Checkbox  style={{marginRight:'5px'}} checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)}/> */}
              <span style={{marginLeft:'20px'}}>Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <span style={{color:'red', textDecoration:'underline'}}>Điều khoản Garden Book</span></span>
            </div>
            <div className="right-section" fstyle={{fontSize:'20px'}}>
            <strong style={{fontSize:'20px'}}>Tổng thanh toán ({selectedItemsCount} Sản phẩm): {formatCurrency(totalPrice + (selectedDelivery ? selectedDelivery.value : 0) || 0)}</strong>
              <Button type='default'  style={{ marginLeft: '20px',fontSize:'15px' ,textAlign:'center', background:'#3697A6', color:'black'}} onClick={handleOrder}>Đặt Hàng</Button>
            </div>
        </div>
      </Content>
      <Footer/>
      <Modal
        title={null}
        centered
        open={modalOpen}
        onOk={handleok}
        onCancel={() => setModalOpen(false)}
        width={1000}
      >
        <ChooseAddress onAddressSelect={handleAddressSelect}  addressDefault={addresses} dataCheck={handleIscheck}/>
      </Modal>
      <Spin spinning={spinning} fullscreen style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} size="large" />

    </Layout>
  );
};
export default Order;