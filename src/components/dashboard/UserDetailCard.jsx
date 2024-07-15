import React from 'react';
import { Card, Avatar, Badge ,Tag} from 'antd';
import { MailOutlined, PhoneOutlined, CalendarOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../../assets/css/UserDetailCard.css'; 
import avatar from '../../assets/images/avatar.png'; 
const UserDetailCard = ({ user }) => {
  return (
    <>
        {user ?
        <Card className="user-detail-card">
      <div className="user-header">
       <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar size={64} src={user ? user.avatar : ''} />
        <div style={{ marginLeft: 5 }}>
              <h2>{user ? user.fullName : 'Chọn tài khoản để xem chi tiết'}</h2>
            <p>{user ? user.role==='Admin' ? 
             <Tag color='red'>Quản lý</Tag> 
            : user.role==='Customer'?
            <Tag color='green'>Khách hàng</Tag> : 
            <Tag color='orange'>Nhân viên</Tag>  : ''}</p>


        </div>
      </div>
      </div>
      
      {user && (
        <div className="user-contact">
          <div className="user-contact-item">
            <MailOutlined />
            <span>Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="user-contact-item">
            <PhoneOutlined />
            <span>Số điện thoại:</span>
            <span>{user.phone}</span>
          </div>
          <div className="user-contact-item">
            <CalendarOutlined />
            <span>Ngày sinh:</span>
            <span>{moment(user.birthday).format('DD-MM-YYYY')}</span>
          </div>
          <div className="user-contact-item">
            <UserOutlined />
            <span>Giới tính:</span>
            <span>{user.gender==='Female'? 'Nữ':'Nam' || 'Not specified'}</span>
            {user.addresses && user.addresses.length > 0 && (
              <p><HomeOutlined /> Địa chỉ: {user.addresses[0].address}</p>
            )}
          </div>
          
        </div>
      )}
      {user && (
        <div className="user-stats">
          <div>
            {/* <h3>{user.points}</h3>
            <span>Điểm</span> */}
          </div>
        </div>
      )}
    </Card> : 
    <Card className="user-detail-card">
      <div className="user-header">
       <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar size={64} src={avatar} />
        <div style={{ marginLeft: 5 }}>
              <h2 style={{fontFamily:'Arial', fontSize:'20px'}}>{ 'Chọn tài khoản để xem chi tiết'}</h2>
        </div>
      </div>
      </div>
      
      {user && (
        <div className="user-contact">
          <div className="user-contact-item">
            <MailOutlined />
            <span>Email:</span>
          </div>
          <div className="user-contact-item">
            <PhoneOutlined />
            <span>Số điện thoại:</span>
          </div>
          <div className="user-contact-item">
            <CalendarOutlined />
            <span>Ngày sinh:</span>
          </div>
          <div className="user-contact-item">
            <UserOutlined />
            <span>Giới tính:</span>
          </div>
        </div>
      )}
      {user && (
        <div className="user-stats">
          <div>
            <h3>0</h3>
            <span>Điểm</span>
          </div>
        </div>
      )}
    </Card>}
    </>
    
  );
};

export default UserDetailCard;
