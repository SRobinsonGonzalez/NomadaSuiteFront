import { useState } from "react";
import { Input, Button, Checkbox, Form, Modal, notification } from 'antd';
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import style from "./Login.module.css";
import User from "../RegisterUser/User";
import Welcome from "../Welcome/Welcome";
import { useGoogleLogin } from '@react-oauth/google';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginGoogle, loginUser } from "../../../redux/Actions/actions";

const buttonStyle = {
  background: "#231CA7",
  color: "white",
  height: "3rem",
};

const googleBtnStyle = {
  border: "1px solid black",
  height: "3rem",
};

const Login = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser({
      email: userData.email,
      password: userData.password
    }))
      .then(() => {
        // handleWelcomeClick(true);
        closeModal();
        setShowWelcomeModal(true)
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: `Lo sentimos, ${error.message}`,
          placement: 'bottomLeft'
        });
      })
  };

  const handleChange = (event) => {
    const property = event.target.name;
    const value = event.target.value;
    setUserData({
      ...userData,
      [property]: value
    });
  };

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const handleWelcomeClick = (open) => {
    setShowWelcomeModal(open);
  };

  const handleRememberChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("email", userData.email);
      localStorage.setItem("password", userData.password);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
  };

  const loginGoogleAccount = useGoogleLogin({
    onSuccess: (googleUser) => {
      dispatch(loginGoogle(googleUser))
        .then(() => {
          closeModal();
        })
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe === "true") {
      const email = localStorage.getItem("email") || "";
      setUserData({ email });
    }
  }, []);

  return (
    <div className={style.loginBox}>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        style={{
          maxWidth: "100%",
        }}
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese su email',
            },
          ]}
        >

          {/* Email */}

          <div className={style.emailField}>
            <Input
              name="email"
              value={userData.email}
              type="email"
              onChange={handleChange}
              autoComplete="true"
              placeholder="Correo"
            />
          </div>
        </Form.Item>

        {/* Email end*/}
        {/* Password */}

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese su contraseña',
            },
          ]}
        >
          <div className={style.passwordField}>
            <Input.Password
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Contraseña"
            />
          </div>
        </Form.Item>

        {/* Password end*/}
        {/* Remember */}

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            span: 16,
          }}
        >
          <Checkbox onChange={handleRememberChange}>Recuérdame</Checkbox>
        </Form.Item>

        {/* Remember end*/}

        <span className={style.span}>or</span>
        <hr />

        {/* Login Google */}

        <Form.Item
          wrapperCol={{
            span: 24,
          }}
        >
          <div className={style.googleBtn}>
            <Button
              onClick={loginGoogleAccount}
              style={googleBtnStyle}
              type="submit"
              block
            >
              Continuar con Google
              <FcGoogle className={style.icon} />
            </Button>
          </div>

          {/* Login Google end*/}
          {/* button submit */}

          <div className={style.submitBtn}>
            <Button
              block
              htmlType="submit"
              onClick={handleSubmit}
              style={buttonStyle}
              type="primary"
            >
              Ingresar
            </Button>
          </div>

          {/* button submit */}

        </Form.Item>
        <div className={style.textRegister}>
          <p>¿No tienes una cuenta? <Link onClick={() => setShowRegisterModal(true)}>Regístrate</Link></p>
        </div>
      </Form>
      <Modal
        title="Registro"
        open={showRegisterModal}
        onOk={() => setShowRegisterModal(false)}
        onCancel={() => setShowRegisterModal(false)}
        footer={null}
      >
        <User />
      </Modal>
      <Modal
        className={style.welcome}
        title="Inicio de sesión exitoso."
        open={showWelcomeModal}
        onOk={() => setShowWelcomeModal(false)}
        onCancel={() => setShowWelcomeModal(false)}
        footer={null}
      >
        <Welcome handleWelcomeClick={handleWelcomeClick} />
      </Modal>
    </div>
  )
};

export default Login;