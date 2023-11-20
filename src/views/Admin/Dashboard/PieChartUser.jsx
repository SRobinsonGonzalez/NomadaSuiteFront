import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';
import axios from 'axios';

const PieChartUser = () => {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    axios.get('/statistics/user/actives')
      .then(response => setApiData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); 

  const config = {
    appendPadding: 10,
    data: apiData,
    angleField: 'value',
    colorField: 'name',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return <Pie {...config} />;
};

export default PieChartUser;
