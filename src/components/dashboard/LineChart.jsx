import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ data, labels, title }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        fill: false,
        backgroundColor: '#1890ff',
        borderColor: '#1890ff',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <div style={{ width: '100%', height: '400px' }}> 
  <Line data={chartData} options={options} />
</div>
};

export default LineChart;
