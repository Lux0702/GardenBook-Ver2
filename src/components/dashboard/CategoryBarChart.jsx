import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Spin, Button } from 'antd';
import { LineChartOutlined, ShoppingCartOutlined, FileTextOutlined, DatabaseOutlined, BookOutlined, InteractionOutlined, UserOutlined, TagsOutlined } from '@ant-design/icons';
import '../../assets/css/dashboard.css';

import { Bar } from 'react-chartjs-2';


const getColor = (index) => {
    const colors = [
      'rgba(75, 192, 192, 0.2)',
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(199, 199, 199, 0.2)',
    ];
    const borderColor = colors.map(color => color.replace('0.2', '1'));
    return { backgroundColor: colors[index % colors.length], borderColor: borderColor[index % colors.length] };
  };
  
  const CategoryBarChart = ({ dataBook }) => {
    const [spinning, setSpinning] = useState(false);
    const [chartData, setChartData] = useState(null);
  
    useEffect(() => {
      setSpinning(true);
      const categorySales = {};
  
      dataBook.forEach(book => {
        book.categories.forEach(category => {
          if (!categorySales[category.categoryName]) {
            categorySales[category.categoryName] = 0;
          }
          categorySales[category.categoryName] += book.soldQuantity;
        });
      });
  
      const totalSales = Object.values(categorySales).reduce((acc, val) => acc + val, 0);
      const sortedCategories = Object.entries(categorySales)
        .map(([category, sales]) => ({
          category,
          sales,
          percentage: ((sales / totalSales) * 100).toFixed(2),
        }))
        .sort((a, b) => b.sales - a.sales);
  
      const labels = sortedCategories.map(cat => cat.category);
      const percentages = sortedCategories.map(cat => cat.percentage);
      const backgroundColors = sortedCategories.map((_, index) => getColor(index).backgroundColor);
      const borderColors = sortedCategories.map((_, index) => getColor(index).borderColor);
  
      setChartData({
        labels,
        datasets: [
          {
            label: 'Top thể loại bán chạy nhất',
            data: percentages,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            fontSize: 20,
          },
        ],
      });
      setSpinning(false);
    }, [dataBook]);
  
    return (
        <div  style={{ width: '100%', minheight: '400px',fontSize: 20, }}>
            <Spin spinning={spinning}>
                {chartData && (
                <Bar
                    data={chartData}
                    options={{
                    indexAxis: 'y',
                    responsive: true,
                    scales: {
                        x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                            return value + '%';
                            },
                        },
                        },
                        y: {
                        beginAtZero: true,
                        },
                    },
                    }}
                />
                )}
            </Spin>
      </div>
    );
  };
export default CategoryBarChart;