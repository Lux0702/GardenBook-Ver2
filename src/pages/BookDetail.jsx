import React, { useState, useEffect } from 'react';
import BookDetail from '../components/cpoBookDetail';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import '../assets/css/detail.css';
import '../assets/css/bookDetail.css';
import { useParams, Link } from 'react-router-dom';
import Book from '../components/cpoBook';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {  Spin ,Avatar, Rate,Breadcrumb } from 'antd'
// import { FreeMode, Pagination  } from 'swiper/modules';
import { API_URL } from "../utils/constant";
// import { CImage } from '@coreui/react';
import {useBookDetail, useBookRelate} from '../utils/api'

const BookDetails = () => {
  const {detailBook, fetchBookDetails} = useBookDetail() 
  const {relateBook, fetchBookRelates} = useBookRelate() 
  const [productRelate, setProductRelate] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);
  const [iconWish, setIsIconWish]= useState(false);
  const { id } = useParams();
  const [isContentVisible, setIsContentVisible] = useState(false);
  // const [isWished, setIsWished] = useState(null);
  // const [wishlist, setWishlist] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    // Bất kỳ xử lý nào khác khi số lượng thay đổi ở đây
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setSpinning(true)
        await fetchBookDetails(id)
        window.scrollTo(0, 0);
        await fetchBookRelates(id)
      } catch (error) {
        console.error('Error fetching bookDetails:', error)
      }
      // finally {
      //   setSpinning(false);
      // }
    }
    fetchData()
  }, [id])
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-CA')
  }

  if (!detailBook || ! productRelate) {
    setSpinning(true)
  }
  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  return (
    <div>
      <Header />
      <div className='book-detail-container'>
      <Breadcrumb
        style={{marginLeft:"50px", marginTop:"10px", fontSize: "15px"}}
        items={[
          {
            title: <Link  style={{textDecoration:"none" }} to="/">Trang chủ</Link>,
          },
          {
            title: <Link  style={{textDecoration:"none"}} to="/books">Danh sách sản phẩm</Link>,
          },
          {
            title: "Chi tiết sản phẩm",
          },
                ]}
              />
        {/* <h1 className='book-h2 info-label-review'>Chi tiết sản phẩm</h1> */}
        <BookDetail product={detailBook} onQuantityChange={handleQuantityChange} />
        <div className="book-Relate" >
            <p><strong className='info-label-review'>SẢN PHẨM LIÊN QUAN</strong></p>
            <Carousel 
            responsive={responsive}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
        >
          {relateBook.slice(0,12).map((book)=> (
            <div key={book._id}>
            <Book
              image={book.image}
              title={book.title}
              author={book.authors}
              price={book.price}
              _id={book._id}
              discount={book.discountPercent}

            />
          </div>
          ))}
                    
          </Carousel>
            
        </div>
        <div className='book-detail'>
          <h2 className='info-label-review'><strong>THÔNG TIN SẢN PHẨM</strong></h2>
          <div className="book-info">
            <img src={detailBook.image} alt=""  className='product-detail' style={{width:'200px',height:'250px'}}/>
            <div className="info-row">
              <span className="info-label">Mã hàng:</span>
              <span className="tabbed-text">{detailBook.isbn}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ngôn ngữ:</span>
              <span className="tabbed-text">{detailBook.language}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Số trang:</span>
              <span className="tabbed-text">{detailBook.pageNumbers}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ngày xuất bản:</span>
              <span className="tabbed-text">{formatDate(detailBook.publishedDate)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Thể loại:</span>
              <span className="tabbed-text">
                {detailBook.categories?.map((category, index) => (
                  <span key={index}>{index > 0 && ', '}{category.categoryName}</span>
                )) || <span>Không có thể loại</span>}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Tác giả:</span>
              <span className="tabbed-text">
              {detailBook.authors?.map((author, index) => (
                  <span key={index}>{index > 0 && ', '}{author.authorName}</span>
                )) || <span>Không có tác giả</span>}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">NXB:</span>
              <span className="tabbed-text">{detailBook.publisher}</span>
            </div>
            <div className="divider-line"></div>
            <span className="info-label-tilte">{detailBook.title}</span>
            <span className={`hide-description ${isContentVisible ? 'visible' : 'hidden'}`}>{detailBook.description}</span>
            <button onClick={toggleContent} style={{width:"100px", borderRadius:"8px",margin:"auto"}}>
              {isContentVisible ? `Rút gọn` : `Xem thêm`}
            </button>    
          </div>
         
        </div>
        <div className='review-book'>
          <div className='info-label-title'>
            <span className='info-label-review'>Đánh giá sản phẩm</span>
            {detailBook.reviews?.length > 0 ? (
                detailBook.reviews.map((review, index) => (
                  <div key={index} className='user-review'>
                    <div className='user-review-item'>
                      <span className='username'><Avatar size="large" src={review.user.avatar} /> {review.user.fullname}</span>
                      <span><Rate disabled defaultValue={review.rating} style={{fontSize: '15px'}} /></span>
                      <span className='content-review'>{review.review}</span>
                    </div>
                    {index < detailBook.reviews.length - 1 && (
                      <div className="divider-line"></div>
                    )}
                  </div>
                ))
              ) : (
                <p><em>Chưa có đánh giá</em></p>
              )}
          </div>
        </div>
        
      </div>
      <Footer />
      <Spin spinning={spinning} fullscreen />
    </div>
  );
};

export default BookDetails;
