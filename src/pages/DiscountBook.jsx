import React , {useState, useEffect, useMemo, useCallback} from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Book from "../components/cpoBook";
import '../assets/css/books.css'
import { useLocation, Link } from 'react-router-dom';
import { Pagination, Row, Col, Spin, Breadcrumb, Button, Modal, Divider, Slider } from 'antd';
import { FaArrowRight } from 'react-icons/fa';
import Select from 'react-select';
import { FilterFilled } from '@ant-design/icons';
import { useDataBook, useAuthors, useCategories,useGetDiscounts } from '../utils/api';
import debounce from 'lodash/debounce';
import {
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react';
const DiscountBook = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { discounts,setDiscounts, fetchDiscounts } = useGetDiscounts();
  const [currentProducts, setCurrentProducts] = useState([]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const { search } = useLocation();
  const searchTerm = new URLSearchParams(search).get('search');
  const [searchKey, setIsSearchKey] = useState('');
  // const [filteredBooks, setFilteredBooks] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [sliderValue, setSliderValue] = useState([0, 5000000]);
  const { authors,setAuthors, fetchAuthors } = useAuthors();
  const { categories,setCategories, fetchCategories } = useCategories();
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [authorFilter, setAuthorFilter] = useState([]);
  //const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  // const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedBooks = localStorage.getItem('discounts');
        const storedAuthors = localStorage.getItem('authors');
        const storedCategories = localStorage.getItem('categories');

        if (storedBooks && storedAuthors && storedCategories) {
          setFilterData(JSON.parse(storedBooks));
          setCurrentProducts(JSON.parse(storedBooks));
          setAuthors(JSON.parse(storedAuthors));
          setCategories(JSON.parse(storedCategories));
        }
        else{
              const success = await fetchDiscounts();
              if(success) {
                setFilterData(success)
                setCurrentProducts(success)

              }
              await Promise.all([fetchAuthors(),fetchCategories()])
            }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // setSpinning(false);
      }
    };
    fetchData();
  },[]);
  const showModal = () => {
    setOpen(true);
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
//function search
  const searchBooks = (searchTerm, books) => {
    if (!searchTerm) return books;

    const lowercasedTerm = searchTerm.toLowerCase();

    return books.filter((book) => {
      const titleMatches = book.title && book.title.toLowerCase().includes(lowercasedTerm);
      const authorMatches = book.authors && book.authors.some((author) => author.authorName.toLowerCase().includes(lowercasedTerm));
      const categoryMatches = book.categories && book.categories.some((category) => {
        console.log(`Checking category: ${category.categoryName.toLowerCase()} against search term: ${lowercasedTerm}`);
        return category.categoryName.toLowerCase().includes(lowercasedTerm);
      });
      console.log('book id',book._id);

      const matches = titleMatches || authorMatches || categoryMatches;
      if (!matches) {
        console.log(`Book ${book.title} does not match search term ${lowercasedTerm}`);
      }
      return matches;
    });
  };
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[currentPage])
  useEffect(() =>{
    if (searchTerm) {
      setIsSearchKey(searchTerm);
  }
},[searchTerm])
  const applyFilters = useCallback(() => {
    let filtered = currentProducts.length>0?currentProducts: discounts;
    console.log("Initial book data currentProducts:", currentProducts);
    console.log("Initial book data:", filtered);
    if (authorFilter && authorFilter.length > 0) {
      filtered = filtered.filter((book) =>
        book.authors && book.authors.some((author) =>
          authorFilter.some((filter) => filter.value === author.id)
        )
      );
    }
    console.log("After author filter:", filtered);

    if (categoryFilter && categoryFilter.length > 0) {
      filtered = filtered.filter((book) =>
        book.categories && book.categories.some((category) =>
          categoryFilter.some((filter) => filter.value === category.id)
        )
      );
    }
    console.log("After category filter:", filtered);
    console.log("money1:", sliderValue);

    filtered = filtered.filter((book) => {
      const bookPrice = book.price;
      return bookPrice >= sliderValue[0] && bookPrice <= sliderValue[1];
    });

    console.log("book filter 3:", filtered);

    return filtered;
  }, [authorFilter, categoryFilter, sliderValue, discounts, currentProducts]);

  const handleOk = () => {
    setLoading(true);
    setFilterData(applyFilters());
    setIsFilter(true)
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 200);
    return true;
  };

  const handleCancel = () => {
    setAuthorFilter([]);
    setCategoryFilter([]);
    setSliderValue([0, 5000000]);
    setCurrentPage(1);
    setOpen(false);
    setIsFilter(false)
    setFilterData(currentProducts)
  };

  const handleExit = () => {
    setOpen(false);
    setIsFilter(true)

  };
