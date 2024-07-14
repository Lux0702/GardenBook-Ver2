import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Input, Tooltip, Modal, Spin, Image, message, Form, Upload, Button, Tag, Rate, Popconfirm, InputNumber, DatePicker } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useDataBook, useBookDetail, useCategories, useAuthors, useDeleteBooks, useUpdateBooks } from '../../utils/api'; // Điều chỉnh đường dẫn này theo cấu trúc thư mục của bạn
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import Select from 'react-select';

const { Search } = Input;

const columns = (handleView, handleEdit, handleDelete) => [
  {
    title: 'Tên sách',
    dataIndex: 'title',
    key: 'title',
    sorter: (a, b) => a.title.localeCompare(b.title),
    render: (text) => (
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150, display: 'inline-block' }}>
        {text}
      </span>
    ),
  },
  {
    title: 'Giá',
    dataIndex: 'price',
    key: 'price',
    sorter: (a, b) => a.price - b.price,
    render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
  },
  {
    title: 'Giảm giá (%)',
    dataIndex: 'discountPercent',
    key: 'discountPercent',
    sorter: (a, b) => a.discountPercent - b.discountPercent,
    render: (discountPercent) => `${discountPercent}%`,
  },
  {
    title: 'Tồn kho',
    dataIndex: 'stock',
    key: 'stock',
    sorter: (a, b) => a.stock - b.stock,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'deleted',
    key: 'deleted',
    render: (deleted) => (deleted ? 
      <Tag color='red'> 
        Ngưng bán
      </Tag> : <Tag color='green'>
      Còn bán
    </Tag>),
  },
  {
    title: 'Thao tác',
    key: 'action',
    render: (text, record) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Tooltip title="Xem chi tiết">
          <EyeOutlined style={{ color: '#1890ff' }} onClick={() => handleView(record)} />
        </Tooltip>
        <Tooltip title="Cập nhật thông tin">
          <EditOutlined style={{ color: '#722ed1' }} onClick={() => handleEdit(record)} />
        </Tooltip>
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa sách này?"
          onConfirm={() => handleDelete(record)}
          okText="Có"
          cancelText="Không"
        >
          <Tooltip title="Xóa sách">
            <DeleteOutlined style={{ color: 'red' }} />
          </Tooltip>
        </Popconfirm>
      </div>
    ),
  },
];

