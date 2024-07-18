import React, { useEffect, useState } from 'react';
import { Card, Spin, Table, Tag } from 'antd';
import BarChart from './BarChart'; // Assume you have a BarChart component
import { useGetAllPost } from '../../utils/api';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import viVN from 'antd/es/locale/vi_VN';

dayjs.locale('vi');

const getStatusTag = (status) => {
  switch (status) {
    case 'Pending':
      return <Tag color="gray">Chờ xác nhận</Tag>;
    case 'Approved':
      return <Tag color="blue">Đã duyệt</Tag>;
    case 'Rejected':
      return <Tag color="red">Đã từ chối</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

const ArticleStats = () => {
  const { allPost, fetchAllPost } = useGetAllPost();
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchAllPost();
      } catch (error) {
        console.log('error', error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, []);

  const getPostChartData = () => {
    const postsByDay = allPost.reduce((acc, post) => {
      const date = dayjs(post.postedDate).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(postsByDay),
      data: Object.values(postsByDay),
    };
  };

  const { labels, data } = getPostChartData();

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Người đăng',
      dataIndex: 'postedBy',
      key: 'postedBy',
      render: (postedBy) => postedBy?.fullname,
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'postedDate',
      key: 'postedDate',
      render: (postedDate) => formatDate(postedDate),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
    },
    {
      title: 'Bình luận',
      dataIndex: 'comments',
      key: 'comments',
      render: (comments) => comments.length,
    },
  ];

  const dataSource = allPost || [];

  return (
    <Card
      title={<span style={{ fontSize: '20px', color: 'black', fontWeight: '500' }}>Thống kê bài viết</span>}
    >
      <Spin spinning={spinning}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: '20px' }}
        />
      </Spin>
    </Card>
  );
};

export default ArticleStats;
