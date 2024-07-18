import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../assets/css/header.css";
import "../assets/css/login.css";
import Logo from "../assets/images/logo-home.png";
import iconSearch from "../assets/icons/search.svg";
import ic_account from "../assets/icons/account.svg";
import ic_cart from "../assets/icons/cart.svg";
import rectangle from "../assets/icons/Rectangle.svg";
import { FaBell, FaForumbee } from "react-icons/fa";
import {Dropdown, Button, Modal, Spin, Popover,List, Badge,Input } from 'antd';
import { UserOutlined, LogoutOutlined ,BellOutlined, DeleteOutlined ,BookOutlined,ShoppingCartOutlined,HistoryOutlined , EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';
import ic_delete from '../assets/icons/x.png';
import logo from "../assets/images/logo-home.png"
import google from "../assets/icons/flat-color-icons_google.svg"
import { useLoginGoogle, useProfile, useLogin, useLogout, useRegister,useSendOTP ,useSearchList,useCheckOut,useSaveSearch, useDeleteSearch} from "../utils/api";
import { ToastContainer, collapseToast, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../utils/constant";
import '../assets/css/notifications.css';
import BestSellerList from "./BestSeller";

const Header = () => {
  const [paymentHandled, setPaymentHandled] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const {token, fetchTokenGoogle}= useLoginGoogle()
  const {userData, fetchProfileData}= useProfile()
  const {searchList, fetchSearchList}= useSearchList()
  const [listSearch, setListSearch] = useState([]);
  const {flagLogin, fetchLogin}= useLogin()
  const {flagOTP, fetchSendOTP}= useSendOTP()
  const {fetchLogout}= useLogout()
  const {fetchDeleteSearch}= useDeleteSearch()
  const {fetchSaveSearch}= useSaveSearch()
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const {fetchCheckOut}= useCheckOut()
  const {flagRegister,fetchRegister}= useRegister()
  const [spinning, setSpinning] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState('');
  const [passWord, setPassword] = useState('');
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassWord, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({}); // State để lưu thông báo lỗi
  const [bestSeller, setBestSeller] = useState([]);
  const [suggestList, setSuggestList] = useState([]);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(() => {
    const userInfoString = localStorage.getItem('userInfo');
    return userInfoString ? JSON.parse(userInfoString) : null;
  });
  const bookStorage = JSON.parse(localStorage.getItem('books') || '[]');
  const [tokenFromStorage, setTokenInfo] = useState(() => {
    const tokenInfoString = localStorage.getItem('token');
    return tokenInfoString ? JSON.parse(tokenInfoString) : null;
  });
  // const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalRegister, setIsModalRegister] = useState(false);
  const [isModalForgot, setIsModalForgot] = useState(false);
  const [isLoginGoogle, setIsLoginGoogle] = useState(false);
  const [isTokenFetched, setIsTokenFetched] = useState(false);
  const {search} = useLocation();
  const codeTemp = new URLSearchParams(search).get('code');
  const responseCode = new URLSearchParams(search).get('vnp_ResponseCode');
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [reload, setReload] = useState(false)
  //popover
  const content = (
    <div>
        <List
        itemLayout="horizontal"
        style={{width:'400px' ,whiteSpace:'normal'}}
        dataSource={notifications.slice(0,4)}
        renderItem={(item) => (
          <List.Item className={`notification-item ${item.read ? 'read' : 'unread'}`} style={{width:'95%'}}
            onClick={() => handleNotificationClick(item.url)}>
            <List.Item.Meta
              title={item.title}
              description={
                <div>
                  <p>{item.message}</p>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Button type="link" style={{fontWeight:'700'}} onClick={()=> navigate('/profile/notification')}>Xem tất cả</Button>
      </div>
    </div>
    
  );
  const handleNotificationClick = (item)=>{
    window.location.href=item;
  }
  useEffect(() =>{
    const token = JSON.parse(localStorage.getItem('token') || '""'); 
    const user = JSON.parse(localStorage.getItem('userInfo') || '""'); 

    if (!token || !user ) {
      console.error('Token hoặc UserId không tồn tại.');
      return;
    }

    fetch(`${API_URL}/api/v1/notifications`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token.accessToken,
      },
    })
      .then(response => response.json())
      .then(data => {
        setNotifications(
          (data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  },[isLoggedIn])
  // console.log('now:', currentPath);
    // Update userInfo and tokenInfo when localStorage changes
    const handleStorageChange = () => {
      const updatedUserInfoString = localStorage.getItem('userInfo');
      const updatedTokenInfoString = localStorage.getItem('token');
      
      setUserInfo(updatedUserInfoString ? JSON.parse(updatedUserInfoString) : null);
      setTokenInfo(updatedTokenInfoString ? JSON.parse(updatedTokenInfoString) : null);
    };
    useEffect(() => {
      const orderIDString = localStorage.getItem('orderID')
      const orderID = JSON.parse(orderIDString)
      const fetchCheckOutPayment = async() => {
        try{
          console.log("orderID,responseCode",orderID,responseCode)
          const success = await fetchCheckOut(orderID,responseCode)
          if (success){
            localStorage.removeItem('orderID');
            toast.success('Thanh toán thành công');
          }else{
            toast.error('Thanh toán thất bại');
          }
        }catch(error){
          console.log(error); 
          toast.error('Thanh toán thất bại');

        }
      }
      if (responseCode && orderID) {
        console.log(`vnp_ResponseCode is: ${responseCode}`);
          fetchCheckOutPayment();
          setPaymentHandled(true);

      }
    }, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(()=>{
    if(currentPath ==='/login'  && isLoggedIn===false){
      setOpen(true)
    }else{
      if(tokenFromStorage){
        setIsLoggedIn(true)
      }
    }
    if (currentPath==='/register'){
      setIsModalRegister(true)
    }
  },[isLoggedIn,currentPath])
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleFocus = () => {
    // setDropdownVisible(true);
  };

  const handleBlur = () => {
    // setDropdownVisible(false);
  };
  const handleSearchSubmit = async(e) => {
    if (e) e.preventDefault();
    const currentPath = window.location.pathname;
    const targetPath = currentPath === '/profile/wishList' ? `/profile/wishList?search=${searchTerm}` : `/books?search=${searchTerm}`;
    navigate(targetPath);
    searchInputRef.current.blur();
    const success = await fetchSaveSearch(searchTerm)
    if(success){
      setReload(!reload)
    }
  };

  const handleSearchHistory = async (searchkey) => {
    const currentPath = window.location.pathname;
    const targetPath = currentPath === '/profile/wishList' ? `/profile/wishList?search=${searchkey}` : `/books?search=${searchkey}`;
    navigate(targetPath);
    searchInputRef.current.blur();
    const success = await fetchSaveSearch(searchkey)
    if(success){
      setReload(!reload)
    }
  };
  useEffect(() => {
    if( tokenFromStorage){
      setIsLoggedIn(true);
      setUserProfile(userInfo);

    }
  }, [tokenFromStorage,userInfo]);
  useEffect(() => {
    if (!codeTemp) {
      setIsLoginGoogle(false);
      localStorage.removeItem('isLoginGoogle');
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token') || '""');
      const books = localStorage.getItem('books');
      const bestSeller = localStorage.getItem('bestSeller');
      await fetchLogout(token);
      setIsLoggedIn(false);
      setUserProfile('');
      setIsLoginGoogle(false);
      setUserInfo('');
      setTokenInfo('');
      localStorage.clear();

    if (books) {
      localStorage.setItem('books', books);
    }
    if (bestSeller) {
      localStorage.setItem('bestSeller', bestSeller);
    }


    } catch (error) {
      console.log(error);
    } 
  }, [fetchLogout]);

  const items = [
    
    {
      key: '1',
      icon: <UserOutlined />,
      label: (
        <><Link to="/profile/account" className="link">Thông tin cá nhân</Link></>
      ),
    },
    {
      key: '2',
      icon: <ShoppingCartOutlined />,
      label: (
        <Link to="/profile/order-history" className="link">Đơn hàng</Link>
      ),
    },
    {
      key: '3',
      icon:<BookOutlined />,
      label: (
        <><Link to="/profile/wishList" className="link">Danh sách yêu thích</Link></>
      ),
    },
    {
      key: '4',
      icon: <LogoutOutlined  />,
      label: (
        <span onClick={handleLogout}>
        Đăng xuất
      </span>
      ),
    },
  ];
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const searchValue = searchInputRef.current.value;
      setSearchTerm(searchValue);
      handleSearchSubmit();
      setDropdownVisible(false)
      

    }
  };
  const handleDeleteText = ()=> {
    setSearchTerm("");
    searchInputRef.current.focus()
  }
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 200);
  };
  const handleCancel = () => {
    setCurrentPath('')
    setOpen(false);
    setPassword('');
    setUsername('');
    setErrors({})
  };
  const handleCancelRegister = () => {
    setIsModalRegister(false);
    setPassword('');
    setFullName('');
    setEmail('');
    setPhone('');
    setErrors({});
    setConfirmPassword('');
    setErrors({})
    setOpen(true)
  };
  const showModal = () => {
    setOpen(true);
  };  

  const handleShowRegister = async () => {
    setIsModalRegister(true)
    
  };
  const handleShowForgotPassword = async () => {
    setIsModalForgot(true)
    
  };
  const handleCancelForgot = async () => {
    setIsModalForgot(false)
    setEmail('');
    setOpen(true)
  };
  const handleLogin = async () => {
    if (validateFormLogin()){
      setErrors({})
      try{ 
          setOpen(false);
          setSpinning(true)
          const success = await fetchLogin(username, passWord);
          console.log('success là:',success)
        if (success === true) {
          handleCancel();
          handleStorageChange()
          setIsLoggedIn(true);
        } else {
          setOpen(true);
        }
      } catch(error){
        console.log('Login google failed')
        toast.error('Lỗi kết nối')
        setOpen(true);
      }finally{
        setSpinning(false);
    
      }
 
    }
  }
  const handleLoginGoogle = async()=> {
    try{ 
      window.location.href = `${API_URL}/api/v1/auth/loginGoogle`;
    } catch(error){
      console.log('Login google failed')
      toast.error('Lỗi kết nối')
    }finally{
      setIsLoginGoogle(true)
      localStorage.setItem('isLoginGoogle',JSON.stringify(true))
    }
  
  };
  useEffect(() => {
    const checkLoginGoogle = async () => {
      try {
        console.log('code= ',codeTemp);
        const dataString = localStorage.getItem('isLoginGoogle');
        const data = JSON.parse(dataString);
        if (data) {
          setIsLoginGoogle(data);
        }
        console.log("is login google:", data);
        if (isLoginGoogle  && codeTemp) {
          setSpinning(true);
          const success=await fetchTokenGoogle(codeTemp);
          if(success){
            setIsTokenFetched(true);
            setIsLoggedIn(true);
          }
          
        }
        else{
          setSpinning(false)
        }
      } catch (error) {
        console.log('Login google failed:', error);
      }
    };

    checkLoginGoogle();
  }, [isLoginGoogle, isTokenFetched, codeTemp]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("is token google:", token?.accessToken);
      console.log("is token login:", tokenFromStorage?.accessToken);
      try {
        const accessToken = isTokenFetched ? token?.accessToken : (isLoggedIn ? tokenFromStorage?.accessToken : null);
  
        if (accessToken) {
          await Promise.all([
            fetchProfileData(accessToken),
            fetchSearchList(accessToken)
          ]);
        }
      } catch (error) {
        console.log('get profile failed:', error);
      } finally {
        setSpinning(false);
      }
    };
  
    fetchData();
  }, [isTokenFetched, token, isLoggedIn, tokenFromStorage, reload]);
  useEffect(()=>{
    const bookString = JSON.parse(localStorage.getItem('bestSeller') || '[]');
    if (bookString) {
      setBestSeller(bookString);
    }

  },[spinning])
  const hanldeRemoveSearch = async(item)=> {
    try{
      const success =await fetchDeleteSearch(item)
      if (success){
        setReload(!reload)
        searchInputRef.current.focus()

      }
    }catch(error){
      console.log('delete search failed:', error)
    }
  }
  useEffect(() => {
    const filteredList = bookStorage.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const updateSuggest =[
      {
        label: (
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      <HistoryOutlined className="dropdown-icon" style={{ marginRight: 5, marginLeft:0 }} />

            Gợi ý sách
          </span>
        ),
        key: 'title',
        type: 'group'
      },
      {
        label: (<div style={{backgroundColor:'white'}}>
          <BestSellerList bestSeller={filteredList}  onStatus={handleStatus}/>
        </div>),
        key: 'bestseller-list',
        type: 'group',
      },
    ]
    setSuggestList(updateSuggest);
  }, [searchTerm, bookStorage]);
  const handleStatus = () => {
    setDropdownVisible(!dropdownVisible)
    setSearchTerm('')
  }
  useEffect(() => {
    const mappedSearchList = searchList?.map((item, index) => ({
      label: (
        <div className="dropdown-item" key={index} >
          <span onClick = {() => { setSearchTerm(item); handleSearchHistory(item);} }>{item}</span>
          <DeleteOutlined className="dropdown-icon" style={{ marginRight: 0 }}  onClick={()=> hanldeRemoveSearch(item)}/>
        </div>
      ),
      key: index.toString(),
    })) || []; 

    const updatedListSearch = [
      {
        label: (
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      <HistoryOutlined className="dropdown-icon" style={{ marginRight: 5, marginLeft:0 }} />

            Lịch sử tìm kiếm
          </span>
        ),
        key: 'title',
        type: 'group'
      },
      ...mappedSearchList,
      {
        type: 'divider',
        key: 'divider',
      },
      {
        label: (
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Sách nổi bật
          </span>
        ),
        key: 'suggestion',
        type: 'group'
      },
      {
        label: (<div style={{backgroundColor:'white'}}>
          <BestSellerList bestSeller={bestSeller} onStatus={handleStatus}/>
        </div>),
        key: 'bestseller-list',
        type: 'group',
      },
    ];

    setListSearch(updatedListSearch);
  }, [searchList]);

  const validateFormLogin = () => {
    // Kiểm tra các trường dữ liệu và cập nhật thông báo lỗi
    const newErrors = {};

  
    if (!username.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/\S+@\S+\.\S+/.test(username)) {
      newErrors.email = "Email sai định dạng.";
    }
  
    if (!passWord.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    }else if (passWord.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    }
    setErrors(newErrors);
  
    // Kiểm tra xem có lỗi hay không
    return Object.keys(newErrors).length === 0;
  };
  const validateForm = () => {
    // Kiểm tra các trường dữ liệu và cập nhật thông báo lỗi
    const newErrors = {};
  
    if (!fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập tên đầy đủ.";
    }
  
    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    }
  
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email sai định dạng.";
    }
  
    if (!passWord.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    }else if (passWord.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    }
  
    if (!confirmPassWord.trim()) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu.";
    } else if (passWord.trim() !== confirmPassWord.trim()) {
      newErrors.confirmPassword = "Mật khẩu không khớp.";
    }
  
    setErrors(newErrors);
  
    // Kiểm tra xem có lỗi hay không
    return Object.keys(newErrors).length === 0;
  };
  const validateFormEmail = () => {
    // Kiểm tra các trường dữ liệu và cập nhật thông báo lỗi
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email sai định dạng.";
    }
    setErrors(newErrors);
  
    // Kiểm tra xem có lỗi hay không
    return Object.keys(newErrors).length === 0;
  };
  const hanldeRegister = async()=>{
    if(validateForm()){
      try{
        setIsModalRegister(false)
        setSpinning(true)
        const success= await fetchRegister(fullName,passWord,email,phone,confirmPassWord)
        if(success){
          setIsModalRegister(false);
          setPassword('');
          setFullName('');
          setEmail('');
          setPhone('');
          setErrors({});
          setConfirmPassword('');
          setErrors({})
          let secondsToGo = 5;
          const instance = modal.success({
            title: 'Thông báo',
            content: `OTP đã được gửi đến Email.Vui lòng kiểm tra. Thông báo sẽ đóng sau ${secondsToGo} giây.`,
            className: 'custom-modal'
          });
          const timer = setInterval(() => {
            secondsToGo -= 1;
            instance.update({
              content: `OTP đã được gửi đến Email.Vui lòng kiểm tra. Thông báo sẽ đóng sau ${secondsToGo} giây.`,
            });
          }, 1000);
          setTimeout(() => {
            clearInterval(timer);
            instance.destroy();
          }, secondsToGo * 1000);
        }
        else{
          setIsModalRegister(true)
        }
      }catch(error){
        console.log(error)
      }finally{
        
        setSpinning(false)

      }
    }
  }
  const handleSendOTP = async()=> {
    const url = 'send-forgot-password-otp'
    if(validateFormEmail()){
       try{
        setIsModalForgot(false)
        setSpinning(true)
        const success= await fetchSendOTP(email,url)
        if(success){
          setIsModalForgot(false)
          setEmail('');
          let secondsToGo = 5;
          const instance = modal.success({
            title: 'Thông báo',
            content: `OTP đã được gửi đến Email.Vui lòng kiểm tra. Thông báo sẽ đóng sau ${secondsToGo} giây.`,
            className: 'custom-modal'
          });
          const timer = setInterval(() => {
            secondsToGo -= 1;
            instance.update({
              content: `OTP đã được gửi đến Email.Vui lòng kiểm tra. Thông báo sẽ đóng sau ${secondsToGo} giây.`,
            });
          }, 1000);
          setTimeout(() => {
            clearInterval(timer);
            instance.destroy();
          }, secondsToGo * 1000);
        }
        else{
          setIsModalForgot(true)
        }
      }catch(error){
        console.log(error)
      }finally{
        setSpinning(false)
      }
    }
   
  }
  return (
    <header className={`header-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header">
        <div className="header-column">
          <Link to="/">
            <img className="header-img-home" src={Logo} alt="Logo" />
          </Link>
        </div>
        <div className="header-column1">
          <Dropdown menu={{items: searchTerm.trim().length>0 ? suggestList:  listSearch}} trigger={['click']} placement="bottomLeft" arrow open={dropdownVisible}
      onOpenChange={(flag) => setDropdownVisible(flag)} >
            <div className="search-container">
              <input
                type="text"
                className="search-input col-12"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                ref={searchInputRef}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyPress}
                
              />
              <img  className="searchDelete-icon" src={ic_delete} alt="delete" style={{height:'10px',width:'10px', display:searchTerm? 'block': 'none'}} onClick={handleDeleteText}/>
              <span className="search-icon" onClick={handleSearchSubmit}>
                <img src={iconSearch} alt="search" />
              </span>
            </div>
          </Dropdown>
        </div>
        <div className="header-column2">
          <strong className="access-tab-item">
            <Link to="/post" style={{ textDecoration: "none", marginRight: "30px" }}>
              <FaForumbee  style={{marginRight: '3px'}}/> Diễn đàn
            </Link>
          </strong>
          <div className="div-access-tab">
            {isLoggedIn ? (
              <Dropdown menu={{items}} placement="bottomLeft" arrow>
                <Link >
                    <img src={ic_account} alt="" style={{ width: "20px", height: "20px" }} />
                    {userProfile && userProfile.fullName ? userProfile.fullName : userData && userData.fullName ? userData.fullName : 'Tài khoản'}
                    <img className="img-space " src={rectangle} alt=""  style={{marginLeft: '7px'}}/> 
                </Link>
              </Dropdown>
            ) : (
              <div className="access-tab-item">
                <Link onClick={showModal} ><img src={ic_account} alt="" />Đăng nhập
                <img className="img-space" src={rectangle} alt="" /></Link>
              </div>
            )}
            <div className="access-tab-item">
              <Link to="/profile/cart">
                <img src={ic_cart} alt="" />
                Giỏ hàng
                <img className="img-space" src={rectangle} alt="" />
              </Link>
            </div>
            <div className="access-tab-item">
                <Popover content={content} title={
                  <>
                  <span style={{fontSize:'15px', fontWeight:'700'}}>Thông báo</span>
                  </>
                } trigger={['hover', 'click']} 
                placement="bottomRight"
                titleMinWidth={300}
                overlayStyle={{ maxHeight: '200px', maxWidth: '400px', overflowY: 'auto' ,whiteSpace:'normal'}}>
                  
                  <Link className="custom-notification-link">
                    <Badge count={notifications?.length} overflowCount={99} size="small" offset={[-7, 0]} >
                      <BellOutlined style={{ marginRight: '2px', fontSize: '20px' ,color: 'white'}} />
                    </Badge>
                    Thông báo</Link> 
                  
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        // onOk={handleOk}
        onCancel={handleCancel}
        centered={true}
        className="custom-modal"
        footer={null}

        >
        <div className='login'>
          <img className="login-img" src={logo} alt='logo' />
          <div >

            <h2>Đăng nhập</h2>
            <form>
              <label>
                Tên đăng nhập:
                <Input
                style={{
                  width: 410,
                  padding: '8px ! important',
                  marginBottom: 10,
                  boxSizing: 'border-box',
                  borderRadius: 20,
                  border: '1px solid #4e4e4ecc',
                  paddingLeft: 15,
                  color: 'black',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                }}
                  type="email"
                  id="email"
                  name="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập email"
                />
                {errors.email && <p className="error-message" style={{color:"red", marginBottom:'0px'}}>{errors.email}</p>}
              </label>
              <label>
                Mật khẩu:
                <Input.Password
                style={{
                  width: 410,
                  marginBottom: 10,
                  boxSizing: 'border-box',
                  borderRadius: 20,
                  border: '1px solid #4e4e4ecc',
                  paddingLeft: 15,
                  color: 'black',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  paddingBottom:0,
                }}
                  type="password"
                  name="password"
                  id="password"
                  value={passWord}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
              />
                {errors.password && <p className="error-message" style={{color:"red"}}>{errors.password}</p>}
              </label>
              <a href='#'  onClick={()=> {handleCancel() ;handleShowForgotPassword();}}>
                Quên mật khẩu ?<br />
              </a>
              <a href='#'  onClick={() => {handleCancel();handleShowRegister(); }}>
                Nếu bạn chưa có tài khoản. <strong>Đăng ký ngay !!!</strong><br />
              </a>
              
              <button type="button" onClick={ () => { handleLogin();}}>
                Đăng nhập
              </button>
              <div style={{ textAlign: 'center', fontSize: '13px', color: 'black', margin: '5px' }}> hoặc tiếp tục với</div>
              <div className='login-more' onClick={handleLoginGoogle}>
                <div className='login icon-container'>
                  <img src={google} alt="" />
                </div>
                {/* <div className='login icon-container'>
                  <img src={facebook} alt="" />
                </div> */}
              </div>
            </form>
          </div>
      </div>
      </Modal>
      <Modal
        open={isModalRegister}
        // onOk={handleOk}
        onCancel={handleCancelRegister}
        centered={true}
        className="custom-modal"
        footer={null}
        styles={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
        <div className='login'>
          <img className="login-img" src={logo} alt='logo' style={{top: '22.5%'}} />
          <div >

            <h2>Đăng ký</h2>
            <form>
              <label>
                Họ và tên:
                <input
                  type="text"
                  id='username'
                  name='username'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName && <p className="error-message" style={{color:"red"}}>{errors.fullName}</p>}

              </label>
              <label>
                Số điện thoại:
                <input
                  type="text"
                  id='phone'
                  name='phone'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && <p className="error-message" style={{color:"red"}}>{errors.phone}</p>}
              </label>
              <label>
                Email:
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                />
                {errors.email && <p className="error-message" style={{color:"red"}}>{errors.email}</p>}
              </label>
              <label>
                Mật khẩu:
                <input
                  type="password"
                  id ='passwprrd'
                  name='password'
                  value={passWord}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                /> 
            {errors.password && <p className="error-message" style={{color:"red"}}>{errors.password}</p>}

              </label>
              <label>
                Nhập lại mật khẩu:
                <input
                  type="password"
                  id="confirmPassWord"
                  name="confirmPassWord"
                  value={confirmPassWord}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                /> 
            {errors.confirmPassword && <p className="error-message" style={{color:"red"}}>{errors.confirmPassword}</p>}

              </label>
              <button type="button" onClick={hanldeRegister} >
                Đăng ký tài khoản
              </button>
            
            </form>
          </div>
      </div>
      </Modal>
      <Modal
        open={isModalForgot}
        // onOk={handleOk}
        onCancel={handleCancelForgot}
        centered={true}
        className="custom-modal"
        footer={null}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
        <div className='login'>
          <img className="login-img" src={logo} alt='logo' style={{top: '65%'}} />
          <div >

            <h2>Quên mât khẩu</h2>
            <form>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                />
                {errors.email && <p className="error-message" style={{color:"red"}}>{errors.email}</p>}
              </label>
              <button type="button"  onClick={handleSendOTP}>
                Xác nhận
              </button>
            
            </form>
          </div>
      </div>
      </Modal>
      <Modal
        open={isModalForgot}
        // onOk={handleOk}
        onCancel={handleCancelForgot}
        centered={true}
        className="custom-modal"
        footer={null}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
        <div className='login'>
          <img className="login-img" src={logo} alt='logo' style={{top: '65%'}} />
          <div >

            <h2>Quên mật khẩu</h2>
            <form>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                />
                {errors.email && <p className="error-message" style={{color:"red"}}>{errors.email}</p>}
              </label>
              <button type="button"  onClick={handleSendOTP}>
                Xác nhận
              </button>
            
            </form>
          </div>
      </div>
      </Modal>
      {contextHolder}
      <Spin spinning={spinning} fullscreen  size="large" />
      <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"/>
    </header>
    
  );
};

export default Header;
