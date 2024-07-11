import React, { useState } from 'react';
import { Card, Progress, Statistic, Row, Col, Tooltip, DatePicker, ConfigProvider } from 'antd';
import { ArrowUpOutlined, InfoCircleOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import viVN from 'antd/es/locale/vi_VN';

dayjs.locale('vi');

const RevenueSummary = ({ statistic }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const totalRevenue = statistic?.totalRevenue || 0;

  const getRevenueByDate = (date) => {
    return statistic?.revenueByDay && statistic.revenueByDay[date] ? statistic.revenueByDay[date] : 0;
  };

  const today = dayjs().format('YYYY-MM-DD');
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

  const revenueToday = getRevenueByDate(today);
  const revenueLastDay = getRevenueByDate(yesterday);
  const revenueChange = ((revenueToday - revenueLastDay) / (revenueLastDay || 1)) * 100;

  const onDateChange = (dates) => {
    setDateRange(dates);
  };

  const getTotalRevenueInRange = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return 0;

    let total = 0;
    const startDate = dateRange[0].clone().startOf('day');
    const endDate = dateRange[1].clone().endOf('day');

    for (let m = startDate; m.isBefore(endDate) || m.isSame(endDate); m = m.add(1, 'day')) {
      total += getRevenueByDate(m.format('YYYY-MM-DD'));
    }

    return total;
  };

  return (
    <ConfigProvider locale={viVN}>
      <Card style={{ textAlign: 'center' }}>
        <Progress
          type="circle"
          percent={(totalRevenue / 10000000) * 100}
          format={(percent) => `${percent.toFixed(0)}%`}
          width={80}
          style={{ marginBottom: 20 }}
        />
        <Statistic
          title={
            <Tooltip title="Tổng doanh thu">
              <span>Tổng doanh thu <InfoCircleOutlined /></span>
            </Tooltip>
          }
          value={totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          precision={0}
          valueStyle={{ fontSize: '24px' }}
          style={{ marginBottom: 20 }}
        />
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Doanh thu hôm nay" value={revenueToday.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} precision={0} />
          </Col>
          <Col span={8}>
            <Statistic
              title="Tăng"
              value={revenueChange}
              precision={2}
              valueStyle={{ color: revenueChange >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={revenueChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%"
            />
          </Col>
          <Col span={8}>
            <Statistic title="So với hôm qua" value={revenueLastDay.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} precision={0} />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={24}>
            <DatePicker.RangePicker onChange={onDateChange} />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={24}>
            <Statistic
              title="Doanh thu trong khoảng"
              value={getTotalRevenueInRange()}
              precision={0}
              suffix='VNĐ'
            />
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
};

export default RevenueSummary;
