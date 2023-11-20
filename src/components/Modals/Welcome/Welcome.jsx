import React from 'react';
import { Button } from 'antd';
import style from "./Welcome.module.css"

const buttonStyle = {
  background: "#231CA7",
  color: "white",
  height: "3rem",
};

const Welcome = ({ handleWelcomeClick }) => {
  
  return (
    <div>
      <div className={style.modalBox}>
        <hr />
        <img className={style.icon} src='https://nomadasuitefront-production-cf39.up.railway.app/assets/logo-68e4d767.png' />
        <p className={style.welcomeText}>Bienvenido a NómadaSuite</p>
        <p>Descubre lugares donde quedarte y trabajar desde cualquier parte del mundo.</p>

        <div className={style.submitBtn}>
          <Button
            block style={buttonStyle}
            type="primary"
            onClick={() => handleWelcomeClick(false)}
          >
            Ingresar
          </Button>
        </div>

      </div>
    </div>
  )
};

export default Welcome;