import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardsStyles from '../../components/CardsContainer/CardsContainer.module.css';
import Cardbox from "../../components/CardBox/CardBox";
import { DatePicker, Space, Row, Col, Divider, Alert, Input, Rate, Button } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ResStyles from "./Reservations.module.css";

const { TextArea } = Input;

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const fechaActual = '2024/03/05';

const Reservation = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [accommodationDataArray, setAccommodationDataArray] = useState([]);
  const [fechaActualizada, setFechaActualizada] = useState('');
  const [rateValues, setRateValues] = useState(0);
  const [reviewTexts, setReviewTexts] = useState('');
  const [showReviewForms, setShowReviewForms] = useState({});
  const [reviewButtonEnabled, setReviewButtonEnabled] = useState(true);

  useEffect(() => {
    const enableTimer = setTimeout(() => {
      setReviewButtonEnabled(false);
    }, 48 * 60 * 60 * 1000); // 48 horas en milisegundos

    return () => clearTimeout(enableTimer); // Limpia el temporizador al desmontar el componente
  }, []);
  
  useEffect(() => {
    // Mueve la lógica para obtener la fecha actualizada aquí
    fetch('http://worldtimeapi.org/api/ip')
    .then(response => response.json())
    .then(data => {
      var fechaHoraInternet = new Date(data.utc_datetime);
      var ano = fechaHoraInternet.getUTCFullYear();
      var mes = ('0' + (fechaHoraInternet.getUTCMonth() + 1)).slice(-2);
      var dia = ('0' + fechaHoraInternet.getUTCDate()).slice(-2);
      var fechaActualizada = ano + '-' + mes + '-' + dia;
      
      
      setFechaActualizada(fechaActualizada); // Actualiza el estado con la fecha actualizada
    })
    .catch(error => console.error('Error al obtener la fecha y hora desde Internet:', error));
  }, []); // El segundo argumento [] significa que este efecto se ejecutará solo una vez al montar el componente
  
  
  
  useEffect(() => {
    const getReservation = async () => {
      try {
        const response = await axios.get(`/reservation/${userId}`);
        // Aquí deberías manejar la respuesta según la estructura de datos que recibas
        setData(response.data);      
      } catch (error) {
        console.error('Error al obtener las reservaciones:', error);
      }
    } 
    getReservation();
  }, []);
  
  let idAccommodationArray;
  useEffect(() => {
    const idAccommodationArray = data.map(item => item.idAccommodation);
  }, [data]);
  
  
  useEffect(() => {
    const fetchAccommodationData = async () => {
      const idAccommodationArray = data.map((item) => item.idAccommodation);
      // Itera sobre los IDs y obtén la información de cada alojamiento
      const accommodationDataArray = await Promise.all(
        idAccommodationArray.map(async (id) => {
          try {
            const accommodationResponse = await axios.get(`/accommodation/${id}`);
            return accommodationResponse.data; // Contiene la información del alojamiento
          } catch (error) {
            console.error(`Error al obtener la información del alojamiento ${id}:`, error);
            return null;
          }
        })
        );
        setAccommodationDataArray(accommodationDataArray);
        // accommodationDataArray ahora contiene la información de todos los alojamientos asociados a las reservas
      };
      
      fetchAccommodationData();
    }, [data]);

    useEffect(() => {
      // Cuando cambia el conjunto de datos (data), inicializa el estado showReviewForms
      const initialShowReviewForms = data.reduce((acc, reservation) => {
        acc[reservation.idAccommodation] = false;
        return acc;
      }, {});
    
      setShowReviewForms(initialShowReviewForms);
    }, [data]);

    const handleRateChange = (value, reservationId) => {
      // Al cambiar la calificación, actualizar el estado correspondiente
      setRateValues(prevState => ({
        ...prevState,
        [reservationId]: value,
      }));
    };

    const handleButtonClick = (reservationId) => {
      // Solo permite hacer clic en el botón si está habilitado
      if (reviewButtonEnabled) {
        setShowReviewForms((prevState) => ({
          ...prevState,
          [reservationId]: true,
        }));
      }
    };
  
    const handleTextAreaChange = (e, reservationId) => {
      // Al cambiar el texto del área de texto, actualizar el estado correspondiente
      setReviewTexts(prevState => ({
        ...prevState,
        [reservationId]: e.target.value,
      }));
    };
    const handleSubmitReview = async (reservationId) => {
      try {
        const idAccommodation = accommodationDataArray.find(item => item._id === reservationId)?._id;
    
        const comment = reviewTexts[reservationId];
        const rating = rateValues[reservationId];
    
        const response = await axios.post('/reviews/create', {
          idUser: userId,
          idAccommodation: idAccommodation,
          comment: reviewTexts[reservationId], // Utilizar el texto de revisión específico de esta reserva
          rating: rateValues[reservationId],
        });
    
        setRateValues(prevState => ({
          ...prevState,
          [reservationId]: 0,
        }));
    
        // Limpia el formulario de revisión específico de esta reserva
        setReviewTexts(prevState => ({
          ...prevState,
          [reservationId]: '',
        }));
        setShowReviewForms(prevState => ({
          ...prevState,
          [reservationId]: false,
        }));
      } catch (error) {
        console.error('Error al enviar la revisión:', error);
        // Puedes manejar el error aquí
      }
    };

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
          message="Nota Importante!"
          description="No olvides dejar tu review, los proximos Nómadas te lo agradeceran."
          type="info"
          showIcon
        />
        
      </Space>
      <div className={CardsStyles.noScroll}>
        <Row gutter={24} align={'stretch'}>
          {data.length &&
            data?.map((reservation, index) => {
              const accommodationInfo = accommodationDataArray[index];
              const reservationId = reservation.idAccommodation;
              return (
                <Col key={index} span={24}>
                  <div style={{ borderRadius: '20px', border: '1px solid #eee', padding: '10px', margin: '10px', display: 'flex', justifyContent: 'space-evenly' }}>
                  
                  <Cardbox 
                    key={index}
                    id={accommodationInfo?._id}
                    photos={accommodationInfo?.photos}
                    name={accommodationInfo?.name}
                    rating={accommodationInfo?.rating}
                    price={accommodationInfo?.price}
                    location={`${accommodationInfo?.idLocation?.city}, ${accommodationInfo?.idLocation?.country}`}
                  />
                  
                    <div>
                      <Space direction="vertical" size={12}>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }} >
                          <span style={{ marginRight: '79px', fontWeight: 'bold' }}>Check In</span>
                          <DatePicker
                            defaultValue={dayjs(reservation.startDate, dateFormat)}
                            format={dateFormat}
                            allowClear={false}
                            disabledDate={(current) => current && current < dayjs().endOf('day')}
                            open={false}
                            inputReadOnly={true}
                          />
                        </div>
                      </Space>

                      <Divider />

                      <Space direction="vertical" size={12}>
                        <div style={{ display: 'flex', alignItems: 'center' }} >
                          <span style={{ marginRight: '70px', fontWeight: 'bold' }}>Check Out</span>
                          <DatePicker
                            defaultValue={dayjs(reservation.endDate, dateFormat)}
                            format={dateFormat}
                            allowClear={false}
                            disabledDate={(current) => current && current < dayjs().endOf('day')}
                            open={false}
                            inputReadOnly={true}
                          />
                        </div>
                      </Space>

                      <Divider />
                      
                      <Space direction="vertical" size={12}>
                        <div style={{ display: 'flex', alignItems: 'center' }} >
                          <span style={{ marginRight: '70px', fontWeight: 'bold' }}>Dias Reservados:</span>
                          {/* Aquí debes mostrar la información correcta de los días reservados */}
                          <span style={{ fontWeight: 'bold', marginLeft: '50px' }}>{reservation.daysReserved}</span>
                        </div>
                      </Space>

                      <Divider />
                      
                      <Space direction="vertical" size={12}>
                        <div style={{ display: 'flex', alignItems: 'center' }} >
                          <span style={{ marginRight: '80px', fontWeight: 'bold', fontSize: '20px' }}>Total Pagado:</span>
                          {/* Aquí debes mostrar la información correcta del total pagado */}
                          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>${reservation.totalPrice}</span>
                        </div>
                      </Space>

                      <Divider />

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Button
                        disabled={!reviewButtonEnabled || reservation.endDate > fechaActual}
                        className={ResStyles.buttonStyle}
                        onClick={() => handleButtonClick(reservationId)}
                      >
                        Ingresa tu Review
                      </Button>

                      {showReviewForms[reservationId] && (
                        <div>
                          <Rate
                            defaultValue={0}
                            style={{ marginBottom: '15px' }}
                            onChange={(value) => handleRateChange(value, reservationId)}
                          />
                          <TextArea
                            rows={4}
                            placeholder="Describe tu experiencia"
                            maxLength={150}
                            value={reviewTexts[reservationId] || ''}
                            onChange={(e) => handleTextAreaChange(e, reservationId)}
                          />
                          <span className="ant-rate-text"></span>
                          <Button type="primary" onClick={() => handleSubmitReview(reservationId)}>
                            Enviar Review
                          </Button>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
        </Row>
      </div>
    </div>
  );
};

export default Reservation;