const ProductList = () => {
  const [form] = Form.useForm();
  const { dataBook, fetchBooks } = useDataBook();
  const { detailBook, fetchBookDetails } = useBookDetail();
  const { categories, fetchCategories } = useCategories();
  const { updateBook, fetchUpdateBooks } = useUpdateBooks();
  const { fetchDeleteBooks } = useDeleteBooks();
  const { authors, fetchAuthors } = useAuthors();
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchBooks();
        await fetchCategories();
        await fetchAuthors();
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(
      dataBook.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, dataBook]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleView = async (book) => {
    setSelectedBook(book);
    await fetchBookDetails(book._id);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (book) => {
    try {
      setSpinning(true);
      const success = await fetchDeleteBooks(book._id);
      if (success) {
        setFilteredData(filteredData.filter(item => item._id !== book._id));
        message.success('Xóa sách thành công!');
      } else message.error('Xóa sách thất bại!');
    } catch (error) {
      message.error('Lỗi kết nối !');
    } finally {
      setSpinning(false);
    }
  };

  const handleEdit = async (book) => {
    setSelectedBook(book);
    const success = await fetchBookDetails(book._id);
    if (success) {
      form.setFieldsValue({
        title: success.title,
        authors: success.authors.map((author) => ({ value: author.id, label: author.authorName })),
        price: success.price,
        description: success.description,
        categories: success.categories.map((category) => ({ value: category.id, label: category.categoryName })),
        publisher: success.publisher,
        isbn: success.isbn,
        stock: success.stock,
        publishedDate: success.publishedDate ? moment(success.publishedDate) : null,
      });
      setFileList([]);
      setIsEditModalOpen(true);
    }
  };

  const handleDetailOk = () => {
    setIsDetailModalOpen(false);
  };

  const handleDetailCancel = () => {
    setIsDetailModalOpen(false);
  };

  const handleEditOk = async (values) => {
    try {
      setLoading(true)
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'authors' || key === 'categories') {
          formData.append(key, JSON.stringify(values[key].map(item => item.label)));
        } else if (key === 'publishedDate' && values[key]) {
          formData.append(key, moment(values[key]).format('YYYY-MM-DD'));
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });
      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      const success = await fetchUpdateBooks(formData, selectedBook._id);
      if (success) {
        setFilteredData(
          filteredData.map((item) => (item._id === selectedBook._id ? { ...item, ...values, authors: values.authors.map(author => author.label), categories: values.categories.map(category => category.label) } : item))
        );
        await fetchBookDetails(selectedBook._id)
        setIsEditModalOpen(false);
        message.success('Cập nhật thông tin sách thành công!');
        setLoading(false)
      } else {
        message.error('Cập nhật thông tin sách thất bại!');
        setLoading(false)

      }
    } catch (error) {
      message.error('Cập nhật thông tin sách thất bại!');
      setLoading(false)

    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  const handleImageChange = ({ file, fileList }) => {
    setFileList(fileList);
  };

  return (
    <div className="product-list-container">
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
      <Row gutter={16}>
        <Col span={16}>
          <Table
            columns={columns(handleView, handleEdit, handleDelete)}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            rowKey="_id"
            onRow={(record) => ({
              onClick: () => handleView(record),
              style: { cursor: 'pointer' },
            })}
          />
        </Col>
        <Col span={8}>
          <Card title="Chi tiết sản phẩm" bordered={false}>
            {selectedBook ? (
              <div>
                <h3>{detailBook.title}</h3>
                {detailBook.image && (
                  <Image src={detailBook.image} alt={detailBook.title} style={{ width: '100%', maxWidth: '150px', marginBottom: '10px' }} />
                )}
                <p><strong>Đánh giá trung bình:</strong> <Rate disabled defaultValue={getAverageRating(detailBook.reviews)} /></p>
                <p><strong>Tác giả:</strong> {detailBook.authors?.map(author => author.authorName).join(', ') || 'N/A'}</p>
                <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detailBook.price)}</p>
                <p>
                  <strong>Mô tả:</strong> {showMore ? detailBook.description : detailBook.description?.substring(0, 100)}{' '}
                  {detailBook.description && detailBook.description.length > 100 && (
                    <Button type="link" onClick={() => setShowMore(!showMore)}>
                      {showMore ? 'Ẩn bớt' : 'Xem thêm'}
                    </Button>
                  )}
                </p>
                <p><strong>Thể loại:</strong> {detailBook.categories?.map(category => category.categoryName).join(', ')}</p>
                <p><strong>Nhà xuất bản:</strong> {detailBook.publisher}</p>
                <p><strong>ISBN:</strong> {detailBook.isbn}</p>
                <p><strong>Số lượng tồn kho:</strong> {detailBook.stock}</p>
                <p><strong>Số lượng đã bán:</strong> {detailBook.soldQuantity}</p>
              </div>
            ) : (
              <p>Chọn sản phẩm để xem chi tiết</p>
            )}
          </Card>
        </Col>
      </Row>
      <Modal
        title="Cập nhật thông tin sách"
        open={isEditModalOpen}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              handleEditOk(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
        onCancel={handleEditCancel}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          name="edit_book_form"
          initialValues={{
            title: detailBook?.title,
            authors: detailBook?.authors?.map(author => ({ value: author.id, label: author.authorName })),
            price: detailBook?.price,
            description: detailBook?.description,
            categories: detailBook?.categories?.map(category => ({ value: category.id, label: category.categoryName })),
            publisher: detailBook?.publisher,
            isbn: detailBook?.isbn,
            stock: detailBook?.stock,
            publishedDate: detailBook?.publishedDate ? moment(detailBook?.publishedDate) : null,
          }}
        >
          <Form.Item
            name="title"
            label="Tên sách"
            rules={[{ required: true, message: 'Vui lòng nhập tên sách' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="authors"
            label="Tác giả"
            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
          >
            <Select
              isMulti
              options={authors}
              defaultValue={detailBook?.authors?.map(author => ({ value: author.id, label: author.authorName }))}
            />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá sách' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả sách' }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item
            name="categories"
            label="Thể loại"
            rules={[{ required: true, message: 'Vui lòng nhập thể loại sách' }]}
          >
            <Select
              isMulti
              options={categories}
              defaultValue={detailBook?.categories?.map(category => ({ value: category.id, label: category.categoryName }))}
            />
          </Form.Item>
          <Form.Item
            name="publisher"
            label="Nhà xuất bản"
            rules={[{ required: true, message: 'Vui lòng nhập nhà xuất bản' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isbn"
            label="ISBN"
            rules={[{ required: true, message: 'Vui lòng nhập mã ISBN' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Số lượng tồn kho"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="publishedDate"
            label="Ngày xuất bản"
            rules={[{ required: true, message: 'Vui lòng chọn ngày xuất bản' }]}
          >
            <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="image"
            label="Hình ảnh"
          >
            <Upload
              name="image"
              listType="picture"
              fileList={fileList}
              onChange={handleImageChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Spin spinning={spinning} fullscreen />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ProductList;
