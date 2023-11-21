import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { clearDetail, getAccommodationById, setReservationData } from '../../../redux/Actions/actions';
import { UserOutlined, CarOutlined, CoffeeOutlined, LaptopOutlined, WifiOutlined } from '@ant-design/icons';
import { Col, DatePicker, Button, Anchor, Divider, InputNumber, Avatar, Card, Row, Carousel, Flex, Rate, Modal } from 'antd';
import { LiaToiletSolid } from 'react-icons/lia';
import { GiForkKnifeSpoon } from 'react-icons/gi';
import { LuRefrigerator } from 'react-icons/lu';
import { LuMicrowave } from 'react-icons/lu';
import { BiSolidWasher } from 'react-icons/bi';
import { BiSolidDryer } from 'react-icons/bi';
import { useSelector, useDispatch } from 'react-redux';
import detailStyles from './AccommodationDetail.module.css';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Login from '../../../components/Modals/Login/Login';

dayjs.extend(customParseFormat);

const AccommodationDetail = () => {

  const [unavailableRanges, setUnavailableRanges] = useState([]);

  const id = useParams().id;
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userId');
  const AccommodationById = useSelector((state) => state.accommodationById);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [total, setTotal] = useState();
  console.log(AccommodationById?.idLocation?.coordinates);
  const coordinates = AccommodationById?.idLocation?.coordinates;
  const [lat, lng] = coordinates ? coordinates.split(',') : [undefined, undefined];

  useEffect(() => {
    dispatch(getAccommodationById(id));
    return () => {
      dispatch(clearDetail());
    }
  }, [])

  const [ownerFirst, setOwnerFirst] = useState('');
  const [ownerLast, setOwnerLast] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/user/${AccommodationById?.ownerId}`);
        const userFirst = response.data.firstName;
        setOwnerFirst(userFirst);
        const userLast = response.data.lastName;
        setOwnerLast(userLast);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };

    fetchUserData();
  }, [AccommodationById]);

  useEffect(() => {
    const fetchUnavailableRanges = async () => {
      try {
        const response = await axios.get(`/reservation/disponibility/${AccommodationById._id}`);
        const data = response.data; // Asumiendo que la respuesta tiene el formato deseado
        setUnavailableRanges(data.unavailableRanges);
      } catch (error) {
        console.error('Error al obtener las fechas no disponibles:', error);
      }
    };

    fetchUnavailableRanges();
  }, [AccommodationById]);

  const { RangePicker } = DatePicker;

  const disabledDate = (current) => {
    return current && (current < dayjs().endOf('day') || unavailableRanges.some(range => (
      (current >= dayjs(range.start) && current <= dayjs(range.end))
    )));
  };

  // filas
  const style = {
    background: "",
    padding: '30px 20px 10px 40px',
    fontWeight: 'bold',
    fontSize: '20px',
    marginBottom: '20px',
    marginRight: '80px',

  };
  const style2 = {
    background: '',
    padding: '0px 0px 20px 40px',
    textDecoration: 'underline',

  };

  const mapStyle = {
    width: '100%',
    height: '500px'
  };

  const onRangeChange = (dates, dateStrings) => {
    const days = Math.abs(new Date(dateStrings[1]) - new Date(dateStrings[0])) / (1000 * 3600 * 24);
    const totalPrice = (days * AccommodationById.price / 30).toFixed(2);
    setTotal(totalPrice);

    // Verificar si el rango seleccionado está dentro de las fechas no disponibles
    const isRangeUnavailable = unavailableRanges.some(range => (
      (new Date(dateStrings[0]) >= new Date(range.start) && new Date(dateStrings[0]) <= new Date(range.end)) ||
      (new Date(dateStrings[1]) >= new Date(range.start) && new Date(dateStrings[1]) <= new Date(range.end))
    ));

    if (isRangeUnavailable) {
      // Aquí puedes manejar el caso en que el rango seleccionado no esté disponible
      // Por ejemplo, mostrar un mensaje al usuario
      console.log('El rango seleccionado no está disponible');
    } else {
      setDate({
        start_date: dateStrings[0],
        end_date: dateStrings[1],
      });
    }
  };

  useEffect(() => {
    setTotal(AccommodationById?.price);
  }, []);

  const [date, setDate] = useState({
    start_date: '',
    end_date: ''
  });

  const startDate = new Date(date.start_date);
  const endDate = new Date(date.end_date);
  const timeDifference = endDate - startDate;
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const totalPrice = total?.replace('.', '');

  const checkoutStripe =
  {
    "line_items": [
      {
        "price_data": {
          "product_data": {
            "name": AccommodationById.name,
          },
          "currency": "usd",
          "unit_amount": totalPrice
        },
        "quantity": 1
      },
    ],
    "reservationDetails": {
      "userId": userId,
      "accommodationId": AccommodationById._id,
      "monthlyRate": AccommodationById.price,
      "daysReserved": days,
      "startDate": date.start_date,
      "endDate": date.end_date,
      "totalPrice": total
    }
  };

  const handleReservationClick = () => {
    dispatch(setReservationData(checkoutStripe));
  };

  const closeLoginModal = () => {
    setIsLoginModalVisible(false);
  };

  return (
    // primera fila
    <>
      <Divider />
      <Row>
        <Col className="gutter-row" span={12}>
          <h1 style={style}>{AccommodationById.name}</h1>
          <div style={style2}>{AccommodationById.idLocation?.city}, {AccommodationById.idLocation?.country}</div>
        </Col>
        <Col className="gutter-row" span={12}>
        </Col>
      </Row>

      {/* end primera fila */}

      {/* imagenes */}

      <Row>
        <Col className="gutter-row" span={24}>
          <Carousel className={detailStyles.carouselContainerDetail} arrows>
            {
              AccommodationById?.photos?.map((photo, index) => {
                return (
                  <div key={index} className={detailStyles.carouselSlide}><img src={photo} /></div>
                )
              })
            }
          </Carousel>
        </Col>

        {/* <Col className="gutter-row" span={12}>
            <Row gutter={16} style={{ marginBottom: '15px' }}>
                <Col span={12}>
                <div style={contentStyle2}>
                  <img src={AccommodationById?.photos} alt="Imagen 1" />
                </div>
                </Col>
                <Col span={12}>
                    <div style={contentStyle2}>2 imagen</div>
                </Col>
            </Row>
                
            <Row gutter={16} style={{ marginBottom: '40px' }} >
                <Col span={12}>
                    <div style={contentStyle2}>3 imagen</div>
                </Col>
                <Col span={12}>
                    <div style={contentStyle2}>4 imagen</div>
                </Col>
            </Row>                
          </Col>       */}
      </Row>

      {/* end imagenes */}

      {/* anfitrion */}

      <Row>
        <Col span={16}>
          <div className={detailStyles.detailContent}>
            <Flex justify={"flex-start"} align={"flex-start"}>
              <h1 style={style}>Anfitrion: {ownerFirst} {ownerLast}</h1>

              <Avatar style={{
                backgroundColor: '#231CA7',
              }} size={64} icon={<UserOutlined />} />

            </Flex>
            <div>
              <Flex>
                {
                  AccommodationById?.idServices?.map((service) => {
                    return (
                      <>
                        {service.name === "Habitación" &&
                          <span>▪{service.quantity} habitaciones ▪</span>
                        }
                        {service.name === "Baño" &&
                          <span>{service.quantity} baño</span>
                        }
                      </>
                    )
                  })
                }
              </Flex>
            </div>

            {/* end anfitrion */}

            <Divider />

            <h4 className={detailStyles.detailTitle}>Descripción</h4>
            <p>{AccommodationById.description}</p>

            {/* <span style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginLeft: '26px',marginTop: '26px'  }}>
                <Button type="link" style={{fontWeight: 'bold',fontSize: '17px'}}>Saber Más...</Button>
                <RightOutlined /> 
              </span> */}

            <Divider />

            <h4 className={detailStyles.detailTitle}>¿Qué ofrece este lugar?</h4>
            <Row>
              {
                AccommodationById?.idServices?.map((service, index) => {
                  return (
                    <Col key={index} span={4}>
                      {service.name === "Baño" &&
                        <Flex vertical align={"center"} justify={"center"}>
                          <LiaToiletSolid style={{ fontSize: '3rem', marginBottom: '5px' }} />
                          <p style={{ fontSize: '16px', margin: '0' }}>Baño</p>
                        </Flex>
                      }
                      {service.name === "Cocina" &&
                        <Flex vertical align={"center"} justify={"center"}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <CoffeeOutlined style={{ fontSize: '3rem', marginBottom: '5px' }} />
                            <p style={{ fontSize: '16px', margin: '0' }}>Cocina</p>
                          </div>
                        </Flex>
                      }
                      {service.name === "Espacio de trabajo" &&
                        <Flex vertical align={"center"} justify={"center"}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <LaptopOutlined style={{ fontSize: '3rem', marginBottom: '5px' }} />
                            <p style={{ fontSize: '16px', margin: '0' }}>Espacio de trabajo</p>
                          </div>
                        </Flex>
                      }
                      {service.name === "Espacio de trabajo" &&
                        <Flex vertical align={"center"} justify={"center"}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <GiForkKnifeSpoon style={{ fontSize: '3rem', marginBottom: '5px' }} />
                            <p style={{ fontSize: '16px', margin: '0' }}>Utensilios de cocina</p>
                          </div>
                        </Flex>
                      }
                      {service.name === "Refrigerador" &&
                        <Flex vertical align={"center"} justify={"center"}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <LuRefrigerator style={{ fontSize: '3rem', marginBottom: '5px' }} />
                            <p style={{ fontSize: '16px', margin: '0' }}>Refrigerador</p>
                          </div>
                        </Flex>
                      }
                      {service.name === "Microondas" &&
                        <Flex vertical align={"center"} justify={"center"}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <LuMicrowave style={{ fontSize: '3rem', marginBottom: '5px' }} />
                            <p style={{ fontSize: '16px', margin: '0' }}>Microondas</p>
                          </div>
                        </Flex>
                      }
                      {service.name === "Lavadora" &&
                        <Flex vertical align={"center"} justify={"center"}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <BiSolidWasher style={{ fontSize: '3rem', marginBottom: '5px' }} />
                            <p style={{ fontSize: '16px', margin: '0' }}>Lavadora</p>
                          </div>
                        </Flex>
                      }
                      {service.name === "Secadora" &&
                        <Flex vertical align={"center"} justify={"center"}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <BiSolidDryer style={{ fontSize: '3rem', marginBottom: '5px' }} />
                            <p style={{ fontSize: '16px', margin: '0' }}>Secadora</p>
                          </div>
                        </Flex>
                      }
                      {service.name === "Cochera" &&
                        <Flex vertical align={"center"} justify={"center"}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <CarOutlined style={{ fontSize: '3rem', marginBottom: '5px' }} />
                            <p style={{ fontSize: '16px', margin: '0' }}>Cochera</p>
                          </div>
                        </Flex>
                      }
                      {service.name === "Wifi" &&
                        <Flex vertical align={"center"} justify={"center"}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <WifiOutlined style={{ fontSize: '3rem', marginBottom: '5px' }} />
                            <p style={{ fontSize: '16px', margin: '0' }}>Wifi</p>
                          </div>
                        </Flex>
                      }
                    </Col>
                  )
                })
              }
            </Row>

            <Divider />

            <h4 className={detailStyles.detailTitle}>Ubicación</h4>
            {AccommodationById?.idLocation &&
              <LoadScript googleMapsApiKey="AIzaSyArs06xMpsgYYgUJFVEkngG6e0TZkF0Sus">
                <GoogleMap
                  mapContainerStyle={mapStyle}
                  center={{
                    lat: lat*1,
                    lng: lng*1
                  }}
                  id="map"
                  zoom={14}
                >
                </GoogleMap>
              </LoadScript>
            }

            <Divider />

            <div className={detailStyles.valoration}>
              <h4 className={detailStyles.detailTitle}>Valoración del alojamiento</h4>
              <Flex align={"center"}>
                <Rate disabled value={AccommodationById.rating} />
                <span className={detailStyles.valorationNumber}>{AccommodationById?.rating}</span>
              </Flex>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <Anchor
            className={detailStyles.checkout}
            replace
            items={[
              {
                key: 'reservar',
                href: '#part-1',
                title: (
                  <Card
                    title={
                      <span style={{ fontSize: '26px' }}>
                        {AccommodationById.price} USD
                      </span>
                    }
                    extra={<a href="#">Precio por 30 días</a>}
                    style={{
                      width: 417
                    }}
                  >
                    <RangePicker style={{ display: 'flex', justifyContent: 'space-around' }} size="large" placeholder={['Check-in', 'Check-out']} disabledDate={disabledDate} onChange={onRangeChange} />
                    <InputNumber placeholder={"Huéspedes"} size="large" min={1} max={10} type='number'
                      style={{
                        marginTop: '15px',
                        width: 367,
                      }}
                    />
                    <p></p>
                    <Link to={userId ? '/checkout' : '#'}>
                      <Button
                        type="reserv"
                        block
                        onClick={userId ? handleReservationClick : setIsLoginModalVisible}
                        style={{
                          backgroundColor: 'orange',
                          color: 'black',
                          marginTop: '40px',
                          fontWeight: 'bold',
                          transition: 'background-color 0.3s, color 0.3s', // Agregar transición suave
                        }}
                      >
                        Reservar
                      </Button>
                    </Link>

                    <Divider />

                    <span style={{ fontSize: '20px', justifyContent: 'space-between', display: 'flex' }}>
                      <p>
                        <b>Total a pagar:</b>
                      </p>
                      <p>{total} USD</p>
                    </span>

                  </Card>

                  // end sidebar

                ),
              },
            ]}
          />

          {isLoginModalVisible && (
            <Modal
              className="modalRegister"
              title="Bienvenido a NómadaSuite"
              open={isLoginModalVisible}
              onCancel={closeLoginModal}
              footer={null}
            >
              <Login closeModal={closeLoginModal} />
            </Modal>
          )}

        </Col>
      </Row>
    </>
  )
};

export default AccommodationDetail;