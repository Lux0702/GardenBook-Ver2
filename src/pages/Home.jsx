import React, { useState, useEffect, useMemo } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import DemoCarousel from "../components/BannerBar";
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import '../assets/css/home.css';
import Book from '../components/cpoBook';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useDataBook, useBestSeller, useGetDiscounts } from '../utils/api';

const HomePage = () => {
  const { dataBook, fetchBooks } = useDataBook();
  const { discounts, fetchDiscounts } = useGetDiscounts();
  const { bestSeller, fetchBestSeller } = useBestSeller();
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [iconWish, setIsIconWish] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setSpinning(true);
        await Promise.all([fetchBooks(), fetchDiscounts(), fetchBestSeller()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // setSpinning(false);
      }
    };
    fetchData();
  }, []);

  // Memoize the fetched data
  const memoizedDiscounts = useMemo(() => discounts.slice(0, 12), [discounts]);
  const memoizedBestSellers = useMemo(() => bestSeller.slice(0, 12), [bestSeller]);

  const responsive = {
    superLargeDesktop: {
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
    <div style={{ backgroundColor: 'rgb(245, 247, 247)' }}>
      <Header />
      <div className="home-container container title-h2">
        <DemoCarousel />
        <div className='title-h2'>
          <h2>SIÊU GIẢM GIÁ</h2>
          <h3 onClick={() => navigate('/books/discount')}>Xem thêm</h3>
        </div>

        <div className='container-bestseller' style={{ background: '#ccc' }}>
          <Carousel
            showDots={true}
            responsive={responsive}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {memoizedDiscounts.map((book) => (
              <div key={book._id}>
                <Book
                  image={book.image}
                  title={book.title}
                  author={book.authors}
                  price={book.price}
                  _id={book._id}
                  wish_icon={iconWish}
                  discount={book.discountPercent}
                />
              </div>
            ))}
          </Carousel>
        </div>

        <div className='title-h2'>
          <h2>Sách bán chạy nhất</h2>
          <h3 onClick={() => navigate('/books')}>Xem thêm</h3>
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
            {memoizedBestSellers.map((book) => (
              <div key={book._id}>
                <Book
                  image={book.image}
                  title={book.title}
                  author={book.authors}
                  price={book.price}
                  _id={book._id}
                  wish_icon={iconWish}
                  discount={book.discountPercent}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      <Footer />
      {! dataBook || !discounts || !bestSeller ?       
      <Spin spinning={true} fullscreen /> : ''
      }
    </div>
  );
};

export default HomePage;
