import React, { useState, useEffect } from 'react';
import OrderHistory from './HistoryOrder';
import '../assets/css/historyOrder.css'
import { useHistoryOrder } from '../utils/api';
import {Spin,Tabs, Input, Typography,Pagination} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const { TabPane } = Tabs;
const HistoryOrderList = () => {
  const [products, setProducts] = useState([]);
  const {fetchHistoryOrder} = useHistoryOrder();
  const [spinning, setSpinning]= useState(false)
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reload, setReload] = useState(false);
  const itemsPerPage = 4;
  useEffect(() => {
    const fetchProducts = async () => {
      setSpinning(true)
      const response = await fetchHistoryOrder()
      if(response){
        setProducts(response.slice().reverse());
      }
    setSpinning(false)
    };
    fetchProducts();
  }, [reload]);                                                            
  const filterOrders = (status) => {
    if (status === 'all') {
      return products;
    }
    return products.filter((order) => order.status === status);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredOrders = filterOrders(activeTab).filter((products) =>
    products.orderItems.some((item) =>
      item.book.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const paginatedOrders  = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(()=>{
    window.scrollTo(0,0)
  },[currentPage])
  const handleStateChange = ()=>{
    setReload(!reload);
  }
  return (
    <div className="order-history">
    <h2>Đơn hàng của tôi</h2>
    <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} className="custom-tabs">
      <TabPane tab="Tất cả đơn" key="all" />
      <TabPane tab="Chờ xử lý" key="PENDING" />
      <TabPane tab="Đã xác nhận" key="PROCESSING" />
      <TabPane tab="Đang vận chuyển" key="DELIVERING" />
      <TabPane tab="Đã giao" key="DELIVERED" />
      <TabPane tab="Đã hủy" key="CANCELLED" />
    </Tabs>
    <Input
      prefix={<SearchOutlined />}
      placeholder="Tìm đơn hàng theo Mã đơn hàng, Nhà bán hoặc Tên sản phẩm"
      value={searchTerm}
      onChange={handleSearch}
      style={{ margin: '10px 0', width: '100%' }}
    />
    <OrderHistory orders={paginatedOrders}  onStatusChange={handleStateChange} currentPage={currentPage}/>
    <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={filteredOrders.length}
        onChange={handlePageChange}
        style={{ textAlign: 'center', marginTop: '16px' }}
      />
    <Spin spinning={spinning} fullscreen  size="large" />

  </div>
  );
};

export default HistoryOrderList;
