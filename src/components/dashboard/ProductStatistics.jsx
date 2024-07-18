import React, { useEffect, useState } from 'react';
import { Card, Spin, Table,Input } from 'antd';
import { useDataBook } from '../../utils/api';
const { Search } = Input;
const ProductStatistics = () => {
  const { dataBook, fetchBooks } = useDataBook();
  const [books, setBooks] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setSpinning(true);
      try {
        let localStatistic = localStorage.getItem('books');
        if (localStatistic) {
          setBooks(JSON.parse(localStatistic));
          setFilteredData(JSON.parse(localStatistic))

        } else {
          await fetchBooks();
          localStorage.setItem('books', JSON.stringify(dataBook));
          setBooks(dataBook);
          setFilteredData(dataBook)
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Tên sách',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Tác giả',
      dataIndex: 'authors',
      key: 'authors',
      render: (authors) => authors.map(author => author.authorName).join(', '),
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'soldQuantity',
      key: 'soldQuantity',
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
    },
  ];
  useEffect(() => {
    setFilteredData(
      books.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, books]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
    <Card style={{ marginBottom: 10, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Danh sách sản phẩm</h2>
          <Search
            placeholder="Tìm kiếm sách"
            onChange={handleSearch}
            style={{ width: 300 }}
            className="custom-search-input"
          />
        </div>
      </Card>
    <Card
      title={<span style={{ fontSize: '20px', color: 'black', fontWeight: '500' }}>Thống kê sản phẩm</span>}
    >
      <Spin spinning={spinning}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="_id" 
          pagination={{ pageSize: 10 }} 
          style={{ marginTop: '20px' }}
        />
      </Spin>
    </Card></>
  );
};

export default ProductStatistics;
