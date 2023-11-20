import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import axios from 'axios';

const LineReservation = () => {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    axios.get('/statistics/reservation/month')
      .then(response => setApiData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); 

  const config = {
    data: apiData,
    width: 800,
    height: 400,
    autoFit: false,
    xField: 'yearMonth', 
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  let chart;

  const downloadImage = () => {
    chart?.downloadImage();
  };

  const toDataURL = () => {
    console.log(chart?.toDataURL());
  };

  return (
    <>
      <div>
        <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
      </div>
    </>
  );
}

export default LineReservation;
