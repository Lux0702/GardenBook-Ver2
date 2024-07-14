import React from 'react';
import { Tabs } from 'antd';
import AuthorList from './AuthorList';
import CategoryList from './CategoryList';

const ManageAuthorsCategories = () => {
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Tác giả" key="1">
        <AuthorList />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Thể loại" key="2">
        <CategoryList />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default ManageAuthorsCategories;
