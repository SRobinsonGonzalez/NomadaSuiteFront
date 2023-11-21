import { getReservationById, getUserById, getUserData } from "../../../../redux/Actions/actions";
import { Button, Col, Divider, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import style from "./Checkout.module.css";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import dayjs from "dayjs";

const buttonStyle = {
  background: "#231CA7",
  color: "white",
  height: "3rem",
  width: "100%"
};

const Checkout = () => {

  const id = useParams().checkoutId;
  const dispatch = useDispatch();
  const reservationById = useSelector((state) => state.reservationById);
  const userById = useSelector((state) => state.userById)
  const accommodation = JSON.parse(localStorage.getItem('accommodationData'));
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    dispatch(getReservationById(id));
    dispatch(getUserData(userId));
    dispatch(getUserById(accommodation.ownerId))
    return () => {
      localStorage.removeItem('checkoutData');
    }
  }, [])

  const name = accommodation.name

  const startDate = reservationById?.reservation?.startDate
  const [onlyStartDate] = startDate ? startDate.split('T') : [null, null];
  const start = dayjs(onlyStartDate).format('DD-MM-YYYY');
  const endDate = reservationById?.reservation?.endDate
  const [onlyEndDate] = endDate ? endDate.split('T') : [null, null];
  const end = dayjs(onlyEndDate).format('DD-MM-YYYY');
  
  const nights = reservationById?.reservation?.daysReserved
  const habitacionService = accommodation?.idServices?.find(service => service.name === 'Habitación');
  const quantity = habitacionService ? habitacionService.quantity : null;

  const firstName = userById?.firstName
  const lastName = userById?.lastName

  const nomadic = reservationById?.billingInfo?.checkout_session?.customer_details?.name
  const paymentMethod = reservationById?.billingInfo?.checkout_session?.payment_method_types

  const dateHourString = reservationById?.billingInfo?.created;
  const [date, hour] = dateHourString ? dateHourString.split('T') : [null, null];
  const checkoutDate = dayjs(date).format('DD-MM-YYYY');
  const [checkoutHour] = hour ? hour.split('.') : [null];

  return (
    <div className={style.checkout}>
      <div className={style.columnsBox}>
        <h1>Tu recibo</h1>
        <Row gutter={50}>
          <Col span={12}>
            <div className={style.boxes}>
              <div>
                <h2>{name}</h2>
                <img className={style.imgLogo} src="https://nomadasuitefront-production-cf39.up.railway.app/assets/logo-68e4d767.png" />
              </div>
              <h3>{nights} noches en {name}</h3>
              <Divider />
              <div className={style.img}>
                <img src={accommodation?.photos[0]} />
              </div>
              <p>{start} ➡ {end}</p>
              <p>Alojamiento ▪ {quantity} habitaciones</p>
              <h6>Anfitrión: {`${firstName} ${lastName}`}</h6>
              <h6>Nómada: {nomadic}</h6>
              <Divider />
              <Link to="/cancellation"><h3>Políticas de cancelación</h3></Link>
            </div>
          </Col>
          <Col span={12}>
            <div className={style.boxesRight}>
              <h2>Desglose del precio</h2>
              <span style={{ justifyContent: 'space-between', display: 'flex' }}>
                <p>Tarifa por mes</p>
                <p>{reservationById?.reservation?.monthlyRate} USD</p>
              </span>
              <span style={{ justifyContent: 'space-between', display: 'flex' }}>
                <p>Oferta especial</p>
                <p>-{"0"} USD</p>
              </span>
              <Divider />
              <span style={{ justifyContent: 'space-between', display: 'flex' }}>
                <h3>
                  <b>Total a pagar:</b>
                </h3>
                <p>{reservationById?.reservation?.totalPrice} USD</p>
              </span>
            </div>
            <div className={style.boxesRight}>
              <h2>Pago</h2>
              <span style={{ justifyContent: 'space-between', display: 'flex' }}>
                <p>{`Método de pago: ${paymentMethod}`}</p>
                <p>{reservationById?.reservation?.totalPrice} USD</p>
              </span>
              <h6>{checkoutDate}, {checkoutHour}</h6>
              <Divider />
              <span style={{ justifyContent: 'space-between', display: 'flex' }}>
                <h3>
                  <b>Cantidad abonada</b>
                </h3>
                <p>{reservationById?.reservation?.totalPrice} USD</p>
              </span>
            </div>
            <Link to="/">
              <Button
                block
                htmlType="button"
                style={buttonStyle}
                type="primary"
              >
                Terminar
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  )
};

export default Checkout;