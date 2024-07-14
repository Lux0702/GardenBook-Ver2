import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import BarChart from './BarChart'; // Assume you have a BarChart component
import { useGetStatistic } from '../../utils/api';

const ArticleStats = () => {
  const { statistic, fetchGetStatistic } = useGetStatistic();
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinning(true);
        await fetchGetStatistic();
      } catch (error) {
        console.log('error', error);
      } finally {
        setSpinning(false);
      }
    };
    fetchData();
  }, []);

  const getPostChartData = () => {
    return {
      labels: statistic?.postsByDay ? Object.keys(statistic.postsByDay) : [],
      data: statistic?.postsByDay ? Object.values(statistic.postsByDay) : [],
    };
  };

  const { labels, data } = getPostChartData();

  return (
    <Card
      title={<span style={{ fontSize: '20px', color: 'black', fontWeight: '500' }}>Thống kê bài viết</span>}
    >
      <Spin spinning={spinning}>
        <BarChart data={data} labels={labels} title="Bài viết theo ngày" />
      </Spin>
    </Card>
  );
};

export default ArticleStats;
