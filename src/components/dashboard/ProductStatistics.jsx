import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import BarChart from './BarChart'; // Assume you have a BarChart component
import { useGetStatistic } from '../../utils/api';

const ProductStatistics = () => {
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

  const getProductChartData = () => {
    return {
      labels: statistic?.productsByDay ? Object.keys(statistic.productsByDay) : [],
      data: statistic?.productsByDay ? Object.values(statistic.productsByDay) : [],
    };
  };

  const { labels, data } = getProductChartData();

  return (
    <Card
      title={<span style={{ fontSize: '20px', color: 'black', fontWeight: '500' }}>Thống kê sản phẩm</span>}
    >
      <Spin spinning={spinning}>
        <BarChart data={data} labels={labels} title="Sản phẩm theo ngày" />
      </Spin>
    </Card>
  );
};

export default ProductStatistics;
