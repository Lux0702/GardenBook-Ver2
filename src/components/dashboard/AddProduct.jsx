import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Spin, Select, message, Upload, Row, Col, InputNumber, DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useCategories, useAuthors, useAddBooks } from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { TextArea } = Input;

const AddProduct = ({ onAddProduct }) => {
  const [form] = Form.useForm();
  const { categories,setCategories, fetchCategories } = useCategories();
  const { authors, setAuthors,fetchAuthors } = useAuthors();
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { fetchAddBooks } = useAddBooks();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await Promise.all([fetchCategories(),fetchAuthors()])
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    const storedAuthors = localStorage.getItem('authors');
    const storedCategories = localStorage.getItem('categories');

    if ( storedAuthors && storedCategories) {
      setAuthors(JSON.parse(storedAuthors));
      setCategories(JSON.parse(storedCategories));
    }
    else{
      fetchData();
    }
  }, []);

  const handleAddProduct = async (values) => {
    try {
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
      setLoading(true);
      const success = await fetchAddBooks(formData);
      if (success) {
        message.success('Thêm sản phẩm thành công!');
        form.resetFields();
        setFileList([]);
        if (onAddProduct) {
          onAddProduct();
        }
        setLoading(false);
        window.scrollTo(0, 0);
      } else {
        message.error('Thêm sản phẩm thất bại!');
        setLoading(false);
      }
    } catch (error) {
      console.error('Lỗi kết nối!', error);
      setLoading(false);
    }
  };

  const handleImageChange = ({ file, fileList }) => {
    setFileList(fileList);
  };

  return (
    <div className="add-product-container">
      <Card style={{ marginBottom: 10, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ marginBottom: 0 }}>Thêm sách mới</h2>
        </div>
      </Card>
      <Spin spinning={spinning}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddProduct}
          initialValues={{
            title: '',
            authors: [],
            price: '',
            description: '',
            categories: [],
            publisher: '',
            isbn: '',
            stock: '',
            pageNumbers: '',
            publishedDate: '',
            language: '',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Thông tin cơ bản">
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
                    mode="multiple"
                    labelInValue
                    options={authors.map(author => ({ label: author.label, value: author.value }))}
                  />
                </Form.Item>
                <Form.Item
                  name="categories"
                  label="Thể loại"
                  rules={[{ required: true, message: 'Vui lòng nhập thể loại sách' }]}
                >
                  <Select
                    mode="multiple"
                    labelInValue
                    options={categories.map(category => ({ label: category.label, value: category.value }))}
                  />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="price"
                      label="Giá"
                      rules={[{ required: true, message: 'Vui lòng nhập giá sách' }]}
                    >
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="stock"
                      label="Số lượng tồn kho"
                      rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho' }]}
                    >
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="image"
                  label="Hình ảnh"
                  rules={[{ required: true, message: 'Vui lòng tải hình ảnh lên' }]}
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
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Thông tin chi tiết">
                <Form.Item
                  name="description"
                  label="Mô tả"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả sách' }]}
                >
                  <TextArea rows={5} />
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
                  name="pageNumbers"
                  label="Số trang"
                  rules={[{ required: false }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  name="publishedDate"
                  label="Ngày xuất bản"
                  rules={[{ required: false }]}
                >
                  <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  name="language"
                  label="Ngôn ngữ"
                  rules={[{ required: false }]}
                >
                  <Input />
                </Form.Item>
              </Card>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }} loading={loading}>
                  Thêm sản phẩm
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
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

export default AddProduct;
