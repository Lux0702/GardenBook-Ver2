import React, { useState, useEffect } from 'react';
import '../assets/css/post.css';
import logobrand from "../assets/images/brand.png";
import { AudioOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Input, Space, Dropdown, Avatar, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import avatar from "../assets/images/avatar.png";
import { API_URL } from "../utils/constant";

const { Search } = Input;

const HeaderPost = ({ collapsed, setCollapsed }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUser, setAvatar] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFullName("");
    setUserRole("");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("user");
    navigate('/post/my-post');
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const items = [
    {
      key: '1',
      label: (
        <Link to="/post/account" style={{ textDecoration: 'none', fontSize: 'larger', margin: "auto" }}>
          Tài khoản
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link to="/post/my-post" onClick={handleLogout} style={{ textDecoration: 'none', fontSize: 'larger', margin: "auto" }}>
          Logout
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const userinfor = JSON.parse(localStorage.getItem("user"));
    const user = JSON.parse(userString);
    if (user) {
      const token = user.accessToken;
      setIsLoggedIn(true);
      setFullName(userinfor.fullName ? userinfor.fullName : " ");
      setUserRole(userinfor.role);
      setAvatar(userinfor.avatar);

      const fetchProfileData = async () => {
        try {
          const response = await fetch(`${API_URL}/user/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            localStorage.setItem('user', JSON.stringify(user.data));
            setUserProfile(user.data);
            headerhandle();
          } else {
            console.error('Error fetching profile data:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
      fetchProfileData();
    }
  }, []);

  const headerhandle = () => {
    const userInfoString = localStorage.getItem("user");
    if (userProfile) {
      const userInfo = JSON.parse(userInfoString);
      setIsLoggedIn(true);
      setFullName(userProfile.fullName || userInfo.fullName);
      setUserRole(userProfile.role || userInfo.role);
      setAvatar(userProfile.avatar || userInfo.avatar);
    }
  };

  useEffect(() => {
    headerhandle();
  }, [userProfile]);

  return (
    <div className='post-header'>
      <div>
        <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              <img src={logobrand} alt="Logo " />
      </div>
     
      <div className='header-control'>
        <Space direction="vertical">
          <Search
            placeholder="Tìm kiếm ..."
            onSearch={onSearch}
            style={{
              width: 200,
            }}
          />
        </Space>
        {isLoggedIn ? (
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
            arrow={{
              pointAtCenter: true,
            }}
          >
            <span className='post-button-login'>
              <Avatar size="large" src={avatarUser} />
              {fullName}
            </span>
          </Dropdown>
        ) : (
          <span className='post-button-login'>
            <Avatar size="large" src={avatar} />
            <Link to="/post/login">Login/Register</Link>
          </span>
        )}
      </div>
    </div>
  );
};

export default HeaderPost;
