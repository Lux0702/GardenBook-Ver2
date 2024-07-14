import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = () => {
  const data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Doanh thu hàng tuần',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: '#13c2c2',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
