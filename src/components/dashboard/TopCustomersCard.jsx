import React from 'react';
import { Card, List, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const topCustomers = [
  {
    userId: "6576a86029cdd5a2837c4ee8",
    fullName: "Nguyễn Thanh Sang",
    email: "20110710@student.hcmute.edu.vn",
    avatar: "https://res.cloudinary.com/dfwwu6ft4/image/upload/v1719922991/efvfxga0ptzhpz0begys.jpg",
    orderCount: 34
  },
  {
    userId: "65759b0e2104e2ea006433c8",
    fullName: "Lê Anh Kiệt",
    email: "lakln16021@gmail.com",
    avatar: "https://res.cloudinary.com/dfwwu6ft4/image/upload/v1715099952/ebztwqojusy2qdmcm3ct.jpg",
    orderCount: 24
  },
  {
    userId: "6583f07a3b0a5864fe22ee57",
    fullName: "Nguyễn Thị Thơm",
    email: "test@gmail.com",
    avatar: "https://res.cloudinary.com/dfwwu6ft4/image/upload/v1703608716/hz10emlmri8jihrsq6sv.webp",
    orderCount: 18
  },
  {
    userId: "65745e75f2ad49eab7ed7d30",
    fullName: "Lê Anh Kiệt",
    email: "admin123@gmail.com",
    avatar: "https://res.cloudinary.com/dfwwu6ft4/image/upload/v1703332283/rdi7mtnues7z5wiguop3.jpg",
    orderCount: 16
  },
  {
    userId: "65948fa1782e31286e34ad57",
    fullName: "Lê Ánh Sao",
    email: "akmtk01@gmail.com",
    avatar: "https://res.cloudinary.com/dfwwu6ft4/image/upload/v1704236377/lhryv3imhrnjv2qldsyd.jpg",
    orderCount: 12
  }
];

const TopCustomersCard = () => (
    <div style={{marginTop:10}}>
    
  <Card  
      title={
        <div >
          <span style={{ fontWeight: '700', fontSize: 20 }}>
           Top 5 khách hàng thân thiết
          </span>
        </div>
      } >
    <List
      itemLayout="horizontal"
      dataSource={topCustomers}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} icon={!item.avatar && <UserOutlined />} />}
            title={item.fullName}
            description={`Số lần mua: ${item.orderCount}`}
          />
        </List.Item>
      )}
    />
  </Card></div>
);

export default TopCustomersCard;
