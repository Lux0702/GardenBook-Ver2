import React, { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button, Modal, List, Empty, Spin, Checkbox } from 'antd';
import '../assets/css/userpage.css';
import { useUpdateAddress } from '../utils/api';

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);
  const [isCheckTemp, setIsCheckTemp] = useState(null);
  const { fetchUpdateAddress } = useUpdateAddress();
  const [isUpdate, setIsUpdate] = useState(false);
  const [dataSend, setDataSend] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    isDefault: false
  });

  const addressData = useCallback(() => {
    const userString = localStorage.getItem('userInfo');
    if (userString) {
      const userData = JSON.parse(userString);
      setAddresses(userData.addresses);
    }
  }, []);

  useEffect(() => {
    addressData();
  }, [addressData, isUpdate]);

  const showAddAddressModal = () => {
    setCurrentAddress(null);
    setDataSend({
      name: '',
      phoneNumber: '',
      address: '',
      isDefault: false
    });
    form.setFieldsValue({
      name: '',
      phoneNumber: '',
      address: '',
      isDefault: false,
    });
    setIsModalVisible(true);
  };

  const showEditAddressModal = (address) => {
    setCurrentAddress(address);
    setDataSend({
      name: address.name,
      phoneNumber: address.phoneNumber,
      address: address.address,
      isDefault: address.isDefault,
    });
    form.setFieldsValue({
      name: address.name,
      phoneNumber: address.phoneNumber,
      address: address.address,
      isDefault: address.isDefault,
    });
    setIsCheckTemp(address.isDefault);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      setSpinning(true);
      const values = { ...dataSend, isDefault: isCheckTemp };

      let newAddresses;
      if (currentAddress) {
        newAddresses = addresses.map(addr =>
          addr.id === currentAddress.id ? values : { ...addr, isDefault: addr.isDefault && !isCheckTemp });
      } else {
        if (isCheckTemp) {
          newAddresses = addresses.map(addr => ({ ...addr, isDefault: false }));
        } else {
          newAddresses = addresses;
        }
        newAddresses = [...newAddresses, values];
      }

      const success = await fetchUpdateAddress(newAddresses.map(({ id, ...rest }) => rest));
      if (success) {
        setAddresses(newAddresses);
        setIsUpdate(!isUpdate);
      }

      setIsModalVisible(false);
      setDataSend({
        name: '',
        phoneNumber: '',
        address: '',
        isDefault: false
      });
      setIsCheckTemp(null);
    } catch (error) {
      console.log(error);
    } finally {
      setSpinning(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsCheckTemp(null);
  };

  const handleDelete = async (id) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    const success = await fetchUpdateAddress(updatedAddresses.map(({ id, ...rest }) => rest));
    if (success) {
      setAddresses(updatedAddresses);
      setIsUpdate(!isUpdate);
    }
  };

  const setDefaultAddress = async(id) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    const success = await fetchUpdateAddress(updatedAddresses.map(({ id, ...rest }) => rest));
    if (success) {
      setIsUpdate(!isUpdate);
    }
  };

  const handleCheckboxChangeDefault = (checked) => {
    setIsCheckTemp(checked);
  };

  return (
    <div className="address-manager">
      <div className="user-info" style={{ borderBottom: '1px solid #ccc' }}>
        <h2 style={{ fontWeight: 'bold' }}>Địa chỉ của tôi</h2>
        <Button type="primary" onClick={showAddAddressModal}>
          + Thêm địa chỉ mới
        </Button>
      </div>

      <List
        itemLayout="vertical"
        dataSource={addresses}
        locale={{
          emptyText: (
            <Empty
              image="https://icons.veryicon.com/png/o/business/financial-category/no-data-6.png"
              imageStyle={{ height: 60 }}
              description={<span>Chưa có địa chỉ</span>}
            />
          ),
        }}
        renderItem={item => (
          <List.Item key={item.id}>
            <div className="address-item-content" style={{ marginLeft: '10px' }}>

              <div className="address-details">
                <List.Item.Meta
                  title={<span>{item.name} {item.isDefault && <span className="default-tag">Mặc định</span>}</span>}
                  description={<span>{item.phoneNumber}<br />{item.address}</span>}
                />
              </div>
              <div className="address-actions">
                <Button type="link" onClick={() => showEditAddressModal(item)}>Cập nhật</Button>
                <Button type="link" onClick={() => handleDelete(item.id)}>Xóa</Button>
                <Button type={item.isDefault ? "primary" : "default"} onClick={() => setDefaultAddress(item.id)}>Thiết lập mặc định</Button>
              </div>
            </div>
          </List.Item>
        )}
      />
      <Modal title={currentAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên người nhận" rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}>
            <Input value={dataSend.name} onChange={(e) => setDataSend({ ...dataSend, name: e.target.value })} />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input value={dataSend.phoneNumber} onChange={(e) => setDataSend({ ...dataSend, phoneNumber: e.target.value })} />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input value={dataSend.address} onChange={(e) => setDataSend({ ...dataSend, address: e.target.value })} />
          </Form.Item>
          <Form.Item>
            <Checkbox checked={dataSend.isDefault} onChange={(e) => {
              setDataSend({ ...dataSend, isDefault: e.target.checked });
              handleCheckboxChangeDefault(e.target.checked);
            }} style={{ marginRight: '10px' }}>
              Đặt là mặc định
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
      <Spin spinning={spinning} size="large" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
    </div>
  );
};

export default AddressManager;
