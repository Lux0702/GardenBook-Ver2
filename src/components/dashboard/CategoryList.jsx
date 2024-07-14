import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, message, Spin, Collapse, Popconfirm, Pagination} from 'antd';
import { useCategories,useUpdateCategory,useAddCategory, useDeleteCategory } from '../../utils/api'; // Điều chỉnh đường dẫn này theo cấu trúc thư mục của bạn

const { Panel } = Collapse;
const { Search } = Input;
const CategoryList = () => {
  const [form] = Form.useForm();
  const { categoriesAll, fetchCategories } = useCategories();
  const { fetchUpdateCategory } = useUpdateCategory();
  const { fetchAddCategory } = useAddCategory();
  const { fetchDeleteCategory } = useDeleteCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeKey, setActiveKey] = useState(null); // State to manage active Collapse
  const pageSize = 5;
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchCategories();
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, [loading]);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    form.setFieldsValue({
      label: category.categoryName,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (category) => {
    try {
      console.log('id',category.id)
      const success =fetchDeleteCategory(category.id)
      if (success) {
        message.success('Xóa thể loại thành công!');
        setSpinning(true)
        setFilteredData(filteredData.filter(item => item.id !== category.id));
        // await fetchCategories();
      }else  message.error('Xóa thể loại thất bại!');
    } catch (error) {
    }finally{
      setSpinning(false);  
 
    }
  };

  const handleOk = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields();
      console.log('gia tri :', values.label)
      if (selectedCategory) {
        const success = await fetchUpdateCategory(values.label,selectedCategory.id );
        if (success) {
          message.success('Cập nhật thể loại thành công!');
          setSpinning(true);
          setIsModalOpen(false);
        }else { message.error('Lỗi cập nhật');}
      } else{
        const success = await fetchAddCategory( values.label);
        if (success) {
          message.success('Thêm thể loại thành công!');
          setSpinning(true);
          setIsModalOpen(false);
        }else { message.error('Lỗi thêm mới');}
      }
      form.resetFields();
    } catch (error) {
      message.error('Thêm/Cập nhật thể loại thất bại!');
    }finally{      
      setSpinning(false);
      setLoading(false)

    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCollapseChange = key => {
    setActiveKey(key === activeKey ? null : key); 
  };

  const bookColumns = [
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
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'stock',
      key: 'stock',
    },
  ];

  const renderPanelHeader = (category) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{category.categoryName}</span>
      <div>
        <Button type="link" onClick={() => handleEditCategory(category)}>Chỉnh sửa</Button>
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa thể loại này?"
          onConfirm={() => handleDeleteCategory(category)}
          okText="Có"
          cancelText="Không"
          // confirmLoading={loading}

        >
          <Button type="link" danger>Xóa</Button>
        </Popconfirm>
      </div>
    </div>
  );
  useEffect(() => {
    setFilteredData(
      categoriesAll.filter((item) =>
        item.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, categoriesAll]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div>
      <Card style={{ marginBottom: 10, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Danh sách Thể loại/ tác giả</h2>
          <Search
            placeholder="Tìm kiếm sách"
            onChange={handleSearch}
            style={{ width: 300 }}
            className="custom-search-input"
          />
        </div>
      </Card>
      <Card title={<span style={{fontFamily:'700', fontSize:20}}>Danh sách thể loại</span>} extra={<Button type="primary" onClick={handleAddCategory}>Thêm thể loại</Button>}>
        <Spin spinning={spinning}>
          <Collapse activeKey={activeKey} onChange={handleCollapseChange} accordion >
            {filteredData
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map(category => (
                <Panel header={renderPanelHeader(category)} key={category.id}>
                  <Table
                    columns={bookColumns}
                    dataSource={category.books}
                    rowKey="_id"
                    pagination={false}
                  />
                </Panel>
              ))}
          </Collapse>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={page => setCurrentPage(page)}
          />
        </Spin>
      </Card>
      <Modal
        title={selectedCategory ? 'Chỉnh sửa thể loại' : 'Thêm thể loại'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText='Xác nhận'
        cancelText='Hủy'
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="label"
            label="Tên thể loại"
            rules={[{ required: true, message: 'Vui lòng nhập tên thể loại' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
