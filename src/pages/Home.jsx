import React, { useState, useEffect, useMemo ,useSelector } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import BannerBar from "../components/BannerBar";
import { useNavigate } from 'react-router-dom';
import { Spin ,Statistic, Skeleton, Row, Col} from 'antd';
import '../assets/css/home.css';
import Book from '../components/cpoBook';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useDataBook, useBestSeller, useGetDiscounts, useCategories,useAuthors,useRecommendBook } from '../utils/api';
import useLocalStorage from '../services/useLocalStorage';
import moment from 'moment';
import FlashSaleBanner from '../components/FlashSale';
const { Countdown } = Statistic;
const HomePage = () => {
  const { dataBook,setBooks, fetchBooks } = useDataBook();
  const { recommendBook,setRecommendBook, fetchRecommendBook } = useRecommendBook();
  const [deadline, setDeadline] = useState(null);
  const { discounts, setDiscounts,fetchDiscounts } = useGetDiscounts();
  const { bestSeller,setBestSeller, fetchBestSeller } = useBestSeller();
  const { fetchCategories } = useCategories();
  const { fetchAuthors } = useAuthors();
  const [token, setToken] = useLocalStorage('token', '');
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [iconWish, setIsIconWish] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(JSON.parse(localStorage.getItem('token') || '""'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setToken]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');

      const fetchRecommendData = async () => {
        try {
          await fetchRecommendBook();
        } catch (error) {
          console.log(error);
        }
      };
      const storedRecommend = JSON.parse(localStorage.getItem('recommendBook')|| '""');
      if(storedRecommend){
        setRecommendBook(storedRecommend)
      }else{
        fetchRecommendData();

      }
      if (storedUser) {
        clearInterval(intervalId);
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchRecommendBook]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setSpinning(true);
        await Promise.all([fetchBooks(), fetchDiscounts(), fetchBestSeller(),fetchCategories(),fetchAuthors()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // setSpinning(false);
      }
    };
      const storedBooks =JSON.parse( localStorage.getItem('books')|| '""');
      const storedBestSeller = JSON.parse(localStorage.getItem('bestSeller')|| '""');
      const storedDiscounts = JSON.parse(localStorage.getItem('discounts')|| '""');

      if(storedBooks && storedBestSeller && storedDiscounts){
        setBooks(storedBooks)
        setBestSeller(storedBestSeller)
        setDiscounts(storedDiscounts)
      }
      else{
      fetchData();
      }
  }, []);

  // Memoize the fetched data
  const memoizedDiscounts = useMemo(() => discounts.filter((item)=> item.discountPercent>0), [discounts]);
  const memoizedBestSellers = useMemo(() => bestSeller.slice(0, 12), [bestSeller]);
  const memoizedRecommend = useMemo(() => recommendBook.slice(0, 12), [recommendBook]);
  const memoizedBooks = useMemo(() => dataBook.slice(0, 12), [dataBook]);
  useEffect(() => {
    if (discounts?.length > 0) {
      const endDate = moment(discounts[0].endDate).toDate();
      setDeadline(endDate);
    }
  }, [discounts,setDiscounts,memoizedDiscounts]);
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
        <BannerBar />
        {memoizedDiscounts!==0 && (<>
        {/* <div className='title-h2'>
          
         
        </div> */}
        <FlashSaleBanner deadline={deadline} navigate={navigate}/>

        <div className='container-bestseller' style={{ background: '#ccc' }}>
          <Carousel
            showDots={true}
            responsive={responsive}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {memoizedDiscounts.slice(0, 12).map((book) => (
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
        </>)}

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
        {token &&(<>
          <div className='title-h2'>
          <h2>Sách dành cho bạn</h2>
          <h3 onClick={() => navigate('/books')}>Xem thêm</h3>
        </div>
        <Skeleton active loading={!recommendBook} style={{height:500}}>
        <div className='container-bestseller' style={{background:'#fffdc3'}}>
          <Carousel
            showDots={true}
            responsive={responsive}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {memoizedRecommend.map((book) => (
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
        </div></Skeleton></>
        )}
        <div className='title-h2'>
          <h2>Sách nổi bật</h2>
          <h3 onClick={() => navigate('/books')}>Xem thêm</h3>
        </div>
        <div className='container-bestseller' style={{padding:5, background:'white', overflow: 'hidden', marginBottom:20, }}>
        
        {memoizedBooks?.map((product,index) => (
            (index % 12 === 0) && (
              <Row key={index} gutter={[25, 0]}>
                {memoizedBooks.slice(index, index + 12).map((product, subIndex) => (
                  <Col key={subIndex} xs={24} sm={12} md={8} lg={5} xl={4}>
                    <Book
                      image={product.image}
                      title={product.title}
                      author={product.authors}
                      price={product.price}
                      _id={product._id}
                      discount={product.discountPercent}
                    />
                  </Col>
                ))}
              </Row>
            )
          ))}
        </div>

        
      </div>
      <Footer />
      {  !memoizedDiscounts || memoizedDiscounts.length ===0 || !memoizedBestSellers ||memoizedBestSellers.length ===0  ?       
      <Spin spinning={true} fullscreen /> : ''
      }
    </div>
  );
};

export default HomePage;
