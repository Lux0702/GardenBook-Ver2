import React , {useState, useEffect} from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Book from "../components/cpoBook";
// import Book1 from "../assets/images/book1.png";
import '../assets/css/books.css'
import {  useLocation,Link } from 'react-router-dom';
import { Pagination,Row, Col } from 'antd';
import 'antd/dist/reset.css';
import { FaArrowRight } from 'react-icons/fa';
// import FilterSideBar from "../parts/filterSideBar"
import {
  CRow,
  CCol,
  CFormInput,
} from '@coreui/react'
import Select from 'react-select';
import { FilterFilled } from '@ant-design/icons';
import {  Spin ,Breadcrumb, Button, Modal, Divider,Slider  } from 'antd'
import {useDataWishList,useAuthors, useCategories} from '../utils/api'

const WishList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const {wishList, fetchWishListBooks} = useDataWishList() 
    const [currentProducts, setCurrentProducts] = useState([])
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const { search } = useLocation();
    const searchTerm = new URLSearchParams(search).get('search');
    const [searchKey, setIsSearchKey] =useState('')
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [spinning, setSpinning] = useState(false);
    // filter
    const [sliderValue, setSliderValue] = useState([0, 5000000]);
    const {authors,fetchAuthors} = useAuthors()
    // const [publishers,setPublishers] = useState([])
    const {categories,fetchCategories} = useCategories()
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [authorFilter, setAuthorFilter] = useState([]);
    const [priceFilter, setPriceFilter] = useState([]);
    // const [applyFiltersEnabled, setApplyFiltersEnabled] = useState(false);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const showModal = () => {
      setOpen(true);
    };
    //format money
    const formatCurrency = (value) => {
      const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0, // Để loại bỏ phần thập phân
        maximumFractionDigits: 0, // Để loại bỏ phần thập phân
      }).format(value);
    
      return formattedValue;
    };
    const applyFilters = () => {
      let filtered = wishList;
      console.log("Initial book data:", wishList);
      if (authorFilter.length > 0) {
        filtered = filtered.filter((book) => 
          // Kiểm tra xem sách có tác giả không
          book.authors && book.authors.some((author) =>
              authorFilter.some((filter) => filter.value === author.id)
            )
          );
      }
      console.log("After author filter:", filtered);

      if (categoryFilter.length > 0) {
        filtered = filtered.filter((book) => 
        // Kiểm tra xem sách có tác giả không
        book.categories && book.categories.some((category) =>
            categoryFilter.some((filter) => filter.value === category.id)
          )
        );
      }
      console.log("After category filter:", filtered);
      console.log("money1:",sliderValue);
      // console.log("money:",filteredBooks.map((book) => book.price));
      filtered = filtered.filter((book) => {
        const bookPrice = book.price;
        return bookPrice >= sliderValue[0] && bookPrice <= sliderValue[1];
      });
      
      console.log("book filter 3:",filtered)

      setCurrentProducts(filtered.slice(indexOfFirstItem, indexOfLastItem));
      
    };
    const handleOk = () => {
      console.log('daa i', categoryFilter);
      setLoading(true);
      applyFilters()
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 200);
    };
    const handleCancel = () => {
      setAuthorFilter([]);
      setCategoryFilter([]);
      setSliderValue([0, 5000000]);
      setFilteredBooks(wishList);
      setCurrentProducts(wishList)
      setCurrentPage(1);
      setOpen(false);

    };
    const handleExit = ()=> {
      setOpen(false);
    }
    useEffect(() => {
        const info = localStorage.getItem('token');
        const token = JSON.parse(info)
        const fetchData = async () => {
          try {
            setSpinning(true)
            await fetchWishListBooks(token.accessToken)
            await fetchAuthors()
            await fetchCategories()
          } catch (error) {
            console.error('Error fetching books:', error)
          }finally {
            setFilteredBooks(wishList)
            setSpinning(false);
          }
        }
        fetchData()
      }, [])
    // const handleStorageChange = () => {
    //   const storedAuthorFilter = localStorage.getItem('authorFilter');
    //   const storedCategoryFilter = localStorage.getItem('categoryFilter');
    //   const storedPriceFilter = localStorage.getItem('priceFilter');
    //   setAuthorFilter(storedAuthorFilter ? JSON.parse(storedAuthorFilter).map((id) => ({ id })) : []);
    //   setCategoryFilter(storedCategoryFilter ? JSON.parse(storedCategoryFilter).map((id) => ({ id })) : []);
    //   setPriceFilter(storedPriceFilter ? JSON.parse(storedPriceFilter) : []);
    //   console.log("author",1)
    // };
    const handleChangePage = (page) => {
    setCurrentPage(page);
  };
  // const handleCheckboxChange = () => {
  //   setApplyFiltersEnabled(!applyFiltersEnabled);
  // };
  useEffect(() => {
    setIsSearchKey(searchTerm || '')
    console.log('Search key:', searchTerm);
    // Tiếp tục xử lý logic tìm kiếm ở đây
  }, [searchTerm]);
  useEffect(() => {
    const temp = searchKey 
      ? (filteredBooks && filteredBooks.slice(indexOfFirstItem, indexOfLastItem))
      : (sortedProducts.length > 0 
        ? sortedProducts.slice(indexOfFirstItem, indexOfLastItem) 
        : wishList.slice(indexOfFirstItem, indexOfLastItem)) || [];
  
    setCurrentProducts(temp);
  }, [searchKey, filteredBooks, wishList, sortedProducts, indexOfFirstItem, indexOfLastItem]);
  
  //filter search
  useEffect(() => {

      setSpinning(true)
        const filtered = wishList.filter((book) =>
            book.title && searchKey && book.title.toLowerCase().includes(searchKey.toLowerCase())
          );
            console.log(filteredBooks)
            setFilteredBooks(filtered);
      setSpinning(false)

    
  }, [searchKey]);
  const sortProductsByName = () => {
    setIsSearchKey('');
    const sorted = [...wishList].sort((a, b) => a.title.localeCompare(b.title));
    setSortedProducts(sorted);
  };
  
  const sortProductsByNameDesc = () => {
    setIsSearchKey('');
    const sorted = [...wishList].sort((a, b) => b.title.localeCompare(a.title));
    setSortedProducts(sorted);
  };
  
  const sortProductsByPrice = () => {
    setIsSearchKey('');
    const sorted = [...wishList].sort((a, b) => a.price - b.price);
    setSortedProducts(sorted);
  };
  
  const sortProductsByPriceDesc = () => {
    setIsSearchKey('');
    const sorted = [...wishList].sort((a, b) => b.price - a.price);
    setSortedProducts(sorted);
  };
  useEffect(() => {
    if (wishList && wishList.length > 0) {
      setSortedProducts(wishList);
    }
  }, [wishList]);
  if (!currentProducts || !wishList || ! filteredBooks || !sortedProducts){
    return  <Spin spinning={true} fullscreen  style={{position:'relative', zIndex:5}}/>;

  }
  const handleSliderChange = (value) => {
    setSliderValue(value);
  };
  return (
    <div>
      <header>
        <Header />
      </header>
      <body>
      <Breadcrumb
        style={{marginLeft:"50px", marginTop:"10px",fontSize:'15px'}}
        items={[
          {
            title: <Link  style={{textDecoration:"none"}} to="/">Trang chủ</Link>,
          },
          {
            title: "Danh sách sản phẩm",
          },
                ]}
              />

        <div className='filter-container'>
            <p style={{marginBottom:"0"}}>
              {/* <Checkbox style={{marginRight:"2px"}} checked={applyFiltersEnabled} onChange={handleCheckboxChange} /> */}
              <strong>Sắp xếp:</strong>
              <span className='sort-span' onClick={sortProductsByName} > Tên từ A <FaArrowRight /> Z </span>
              <span className='sort-span' onClick={sortProductsByNameDesc }> Tên từ Z <FaArrowRight /> A </span>
              <span className='sort-span' onClick={sortProductsByPrice }> Giá tăng dần</span>
              <span className=' sort-span' onClick={sortProductsByPriceDesc}> Giá giảm dần  </span>
              <span className=' sort-span' onClick={showModal}> <FilterFilled /> <t/> Tìm kiếm nâng cao </span>
            </p>
        </div>
        <div xs="10" className=" productlist-constainer">
            {currentProducts.map((product, index) => (
                (index % 12 === 0) && (
                    <Row key={index} gutter={[40, 0]}>
                    {currentProducts.slice(index, index + 12).map((product, subIndex) => (
                        <Col key={subIndex} xs={24} sm={12} md={8} lg={5} xl={4}>
                        <Book
                            image={product.image}
                            title={product.title}
                            author={product.authors}
                            price={product.price}
                            _id={product._id}
                        />
                        </Col>
                    ))}
                    </Row>
                )
                ))}    
        </div>
        <div className='Pagination'>
        <Pagination
        current={currentPage}
        total={(filteredBooks && filteredBooks.length) || (wishList && wishList.length) || 0}
        pageSize={itemsPerPage}
        onChange={handleChangePage}
         />
        </div>
        <Spin spinning={spinning} fullscreen />
      </body>
      <footer>
        <Footer />
      </footer>
      <Modal
        open={open}
        title="Tất cả bộ lọc"
        onOk={handleOk}
        onCancel={handleExit}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy lọc
          </Button>,
          <Button key="submit" type='warning' 
            className='filter-button'
            loading={loading} onClick={handleOk}>
            Áp dụng
          </Button>,
        ]}
        >
        <Divider orientation style={{borderWidth: '2px'}}></Divider>

          <strong style={{ margin:'5px', fontSize:'1rem'}}>Giá tiền</strong>
          <div className='sort-price'>
            <CRow style={{display: 'flex',alignItems: 'center'}}>
              <CCol xs="5" className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                <CFormInput disabled type="text" id="startNumber" name="status" value={formatCurrency(sliderValue[0] || 0)}  style={{textAlign:'center'}}/>
              </CCol>
              <CCol xs="2" className="mb-3" style={{ display: 'flex', alignItems: 'center' ,textAlign:'center',justifyContent:'center',fontSize:'20px'}}>-</CCol>
              <CCol xs="5" className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                <CFormInput disabled type="text" id="endNumber" name="status" value={formatCurrency(sliderValue[1] || 0)} style={{textAlign:'center'}} />
              </CCol>
            </CRow>
          </div>
          <Slider range defaultValue={[0, 5000000]} value={[sliderValue[0], sliderValue[1]]} max={5000000} onChange={handleSliderChange} />
        <Divider orientation style={{margin:"5",borderWidth: '2px',marginBottom:'20px'}}></Divider>
        <strong style={{ margin:'5px', fontSize:'1rem'}}>Tác giả</strong>
        <Select
              isMulti
              name="colors"
              options={authors}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Chọn các mục..."
              styles={{overflow:"hide"}}
              value={authorFilter}
              onChange={(selectedOptions) => setAuthorFilter(selectedOptions)}
              noOptionsMessage={() => "Không tìm thấy"}

            />
        <Divider orientation style={{margin:"5",borderWidth: '2px' ,marginBottom:'20px'}}></Divider>
        <strong style={{ margin:'5px', fontSize:'1rem'}}>Thể loại</strong>
        <Select
              isMulti
              name="colors"
              options={categories}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Chọn các mục..."
              styles={{overflow:"hide"}}
              onChange={(selectedOptions) => setCategoryFilter(selectedOptions)}
              noOptionsMessage={() => "Không tìm thấy"}
              value={categoryFilter}

            />
      </Modal>

    </div>
  );
};

export default WishList;