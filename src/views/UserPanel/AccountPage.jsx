import React, { useState, useEffect } from 'react';
import axios from "axios";
import dayjs from 'dayjs';
import moment from "moment";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getUserData } from "../../redux/Actions/actions";
import { updateUserInfo } from "../../redux/Actions/actions";
import style from "../UserPanel/AccountPage.module.css";
import { Button, Form, Input, Card, Flex, DatePicker, Tabs } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Photo from "../UserPanel/Photo/PhotoAcc";
import Reservations from "../UserPanel/Reservations";
import Accommodation from "../UserPanel/Accommodation";

const cardStyle = {
  width: 720,
};

const AccountPage = () => {
  const params = useParams();
  const activeTabParam = params.tab;
  const [formDisabled, setFormDisabled] = useState(true);
  const toggleForm = () => {
    setFormDisabled(!formDisabled);
  };

  const [activeTab, setActiveTab] = useState(activeTabParam);

  const userLoggedInfoFromRedux = useSelector((state) => state.userLogged);

  const [userLoggedInfo, setUserLoggedInfo] = useState({
    firstName: "",
    lastName: "",
    password: "",
    birthdate: moment(userLoggedInfoFromRedux.birthdate).format("YYYY-MM-DD"),
  });


  const userId=userLoggedInfoFromRedux._id;
  const userImage=userLoggedInfoFromRedux.profileImage;


  const handleUpdateUserInfo = async () => {
    // Realiza una solicitud PUT para actualizar el nombre y apellido del usuario
    await axios.put(`/user/update/${userId}`, {
      firstName: userLoggedInfo.firstName,
      lastName: userLoggedInfo.lastName,
      password: userLoggedInfo.password,
      birthdate: userLoggedInfo.birthdate,
      })
  };


  useEffect(() => {
    setUserLoggedInfo({
      firstName: userLoggedInfoFromRedux.firstName,
      lastName: userLoggedInfoFromRedux.lastName,
      password: userLoggedInfoFromRedux.password,
      birthdate: moment(userLoggedInfoFromRedux.birthdate).format("YYYY-MM-DD"),
    });
  }, [userLoggedInfoFromRedux]);

  useEffect(() => {
    setActiveTab(activeTabParam);
  }, [activeTabParam])

  const calculateAge = (birthdate) => {
    const currentDate = new Date();
    const birthdateDate = new Date(birthdate);
    const age = currentDate.getFullYear() - birthdateDate.getFullYear();
    return age;
  };

  return (
    <>
      <div style={{ marginTop: '50px' }}>
        <Tabs
          defaultActiveKey={activeTab}
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          type="card"
          centered
          size="large"
          tabBarGutter={86}
          items={[
            {
              label: 
              <NavLink 
              to="/account/perfil"
              className={`${activeTab === 'perfil' ? style.activeLabel : style.inactiveLabel}`}><b>Mi Perfil</b></NavLink>,
              key: 'perfil',
              children:
                <Flex style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                  <Card
                    style={cardStyle}
                    bodyStyle={{
                      padding: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <Flex justify="space-between">
                      <Photo userId={userId} userImage={userImage} />
                      <Flex
                        vertical
                        align="flex-end"
                        justify="space-between"
                        style={{
                          padding: 52,
                        }}
                      >
                        <>
                          <Form layout="horizontal">
                            <Form.Item label="">
                              <Input
                                className={style.userinfo}
                                value={userLoggedInfo.firstName}
                                onChange={(e) => {
                                  setUserLoggedInfo({ ...userLoggedInfo, firstName: e.target.value });
                                  
                                }}
                                disabled={formDisabled}
                                placeholder=""
                              />
                            </Form.Item>
                          </Form>
                        </>
                        <>
                          <Form layout="horizontal">
                            <Form.Item label="">
                              <Input
                                className={style.userinfo}
                                value={userLoggedInfo.lastName}
                                onChange={(e) => {
                                  setUserLoggedInfo({ ...userLoggedInfo, lastName: e.target.value });
                                }}
                                disabled={formDisabled}
                                placeholder=""
                              />
                            </Form.Item>
                          </Form>
                        </>
                        <>
                        {!userLoggedInfoFromRedux.googleId && (
                          <Form layout="horizontal">
                            <Form.Item label="">                            
                            <Input.Password
                              className={style.userinfo}
                              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                              value={userLoggedInfo.password}
                              onChange={(e) => {
                                if (!formDisabled) {
                                  setUserLoggedInfo({ ...userLoggedInfo, password: e.target.value });
                                }
                              }}
                              onClick={() => {
                                if (!formDisabled) {
                                  setUserLoggedInfo({ ...userLoggedInfo, password: '' }); // Establecer el campo de contraseña a una cadena vacía al hacer clic
                                }
                              }}
                              disabled={formDisabled}
                              placeholder="Password"
                            />
                            </Form.Item>
                          </Form>
                          )}
                        </>
                        
                        <>
                        <Form layout="horizontal">
                          <Form.Item label="">
                            <DatePicker
                              className={style.userinfo}
                              disabled={formDisabled}
                              value={userLoggedInfo.birthdate ? dayjs(userLoggedInfo.birthdate,"YYYY-MM-DD") : null}
                              onChange={(date, dateString) => {
                                setUserLoggedInfo({ ...userLoggedInfo, birthdate: dateString });
                              }}
                              disabledDate={(current) => {
                                // Deshabilitar fechas donde la edad sea menor que 18 años
                                return calculateAge(current) < 18;
                              }}
                              placeholder=''
                            />
                          </Form.Item>
                        </Form>
                        </>
                        <>
                          <Form layout="horizontal">
                            <Form.Item label="">
                              <Input
                                className={style.userinfo}
                                defaultValue="Email"
                                value={userLoggedInfoFromRedux.email}
                                disabled={true}
                                placeholder=""
                              />
                            </Form.Item>
                          </Form>
                        </>
                        <Button onClick={() => { handleUpdateUserInfo(); toggleForm(); }}>
                          {formDisabled ? 'Editar Datos' : 'Aceptar Cambios'}
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                </Flex>
            },
            {
              label: 
              <NavLink
              to="/account/reservaciones"
              className={`${activeTab === 'reservaciones' ? style.activeLabel : style.inactiveLabel}`}><b>Mis Reservaciones</b></NavLink>,
              key: 'reservaciones',
              children:
                <div style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Reservations userId={userId} />
                </div>
            },
            {
              label: 
              <NavLink
              to="/account/accommodations"
              className={`${activeTab === 'accommodations' ? style.activeLabel : style.inactiveLabel}`}><b>Mis Alojamientos</b></NavLink>,
              key: 'accommodations',
              children:
                <div style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Accommodation userId={userId} />
                </div>
            },
          ]}
        />
      </div>
    </>
  );
};

export default AccountPage;
