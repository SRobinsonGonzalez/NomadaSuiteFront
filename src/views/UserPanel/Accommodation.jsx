import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardsStyles from '../../components/CardsContainer/CardsContainer.module.css';
import Cardbox from "../../components/CardBox/CardBox";
import AccStyles from "./Accommodation.module.css";
import { Row, Col, Button, Space, Alert } from 'antd';
import { NavLink } from 'react-router-dom/dist';

const Accommodation = ({ userId }) => {

  const [data, setData] = useState([]);

  const handleDeleteAccommodation = async (accommodationId) => {
    try {
      // Realizar la solicitud para actualizar la propiedad isActive a false
      await axios.put(`/accommodation/${accommodationId}`, { isActive: false });

      // Actualizar el estado local para reflejar el cambio
      setData(prevData => prevData.map(accommodation => (
        accommodation._id === accommodationId ? { ...accommodation, isActive: false } : accommodation
      )));
    } catch (error) {
      console.error('Error al eliminar el alojamiento:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/accommodation/user/${userId}`);
        setData(response.data);
      } catch (error) {
        console.error('Error al obtener las reservaciones:', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className={CardsStyles.cardsContainer}>
      <Space
        direction="vertical"
        style={{
          width: '50%',
          margin: 'auto',
          // marginBottom: "40px",
          // marginLeft: "305px",
          textAlign: "flex-start",
        }}
      >        
        <Alert
          message="¿Tienes un alojamiento?"
          description="Ahora es tu oportunidad de compartilo con otros Nómadas."
          type="info"
          showIcon
        />
        
      <NavLink to="/register-accommodation" className={AccStyles.accButton} > 
      <Button className={AccStyles.accButton}>Agregar Alojamiento</Button>
      </NavLink>
      </Space>
      
      
      <div className={CardsStyles.noScroll}>
        <Row gutter={24} align={'stretch'}>
          {data.length &&
            data?.map((accommodation, index) => (
              accommodation.isActive && (
                <Col key={index} span={24}>
                  <div style={{ borderRadius: '20px', border: '1px solid #eee', padding: '10px', margin: '10px', display: 'flex', justifyContent: 'space-evenly' }}>
                    <Cardbox
                      key={index}
                      id={accommodation._id}
                      photos={accommodation.photos}
                      name={accommodation.name}
                      rating={accommodation.rating}
                      price={accommodation.price}
                      location={`${accommodation.idLocation?.city}, ${accommodation.idLocation?.country}`}
                    />
                    <div className={AccStyles.buttonContainer}>
                      <div>

                        <span className={AccStyles.delButton}>
                          Si deseas eliminar tu alojamiento,

                          <br />
                          haz click en el botón eliminar.
                        </span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Button type="primary" danger className={AccStyles.redButton} onClick={() => handleDeleteAccommodation(accommodation._id)}>
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              )
            ))}
        </Row>
      </div>
    </div>
  );
};

export default Accommodation;
