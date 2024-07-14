import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, message, Spin, Popconfirm, Pagination, Collapse } from 'antd';
import { useAuthors, useUpdateAuthor, useAddAuthor, useDeleteAuthor } from '../../utils/api'; // Điều chỉnh đường dẫn này theo cấu trúc thư mục của bạn

const { Panel } = Collapse;
const { Search } = Input;

const AuthorList = () => {
  const [form] = Form.useForm();
  const { authorsAll, fetchAuthors } = useAuthors();
  const { fetchUpdateAuthor } = useUpdateAuthor();
  const { fetchAddAuthor } = useAddAuthor();
  const { fetchDeleteAuthor } = useDeleteAuthor();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
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
        await fetchAuthors();
      } catch (error) {
        console.log(error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, [loading]);

  const handleAddAuthor = () => {
    setSelectedAuthor(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditAuthor = (author) => {
    setSelectedAuthor(author);
    form.setFieldsValue({
      label: author.authorName,
    });
    setIsModalOpen(true);
  };

  const handleDeleteAuthor = async (author) => {
    try {
      setLoading(true);
      const success = await fetchDeleteAuthor(author.id);
      if (success) {
        message.success('Xóa tác giả thành công!');
        setLoading(false);
        setFilteredData(filteredData.filter(item => item.id !== author.id));
        // await fetchAuthors();
      } else {
        message.error('Xóa tác giả thất bại!');
      }
    } catch (error) {
      message.error('Xóa tác giả thất bại!');
    } finally {
    }
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (selectedAuthor) {
        const success = await fetchUpdateAuthor(values.label, selectedAuthor.id);
        if (success) {
          message.success('Cập nhật tác giả thành công!');
          setLoading(false);
          setIsModalOpen(false);
        } else {
          message.error('Lỗi cập nhật');
        }
      } else {
        const success = await fetchAddAuthor(values.label);
        if (success) {
          message.success('Thêm tác giả thành công!');
          setLoading(false);
          setIsModalOpen(false);

        } else {
          message.error('Lỗi thêm mới');
        }
      }
      await fetchAuthors(); // Cập nhật lại dữ liệu sau khi thêm/cập nhật thành công
      form.resetFields();
    } catch (error) {
      message.error('Thêm/Cập nhật tác giả thất bại!');
    } finally {
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCollapseChange = key => {
    setActiveKey(key === activeKey ? null : key); // Toggle active key
  };

  useEffect(() => {
    setFilteredData(
      authorsAll?.filter((item) =>
        item.authorName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, authorsAll]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const bookColumns = [
    {
      title: 'Tên sách',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Thể loại',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories) => categories.map(category => category.categoryName).join(', '),
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

  const renderPanelHeader = (author) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{author.authorName}</span>
      <div>
        <Button type="link" onClick={() => handleEditAuthor(author)}>Chỉnh sửa</Button>
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa tác giả này?"
          onConfirm={() => handleDeleteAuthor(author)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="link" danger>Xóa</Button>
        </Popconfirm>
      </div>
    </div>
  );

  return (
    <div>
      <Card style={{ marginBottom: 10, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Danh sách Tác giả</h2>
          <Search
            placeholder="Tìm kiếm tác giả"
            onChange={handleSearch}
            style={{ width: 300 }}
            className="custom-search-input"
          />
        </div>
      </Card>
      <Card title={<span style={{fontFamily:'700', fontSize:20}}>Danh sách tác giả</span>} extra={<Button type="primary" onClick={handleAddAuthor}>Thêm tác giả</Button>}>
        <Spin spinning={spinning}>
          <Collapse activeKey={activeKey} onChange={handleCollapseChange} accordion  scroll={{
                      y: 340,
                    }}>
            {filteredData
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map(author => (
                <Panel header={renderPanelHeader(author)} key={author.id}>
                  <Table
                    columns={bookColumns}
                    dataSource={author.books}
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
        title={selectedAuthor ? 'Chỉnh sửa tác giả' : 'Thêm tác giả'}
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
            label="Tên tác giả"
            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuthorList;
