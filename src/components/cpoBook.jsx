import React, { useEffect,useState } from 'react';
import "../assets/css/cpoBook.css";
import wish from "../assets/icons/wish.svg";
import { useNavigate } from 'react-router-dom';
import wished from "../assets/icons/wished.png";
import { Spin, Rate,Skeleton,Button, Modal,Input } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import icon_buy from "../assets/icons/Icon_buy.svg";
import icon_buy1 from "../assets/icons/Icon_buy1.svg";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useAddToWishList, useAddToCart } from '../utils/api';

function loadImage(source) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = source;
      img.onload = () => resolve();
    });
  }
const Book = (props) => {
    const { image, title, author, price, _id,wish_icon  } = props;
    const navigate = useNavigate();
    const [isWished, setIsWished] = useState(false);
    const [iconWish, setIsIconWish] = useState(wish);
    const [spinning, setSpinning] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const {fetchAddToWishList} = useAddToWishList()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity,setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const {fetchAddToCart}= useAddToCart();
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleBookClick = () => {
        navigate(`/book-detail/${_id}`);
    };
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = image;
        link.as = 'image';
        document.head.appendChild(link);
        loadImage(image).then(() => setImageLoaded(true));
    
      
      }, [image]);
    const handleWishChange = async (id) => {
        try {
            // setIsWished(!isWished);
            setSpinning(true);
            const userInfoString = localStorage.getItem("token");
            if (!userInfoString) {
                setSpinning(false);
                return toast.info('Vui lòng đăng nhập !');
              }
            const userInfo = JSON.parse(userInfoString);
            const token=userInfo.accessToken;
             await fetchAddToWishList(token,id)
            
        } catch (error) {
          toast.error('Lỗi kết nối:', error);
        }finally {
          setSpinning(false);
        }
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

    const handleRemoveWishlist = async () => {
        // Xử lý khi người dùng muốn xóa sách khỏi danh sách yêu thích
    };
    const handleQuantityChange = async(e) => {
        const value = parseInt(e.target.value, 10);
        setQuantity(value);
      };
      const handleBuyNow = async () => {
        try {
          setLoading(true)
          console.log(quantity, _id); // Fix the typo here
          const userInfoString = localStorage.getItem("token");
          const userInfo = JSON.parse(userInfoString);
          const token = userInfo.accessToken;
          // Thêm thông tin xác thực vào yêu cầu
          const success = await fetchAddToCart(token,_id,quantity)
          if(success)
          {
            setLoading(false)
            setIsModalOpen(false);
            navigate('/profile/cart')
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
          toast.error(error);
        }finally {
          setSpinning(false);
        }
      };
    return (
        <div>
            <Skeleton loading={!imageLoaded} active >
                <div className="container-book" >
                    <div
                        className="image-container"
                        style={{
                            backgroundImage: imageLoaded ? `url(${image})` : 'none',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            marginRight: '15px',
                        }}
                        loading='lazy'
                    />
                    <div className="container-content">
                        <div className="container-text">
                            <h6>{title}</h6>
                            <p style={{textOverflow:'ellipsis'}}>Tác giả: <span>
                                {author ? (
                                        author.map((authors, index) => (
                                        <span key={index}>
                                            {index > 0 && ", "} 
                                            {authors.authorName}
                                        </span>
                                        ))
                                    ) : (
                                        <span>Không có tác giả</span>
                                    )}
                                </span>
                            </p>
                            
                
            
                            <p1>{formatCurrency(price || 0)}</p1>

                        </div>
                    </div>
                    <div className="background-container">
                        <button className="show-access-button-1" onClick={handleBookClick}>
                            <img src={icon_buy} alt="buy" />
                            <strong style={{ marginLeft: '25px' }}>Chi tiết</strong>
                        </button>
                        <button className="show-access-button" onClick={()=>setIsModalOpen(true)}>
                            <img src={icon_buy1} alt="buy" />
                            <strong style={{ marginLeft: '15px' }}>Mua hàng</strong>
                        </button>
                        <img
                            className="wishlist"
                            style={{ width: '40px', height: '40px', marginTop: '10px' }}
                            id={`wishlist-icon-${_id}`}
                            src={isWished ? wished : wish}
                            alt=""
                            onClick={()=> handleWishChange(_id)}
                        />
                    </div>
                </div>
            </Skeleton>

            <Spin spinning={spinning} fullscreen />
            <Modal title="Số lượng sản phảm" open={isModalOpen} onOk={null} onCancel={handleCancel}  
            width="auto" // Canh giữa nội dung
            centered
            closeIcon={null}
            footer={
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* <Button type='default' onClick={handleCancel}>Hủy</Button> */}
                <Button type='primary' onClick={handleBuyNow} loading={loading}>Mua</Button>
                </div>
            }                    
          >
            <div className="quantity-control">
                <Button onClick={() => handleQuantityChange({ target: { value: quantity - 1 } })}>-</Button>
                <Input 
                    min={1} 
                    value={quantity} 
                    onChange={handleQuantityChange} 
                    style={{ width: '60px', textAlign: 'center' }}
                />
                <Button onClick={() => handleQuantityChange({ target: { value: quantity + 1 } })}>+</Button>
            </div>
            </Modal>
        </div>
    );
};

export default Book;
