import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Column } from '@ant-design/plots';

const RatingColumnChart = () => {
  const initialRatingData = [];
  const [ratingData, setRatingData] = useState(initialRatingData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/statistics/reviews');
        const newRatingData = response.data;
        setRatingData(newRatingData);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const config = {
    data: ratingData,
    xField: 'count',
    yField: 'rating',
    seriesField: 'rating',
    legend: {
      position: 'top-left',
    },
  };

  return (
    <>
      <div>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          ratingData.length > 0 && <Column {...config} />
        )}
      </div>
    </>
  );
};

export default RatingColumnChart;
