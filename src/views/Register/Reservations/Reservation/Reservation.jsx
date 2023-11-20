import { Col, Button, Anchor, Divider, Card, Row } from 'antd';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { BsBoxArrowLeft } from "react-icons/bs"
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import style from './Reservation.module.css';
import dayjs from 'dayjs';
import axios from 'axios';
import { useEffect, useState } from 'react';

dayjs.extend(customParseFormat);
const buttonStyle = {
  background: "#231CA7",
  color: "white",
  height: "3rem",
  width: "50%",
  marginTop: "1rem"
};

const Reservation = () => {

  const accommodationToReservation = useSelector((state) => state.accommodationToReservation);
  const reservationData = useSelector((state) => state.reservationData);
  const [accommodation, setAccommodation] = useState(JSON.parse(localStorage.getItem('accommodationData')));
  const [checkout, setCheckout] = useState(JSON.parse(localStorage.getItem('checkoutData')));
  const navigate = useNavigate()

  useEffect(() => {
    if (Object.keys(accommodationToReservation).length !== 0) {
      if (accommodation) {
        localStorage.removeItem('accommodationData');
      }
      localStorage.setItem('accommodationData', JSON.stringify(accommodationToReservation));
      setAccommodation(JSON.parse(localStorage.getItem('accommodationData')))
    }
    if (Object.keys(reservationData).length !== 0) {
      if (checkout) {
        localStorage.removeItem('checkoutData');
      }
      localStorage.setItem('checkoutData', JSON.stringify(reservationData));
      setCheckout(JSON.parse(localStorage.getItem('checkoutData')))
    }
    return () => {
      localStorage.removeItem('checkoutData');
    }
  }, []);

  const handle = () => {
    axios.post('/stripe/charge', checkout)
      .then((response) => {
        window.location.href = response.data.url;
      });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const start_date = checkout?.reservationDetails?.startDate;
  const end_date = checkout?.reservationDetails?.endDate;
  const formattedStartDate = dayjs(start_date).format('DD-MM-YYYY');
  const formattedEndDate = dayjs(end_date).format('DD-MM-YYYY');
  const habitacionService = accommodation?.idServices?.find(service => service.name === 'Habitación');
  const quantityOfHabitacion = habitacionService ? habitacionService.quantity : null;
  const totalPrice = checkout?.reservationDetails?.totalPrice;

  return (
    <div className={style.reservationBox}>
      <div className={style.columnsBox}>
        <Row>
          <Col span={14}>
            <div className={style.detailContent}>
              <div className={style.returnReservation}>
                <Button
                  onClick={handleGoBack}
                  style={{
                    backgroundColor: '#231CA7',
                  }}
                  size={64}
                  icon={<BsBoxArrowLeft />}
                />
                <p style={{ fontWeight: 'bold', fontSize: '25px' }}>
                  Solicita reservar
                </p>
              </div>

              <Divider />

              <h4 className={style.detailTitle}>Tu viaje</h4>
              <div className={style.fechas}>
                <h5>Fechas</h5>
                <p>{`${formattedStartDate} al ${formattedEndDate}`}</p>
              </div>
              <div className={style.habitaciones}>
                <h5>Habitaciones</h5>
                <p>{quantityOfHabitacion} habitaciones</p>
              </div>

              <Divider />

              <span style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold', fontSize: '25px', paddingBottom: '.3rem' }}>
                Política de cancelación
              </span>
              <p>Si cancelas antes del check-in el 6 nov., recibirás un reembolso parcial. Después de eso, tu reembolso depende de cuándo canceles. <Link to="/cancellation" style={{ fontWeight: 500 }} rel="noopener noreferrer">Más información</Link></p>

              <Divider />

              <span style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold', fontSize: '25px', paddingBottom: '.3rem' }}>
                Reglas fundamentales
              </span>
              <p>Pedimos a todos los huéspedes que recuerden algunas cosas sencillas sobre lo que hace que un huésped sea excelente.</p>
              <p>☑ Sigue las reglas de la casa.</p>
              <p>☑ Trata el alojamiento del anfitrión como si fuera tuyo.</p>

              <Divider />
              <p className={style.pSubmit}>Al seleccionar el botón que aparece a continuación, acepto las siguientes políticas: Reglas del anfitrión de la casa, Reglas fundamentales para los huéspedes. Acepto pagar el monto total indicado si el anfitrión acepta mi solicitud de reservación.</p>

                <Button
                  onClick={handle}
                  style={buttonStyle}
                  type="primary"
                  htmlType="submit"
                >
                  Realizar el pago
                </Button>

            </div>
          </Col>
          <Col span={10}>
            <div className={style.detailContent2}>
              <Anchor
                className={style.checkout}
                replace
                items={[
                  {
                    key: 'reservar',
                    href: '#part-1',
                    title: (
                      <Card
                      /*  title={
                        <img src={AccommodationById.photos} />
                       } */
                      /* extra={<a href="#">Precio por 30 días</a>} */
                      >
                        <p className={style.accommodation}>Alojamiento en {accommodationToReservation.name}</p>
                        <Divider />
                        <span style={{ fontSize: '20px', justifyContent: 'space-between', display: 'flex' }}>
                          <p>
                            <b>Informacion del precio</b>
                          </p>
                        </span>
                        <span style={{ fontSize: '20px', justifyContent: 'space-between', display: 'flex' }}>
                          <p>
                            <b>Tarifa por servicio</b>
                          </p>
                          <p>{totalPrice} USD</p>
                        </span>
                        <p></p>
                        <Button
                          type="reserv"
                          block
                          onClick={handle}
                          style={{
                            backgroundColor: 'orange',
                            color: 'black',
                            marginTop: '40px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s, color 0.3s',
                          }}
                        >
                          Realizar el pago
                        </Button>

                        <Divider />

                        <span style={{ fontSize: '20px', justifyContent: 'space-between', display: 'flex' }}>
                          <p>
                            <b>Total a pagar:</b>
                          </p>
                          <p>{totalPrice} USD</p>
                        </span>

                      </Card>
                    ),
                  },
                ]}
              />
            </div>
          </Col>
        </Row>
      </div >
    </div >
  )
};

export default Reservation;