// get data book

  const memoizedFilteredBooks = useMemo(() => {
    let filtered =   filterData.length>0 ? filterData : discounts;

    console.log('search:',searchKey,searchTerm);
    if (searchKey && searchTerm) {
      filtered = searchBooks(searchKey, filtered);
    }
    return filtered;
  }, [searchKey, filterData,searchTerm,discounts]);
  

  const memoizedCurrentProducts = useMemo(() => {
    return memoizedFilteredBooks?.slice(indexOfFirstItem, indexOfLastItem);
  }, [memoizedFilteredBooks, indexOfFirstItem, indexOfLastItem]);
  useEffect(()=>{
    console.log('memoizedCurrentProducts:',memoizedCurrentProducts)
  },[memoizedCurrentProducts])
  const sortProducts = (key, order = 'asc') => {
    setIsSearchKey('');
    let sorted = [...memoizedFilteredBooks];
    if (key === 'title') {
      sorted.sort((a, b) => order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
    } else if (key === 'price') {
      sorted.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
    }
    setFilterData(sorted);
  };
  const handleSliderChange = (value) => {
    setSliderValue(value);
  };
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 0);
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);
  return (
    <div >
      <header >
        <Header />
      </header>
      <body>
        <Breadcrumb
          style={{ marginLeft: "50px", marginTop: "10px", fontSize: '15px' }}
          items={[
            {
              title: <Link style={{ textDecoration: "none" }} to="/">Trang chủ</Link>,
            },
            {
              title: "Danh sách sản phẩm",
            },
          ]}
        />

        <div className='filter-container'>
          <p style={{ marginBottom: "0" }}>
            <strong>Sắp xếp:</strong>
            <span className='sort-span' onClick={() => sortProducts('title', 'asc')}>Tên từ A <FaArrowRight /> Z</span>
            <span className='sort-span' onClick={() => sortProducts('title', 'desc')}>Tên từ Z <FaArrowRight /> A</span>
            <span className='sort-span' onClick={() => sortProducts('price', 'asc')}>Giá tăng dần</span>
            <span className='sort-span' onClick={() => sortProducts('price', 'desc')}>Giá giảm dần</span>
            <span className='sort-span' onClick={showModal}><FilterFilled /> Tìm kiếm nâng cao</span>
          
          </p>
        </div>
        <div xs="10" className="productlist-constainer">
          {console.log('book show:',memoizedCurrentProducts)}
          {memoizedCurrentProducts?.map((product,index) => (
            (index % 12 === 0) && (
              <Row key={index} gutter={[40, 0]}>
                {memoizedCurrentProducts.slice(index, index + 12).map((product, subIndex) => (
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
          {filterData.length ===0 ? 'Không tìm thấy sản phẩm nào' : ''}

        </div>
        <div className='Pagination'>
          <Pagination
            current={currentPage}
            total={memoizedFilteredBooks?.length}
            pageSize={itemsPerPage}
            onChange={setCurrentPage}
          />
        </div>
        {currentProducts?.length === 0 ? <Spin spinning={true} fullscreen size='large' />
        : <></>}

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
        <Divider orientation style={{ borderWidth: '2px' }}></Divider>
        <strong style={{ margin: '5px', fontSize: '1rem' }}>Giá tiền</strong>
        <div className='sort-price'>
          <CRow style={{ display: 'flex', alignItems: 'center' }}>
            <CCol xs="5" className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
              <CFormInput disabled type="text" id="startNumber" name="status" value={formatCurrency(sliderValue[0] || 0)} style={{ textAlign: 'center' }} />
            </CCol>
            <CCol xs="2" className="mb-3" style={{ display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'center', fontSize: '20px' }}>-</CCol>
            <CCol xs="5" className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
              <CFormInput disabled type="text" id="endNumber" name="status" value={formatCurrency(sliderValue[1] || 0)} style={{ textAlign: 'center' }} />
            </CCol>
          </CRow>
        </div>
        <Slider range defaultValue={[0, 5000000]} value={[sliderValue[0], sliderValue[1]]} max={5000000} onChange={handleSliderChange} />
        <Divider orientation style={{ margin: "5", borderWidth: '2px', marginBottom: '20px' }}></Divider>
        <strong style={{ margin: '5px', fontSize: '1rem' }}>Tác giả</strong>
        <Select
          isMulti
          name="colors"
          options={authors}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Chọn các mục..."
          styles={{ overflow: "hide" }}
          value={authorFilter}
          onChange={(selectedOptions) => setAuthorFilter(selectedOptions)}
          noOptionsMessage={() => "Không tìm thấy"}

        />
        <Divider orientation style={{ margin: "5", borderWidth: '2px', marginBottom: '20px' }}></Divider>
        <strong style={{ margin: '5px', fontSize: '1rem' }}>Thể loại</strong>
        <Select
          isMulti
          name="colors"
          options={categories}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Chọn các mục..."
          styles={{ overflow: "hide" }}
          onChange={(selectedOptions) => setCategoryFilter(selectedOptions)}
          noOptionsMessage={() => "Không tìm thấy"}
          value={categoryFilter}

        />
      </Modal>
    </div>
  );
};

export default DiscountBook;
