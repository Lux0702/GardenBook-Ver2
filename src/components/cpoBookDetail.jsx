// BookDetail.js
import React, { useState,useEffect } from 'react';
import '../assets/css/bookDetail.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../utils/constant";
import { useParams } from 'react-router-dom';
import wish from "../assets/icons/wish.svg"
import wished from "../assets/icons/wished.png"
import {  Spin,Rate } from 'antd'
import { useNavigate } from 'react-router-dom';
import { useAddToCart, useAddToWishList } from '../utils/api';
//popup hiện error
const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="error-popup">
      <p>{message}</p>
      <button onClick={onClose}>Đóng</button>
    </div>
  );
};

const BookDetail = ({ product, onQuantityChange }) => {
  const { id } = useParams();
  console.log(id);
  const {fetchAddToCart} = useAddToCart()
  const {fetchAddToWishList} = useAddToWishList()
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [isWished, setIsWished] = useState(null);
  // const [averageRating, setAverageRating] = useState(0);
  // const bookDTO= JSON.stringify(product.bookDTO)
  useEffect(() => {
    const handleWishIcon = () => {
      setIsWished(!!wishlist.find((book) => book._id === product._id));
    };
  
    handleWishIcon(); // Initial check
  
    // Setup a cleanup function to clear the interval when the component unmounts
    const intervalId = setInterval(() => {
      handleWishIcon();
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [product, wishlist]);
  const navigate = useNavigate();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [iconWish, setIsIconWish]= useState(wish);
  const [spinning, setSpinning] = useState(false);
  const [loading,setLoading]=useState(false);
  const ratings = product.reviews? product.reviews?.map((review) => review.rating ): [];
  const averageRating =
  ratings.length > 0 ? 
  ratings.reduce((total, rating) =>{  return total + rating;}, 0) / ratings.length : 0;
  console.log('ratings:', averageRating);
  // useEffect(() => {
  //   // Kiểm tra product.reviews trước khi tính toán
  //   if (product.reviews && product.reviews.length > 0) {
  //     const ratings = product.reviews.map((review) => review.rating);
  //     const total = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  //     const average = total / ratings.length;

  //     console.log('ratings:', ratings); 

  //     setAverageRating(average);    
  //     console.log('averageRating:', average); 
  //   } else {
  //     console.log('No reviews available');
  //   }
  // }, [product]);
  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
  
    if (newQuantity > product.stock) {
      // Nếu số lượng vượt quá stock, hiển thị popup và không thay đổi state
      setShowErrorPopup(true);
  } else if (newQuantity > 0) {
    // Nếu số lượng hợp lệ (lớn hơn 0), ẩn popup và cập nhật state
    setShowErrorPopup(false);
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  }
  };
const closeErrorPopup = () => {
  setShowErrorPopup(false);
  // Đặt lại giá trị quantity nếu nó vượt quá giới hạn
  const newQuantity = Math.min(product.stock, quantity);
  setQuantity(newQuantity);
  onQuantityChange(newQuantity);
};
const addToCart = async () => {
  
  try {
    setSpinning(true);
    console.log(quantity, product._id); // Fix the typo here
    const userInfoString = localStorage.getItem("token");
    const userInfo = JSON.parse(userInfoString);
    const token = userInfo.accessToken;
    // Thêm thông tin xác thực vào yêu cầu
    await fetchAddToCart(token,id,quantity)
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error(error);
  }finally {
    setSpinning(false);
  }
};
  const handleWishChange = async ()=>{
    try {
      setSpinning(true);
      const userInfoString = localStorage.getItem("token");
      const userInfo = JSON.parse(userInfoString);
      const token=userInfo.accessToken;
      await fetchAddToWishList(token,id)
  } catch (error) {
    toast.error('Lỗi kết nối:', error);
  }finally {
    setSpinning(false);
  }
  }

  const formatCurrency = (value) => {
    const formattedValue = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0, // Để loại bỏ phần thập phân
      maximumFractionDigits: 0, // Để loại bỏ phần thập phân
    }).format(value);
  
    return formattedValue;
  };
  // buy now
  const handleBuyNow = async () => {
    try {
      setSpinning(true);
      console.log(quantity, product._id); // Fix the typo here
      const userInfoString = localStorage.getItem("token");
      const userInfo = JSON.parse(userInfoString);
      const token = userInfo.accessToken;
      // Thêm thông tin xác thực vào yêu cầu
      const success = await fetchAddToCart(token,id,quantity)
      if(success)
      {
        navigate('/profile/cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error);
    }finally {
      setSpinning(false);
    }
  };
    //get all book  in wish list
    // const fetchBooks = async () => {
    //   try {
    //     setSpinning(true);
    //     const userInfoString = localStorage.getItem("userInfo");
    //     const userInfo = JSON.parse(userInfoString);
    //     const token=userInfo.accessToken;
    //     const response = await fetch(`${API_URL}/customer/wishList`, {
    //         method: 'GET',
    //         headers: {
    //         Authorization: `Bearer ${token}`, 
    //         'Content-Type': 'application/json',
    //         },
    //     });
    //     if (response.ok) {
    //       const book = await response.json()
    //       setWishlist(book.data)
    //       //localStorage.setItem('bookData',JSON.stringify(book.data))
    //       //console.log('Get data success', books)
    //     } else {
    //       console.error('Error fetching books:', response.statusText)
    //     }
    //   } catch (error) {
    //     console.error('Error fetching books:', error)
    //   }finally {
    //     setSpinning(false);
    //   }
    // }

    //delete wisht list
  //   const handleRemoveWishlist = async () =>{
  //     try {
  //         setSpinning(true);
  //         const userInfoString = localStorage.getItem("userInfo");
  //         const userInfo = JSON.parse(userInfoString);
  //         const token=userInfo.accessToken;
  //         const response = await fetch(`${API_URL}/customer/wishlist/${id}`, {
  //             method: 'DELETE',
  //             headers: {
  //             Authorization: `Bearer ${token}`, 
  //             'Content-Type': 'application/json',
  //             },
  //         });
      
  //         if (response.ok) {
  //             const updatedData = await response.json();
  //             console.log('Profile updated successfully:', updatedData);
  //             fetchBooks()
  //             toast.success("Đã xóa khỏi wishlist")
  //             setIsIconWish(wish)
  //         } else {
  //             const updatedData = await response.json();
  //             console.error('Lỗi upload profile:', response.statusText);
  //             toast.error(updatedData.message)
          
  //         }
  //     } catch (error) {
  //     toast.error('Lỗi kết nối:', error);
  //     }finally {
  //       setSpinning(false);
  //     }
  // }
  const handleQuantityInputChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);

    if (!isNaN(newQuantity)) {
      if (newQuantity > product.stock) {
        setShowErrorPopup(true);
      } else if (newQuantity > 0) {
        setShowErrorPopup(false);
        setQuantity(newQuantity);
        onQuantityChange(newQuantity);
      }
    }
  };
  return (
    <div className="product-detail">
      <img src={product.image} alt={product.title} />  
      <div className="product-info">
        <h2>{product.title}</h2>
        <p><span className="bold-info-description"> <span className="info-label">Mô tả:</span>{product.description}</span>
        </p>
        <p className="authors-publisher">
          <span className="info-label">
            Tác giả: <span className="bold-info">
            {product.authors ? (
                    product.authors.map((authors, index) => (
                      <span key={index}>
                        {index > 0 && ", "} 
                        {authors.authorName}
                      </span>
                    ))
                  ) : (
                    <span>Không có tác giả</span>
                  )}
            </span>
           </span>
          <span className='info-label'>
            Nhà xuất bản: <span className="bold-info">{product.publisher}</span>
          </span>
        </p>
        <p className="category-quantity">
          <span className="info-label">
            Thể loại: <span className="bold-info">
            {product.categories ? (
                    product.categories.map((category, index) => (
                      <span key={index}>
                        {index > 0 && ", "} 
                        {category.categoryName}
                      </span>
                    ))
                  ) : (
                    <span>Không có thể loại</span>
                  )}
            </span>
          </span>
          <span className="info-label">
            Đã bán: <span className="bold-info">{product.soldQuantity}</span>
          </span>
        </p>
        <p>
            <br/>
            <span className="bold-info-price">{formatCurrency(product.price|| 0)}</span>
          
        </p>
        <div className="product-quantity-controls">
          <button onClick={() => handleQuantityChange(-1)}>-</button>
          <input className="product-item-quantity" type="number"
            value={quantity}
            onChange={handleQuantityInputChange}
            // onChange={(e) => setQuantity(e.target.value)}
            min="1"
            max={product.stock}/>
          <button onClick={() => handleQuantityChange(1)}>+</button>
          <p style={{marginLeft:"10px", marginTop:"10px"}}><strong>Còn:</strong>  {product.stock}</p>
        </div>
       
          {showErrorPopup && (
          <ErrorPopup
            message={`Số lượng không được vượt quá số lượng tồn kho`}
            onClose={closeErrorPopup}
          />
        )}
        <button className="buy-button"  onClick={handleBuyNow}>Mua ngay</button>
        <button className="add-to-cart-button" onClick={addToCart} >Thêm giỏ hàng</button>
        <button className='wish' style={{backgroundImage:`url('${isWished?wished:iconWish}')`}} onClick={handleWishChange}/>
        <br/><br/>
        <p><Rate disabled allowHalf value={averageRating} style={{fontSize: '25px'}} /> ({product.reviews?.length || 0} đánh giá)</p>
      </div>
      <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"/>
      <Spin spinning={spinning} fullscreen />
    </div>
  );
};

export default BookDetail;
