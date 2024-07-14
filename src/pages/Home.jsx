import React , {useState, useEffect} from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import DemoCarousel from "../components/BannerBar";
// import Book from "../parts/cpoBook";
// import Book1 from "../assets/images/book1.png";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/swiper-bundle.css';
// import 'swiper/css/free-mode';
// import 'swiper/css/pagination';
// import { FreeMode, Pagination } from 'swiper/modules';
import { useNavigate} from 'react-router-dom';
import {  Spin } from 'antd'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import wished from "../assets/icons/wished.png"
import wish from "../assets/icons/wish.svg"
import { API_BASE_URL } from "../contexts/Constant";
// import thumbnail1 from "../assets/images/thumbnail1.png";
// import thumbnail2 from "../assets/images/thumbnail2.png";
import '../assets/css/home.css';
import Book from '../components/cpoBook';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Card, Image, Tag, Button } from 'antd';
import {useDataBook,useBestSeller} from '../utils/api'
const HomePage = () => {
  const {dataBook, fetchBooks} = useDataBook() 
  const {bestSeller, fetchBestSeller} = useBestSeller()
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [iconWish, setIsIconWish]= useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true)
        await fetchBooks()
        await fetchBestSeller()
      } catch (error) {
        console.error('Error fetching books:', error)
      }finally {
        setSpinning(false);
      }
    }
    fetchData()
  }, [])

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
    <div style={{ backgroundColor: 'rgb(245, 247, 247)'}}>
      <Header />
      <div className="home-container container">
        <DemoCarousel />
      <h2>SIÊU GIẢM GIÁ
        <span className="flash-sale" style={{marginLeft:20}}>04h:30:39</span>
      </h2>
      <div className='container-bestseller' style={{background:'#ccc'}}>
          <Carousel 
            showDots={true}
            responsive={responsive}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
        >
          {bestSeller.slice(0,12).map((book)=> (
            <div key={book._id}>
            <Book
              image={book.image}
              title={book.title}
              author={book.author}
              price={book.price}
              _id={book._id}
              wish_icon={iconWish}
            />
          </div>
          ))}
                    
          </Carousel>
        </div>
        
        <div className='title-h2'>
          <h2>Sách bán chạy nhất</h2>
          <h3 onClick={()=> navigate('/books')} >Xem thêm</h3>
        </div>
        <div className='container-bestseller'>
          <Carousel 
            showDots={true}
            responsive={responsive}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
        >
          {bestSeller.slice(0,12).map((book)=> (
            <div key={book._id}>
            <Book
              image={book.image}
              title={book.title}
              author={book.author}
              price={book.price}
              _id={book._id}
              wish_icon={iconWish}
            />
          </div>
          ))}
                    
          </Carousel>
        </div>
        
        
      </div>

      <Footer/>
      <Spin spinning={spinning} fullscreen />
    </div>
  );
};

export default HomePage;