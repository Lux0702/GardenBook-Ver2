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
import { useDataBook, useAuthors, useCategories } from '../utils/api';
import debounce from 'lodash/debounce';
import {
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react';
const DiscountBook = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { dataBook, fetchBooks } = useDataBook();
  const [currentProducts, setCurrentProducts] = useState([]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const { search } = useLocation();
  const searchTerm = new URLSearchParams(search).get('search');
  const [searchKey, setIsSearchKey] = useState('');
  // const [filteredBooks, setFilteredBooks] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [sliderValue, setSliderValue] = useState([0, 5000000]);
  const { authors, fetchAuthors } = useAuthors();
  const { categories, fetchCategories } = useCategories();
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [authorFilter, setAuthorFilter] = useState([]);
  //const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // const [isScrolled, setIsScrolled] = useState(false);

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
    let filtered = currentProducts.length>0?currentProducts: dataBook;
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
  }, [authorFilter, categoryFilter, sliderValue, dataBook, currentProducts]);

  const handleOk = () => {
    setLoading(true);
    applyFilters();
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 200);
  };

  const handleCancel = () => {
    setAuthorFilter([]);
    setCategoryFilter([]);
    setSliderValue([0, 5000000]);
    setCurrentPage(1);
    setOpen(false);
  };

  const handleExit = () => {
    setOpen(false);
  };
// get data book
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchBooks();
        await fetchAuthors();
        await fetchCategories();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  },[]);
  const memoizedFilteredBooks = useMemo(() => {
    let filtered = applyFilters();
    console.log('search:',searchKey,searchTerm);
    if (searchKey && searchTerm) {
      filtered = searchBooks(searchKey, filtered);
    }
    return filtered;
  }, [searchKey, applyFilters,searchTerm]);

  const memoizedCurrentProducts = useMemo(() => {
    return memoizedFilteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  }, [memoizedFilteredBooks, indexOfFirstItem, indexOfLastItem]);
  useEffect(()=>{
    console.log('memoizedCurrentProducts:',memoizedCurrentProducts)
  },[memoizedCurrentProducts])
  const sortProductsByName = () => {
    setIsSearchKey('');
    const sorted = [...dataBook].sort((a, b) => a.title.localeCompare(b.title));
    setCurrentProducts(sorted);
  };

  const sortProductsByNameDesc = () => {
    setIsSearchKey('');
    const sorted = [...dataBook].sort((a, b) => b.title.localeCompare(a.title));
    setCurrentProducts(sorted);
  };

  const sortProductsByPrice = () => {
    setIsSearchKey('');
    const sorted = [...dataBook].sort((a, b) => a.price - b.price);
    setCurrentProducts(sorted);
  };

  const sortProductsByPriceDesc = () => {
    setIsSearchKey('');
    const sorted = [...dataBook].sort((a, b) => b.price - a.price);
    setCurrentProducts(sorted);
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
            <span className='sort-span' onClick={sortProductsByName}> Tên từ A <FaArrowRight /> Z </span>
            <span className='sort-span' onClick={sortProductsByNameDesc}> Tên từ Z <FaArrowRight /> A </span>
            <span className='sort-span' onClick={sortProductsByPrice}> Giá tăng dần</span>
            <span className='sort-span' onClick={sortProductsByPriceDesc}> Giá giảm dần  </span>
            <span className='sort-span' onClick={showModal}> <FilterFilled /> Tìm kiếm nâng cao </span>
          </p>
        </div>
        <div xs="10" className="productlist-constainer">
          {console.log('book show:',memoizedCurrentProducts)}
          {memoizedCurrentProducts.map((product,index) => (
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
            total={memoizedFilteredBooks.length}
            pageSize={itemsPerPage}
            onChange={setCurrentPage}
          />
        </div>
        <Spin spinning={spinning} fullscreen size='large' />
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
