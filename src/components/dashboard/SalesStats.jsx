import React, { useEffect, useState } from 'react';
import { Card, Spin, Button } from 'antd';
import LineChart from './LineChart';
import { useGetStatistic } from '../../utils/api';

const SalesStats = () => {
  const { statistic, fetchGetStatistic } = useGetStatistic();
  const [spinning, setSpinning] = useState(false);
  const [chartType, setChartType] = useState('ngày');

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

  const getChartData = () => {
    if (chartType === 'ngày') {
      return {
        labels: statistic?.revenueByDay ? Object.keys(statistic.revenueByDay) : [],
        data: statistic?.revenueByDay ? Object.values(statistic.revenueByDay) : [],
      };
    } else if (chartType === 'tháng') {
      return {
        labels: statistic?.revenueByMonth ? Object.keys(statistic.revenueByMonth) : [],
        data: statistic?.revenueByMonth ? Object.values(statistic.revenueByMonth) : [],
      };
    } else {
      return {
        labels: statistic?.revenueByYear ? Object.keys(statistic.revenueByYear) : [],
        data: statistic?.revenueByYear ? Object.values(statistic.revenueByYear) : [],
      };
    }
  };

  const { labels, data } = getChartData();

  return (
    <Card
      title={<span style={{ fontSize: '20px', color: 'black', fontWeight: '500' }}>Thống kê doanh thu</span>}
      extra={
        <>
          <span style={{ fontSize: '20px', color: 'black', fontWeight: '200', marginRight: 5 }}>Thống kê theo:</span>
          <Button onClick={() => setChartType('ngày')} style={{ marginRight: 5 }}>Ngày</Button>
          <Button onClick={() => setChartType('tháng')} style={{ marginRight: 5 }}>Tháng</Button>
          <Button onClick={() => setChartType('năm')} style={{ marginRight: 5 }}>Năm</Button>
        </>
      }
    >
      <Spin spinning={spinning}>
        <LineChart data={data} labels={labels} title={`Doanh thu theo ${chartType}`} />
      </Spin>
    </Card>
  );
};

export default SalesStats;
