import React, { useCallback, useEffect, useState } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme,Spin ,Card} from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, Link, useLocation, Carousel } from 'react-router-dom';
import PostList from '../components/PostList';
import ChangePassWord from '../components/ChangePassWord';
import AddressManager from '../components/AddressManager';
import NotificationList from '../components/Notification';
import HistoryOrderList from '../components/HistoryListOrder';
import TopBooks from '../components/TopBooks'; // Import TopBooks component
import '../assets/css/post.css';
import background from '../assets/images/backGroundLogo.png';
import BookCarousel from '../components/suggestCarousel';
import { useRecommendBook } from '../utils/api';
import MyPost from '../components/managerUserPost';
const { Content, Sider } = Layout;



const Post = () => {
  const {recommendBook,fetchRecommendBook} =useRecommendBook();
  const [selectedComponent, setSelectedComponent] = useState(<PostList />);
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(['1']);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState(['0']);
  const [ratingBook, setRatingBook] = useState([]);
  const [suggestBook, setSuggestBook] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo') || 'null'));

  const [ books, setBooks] = useState(()=>{
    const bookString = localStorage.getItem('books')
    return bookString? JSON.parse(bookString) : null;
  });
  const items = [
    {
      key: '1',
      label: 'Thảo luận',
      component: PostList,
      path: '/post'
    },
    {
      key: '2',
      label: 'Bài viết của tôi',
      component: MyPost,
      path: '/profile/my-post'
    },
  ];
  
  const generateMenuItems = (items) => {
    return items.map(item => {
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        component: item.component,
        path: item.path
      };
    });
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    const { keyPath } = e;
    const selectedItem = keyPath.length === 2 ? 
      items.find(item => item.key === keyPath[1]).children.find(child => child.key === keyPath[0]) :
      items.find(item => item.key === keyPath[0]);

    setSelectedComponent(React.createElement(selectedItem.component));
    navigate(selectedItem.path); 
  };
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
      
      const fetchRecommendData = async () => {
        try {
          await fetchRecommendBook();
        } catch (error) {
          console.log(error);
        } finally {
        }
      };

      fetchRecommendData();
      if (storedUser) {
        clearInterval(intervalId);
      }
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [user]);
  const updateMenuSelection = useCallback(() => {
    const pathMap = {
      '/post': { openKey: '0', selectedKey: '1' },
      '/profile/my-post': { openKey: '1', selectedKey: '2' },
      // Add more mappings as needed
    };
    const currentPath = location.pathname;
    const defaultKeys = pathMap[currentPath] || { openKey: '0', selectedKey: '1' };
    setDefaultOpenKeys([defaultKeys.openKey]);
    setDefaultSelectedKeys([defaultKeys.selectedKey]);

    // Update selectedComponent based on the current path
    const selectedItem = items.find(item => item.path === currentPath) || items.find(item => item.children?.find(child => child.path === currentPath));
    if (selectedItem) {
      const childItem = selectedItem.children?.find(child => child.path === currentPath);
      setSelectedComponent(React.createElement(childItem ? childItem.component : selectedItem.component));
    }
  }, [location.pathname]);
  useEffect(()=>{
    const topBooks = books.sort((a, b) => b.soldQuantity - a.soldQuantity).slice(0, 5);
    const suggestBook = books.sort(() => Math.random() - 0.5);
    setRatingBook(topBooks);
    setSuggestBook(suggestBook.slice(0, 5));
  },[books])
  useEffect(() => {
    updateMenuSelection();
  }, [updateMenuSelection]);

  return (
    <Layout className='user-account'>
      <Header />
      <Content
        className="user-account-content"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 48px',
          minHeight: 'calc(100vh - 200px)', // Ensure minimum height for vertical centering
          backgroundImage:`url(${background})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div style={{ width: '80%' }}>
          <Breadcrumb
            style={{
              margin: '16px 0',
              fontSize: '15px',
            }}
          >
            {/* <Breadcrumb.Item>
              <Link to="/" className='link'>Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Thông tin tài khoản</Breadcrumb.Item> */}
          </Breadcrumb>
          <Layout
            style={{
              padding: '24px 0',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Sider
              style={{
                background: colorBgContainer,
              }}
              width={240}
            >
              <Menu
                mode="inline"
                selectedKeys={defaultSelectedKeys}
                openKeys={defaultOpenKeys}
                style={{
                  height: 'max-content',
                }}
                items={generateMenuItems(items)}
                onClick={handleMenuClick}
                onOpenChange={(openKeys) => setDefaultOpenKeys(openKeys)}
              />
              <Card
                title={
                  <div>
                    <span style={{ fontWeight: '700', fontSize: 20 }}>
                      Sách dành cho bạn
                    </span>
                  </div>
                } 
                style={{
                  marginTop: 16,
                }}
              >
                <BookCarousel books={recommendBook} />
              </Card>

            </Sider>

            <Content
              style={{
                padding: '0 24px',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '24px',
                minHeight: 'calc(100vh - 200px)',
                background:'rgb(245, 247, 247)'
              }}
            >
              <div style={{ flex: 2 }}>
                {selectedComponent}
              </div>
              <div style={{ flex: 1 }}>
                <TopBooks books={ratingBook} isBook={'rating'}/>
                <TopBooks books={suggestBook} isBook={'suggest'}/>

              </div>
            </Content>
          </Layout>
        </div>
      </Content>
      <Footer />
      <Spin spinning={spinning} fullscreen/>
    </Layout>
  );
};

export default Post;
