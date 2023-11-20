import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, Switch, notification } from 'antd';
import { FcGoogle } from "react-icons/fc";
import Photo from '../Photo/Photo';
import axios from 'axios';
import style from "./User.module.css";
import { useDispatch } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { loginGoogle } from '../../../redux/Actions/actions';

const buttonStyle = {
  background: "#231CA7",
  color: "white",
  height: "3rem",
};

const googleBtnStyle = {
  border: "1px solid black",
  height: "3rem",
};

const User = ({ closeUserModal }) => {

  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [showPhotoUser, setShowPhotoUser] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const [formUser, setFormUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthdate: '',
    wantsNotifications: true
  });

  const handleChange = (event) => {
    const property = event.target.name;
    const value = event.target.value;
    setFormUser({
      ...formUser,
      [property]: value
    });
  };

  const handleDateChange = (date, dateString) => {
    setFormUser({
      ...formUser,
      birthdate: dateString
    });
  };

  const handleSubmit = async () => {
    const currentDate = new Date();
    const birthdate = new Date(formUser.birthdate);
    const age = currentDate.getFullYear() - birthdate.getFullYear();
    if (formUser.firstName && formUser.lastName && formUser.email && formUser.password && formUser.password === formUser.confirm && age >= 18) {
      try {
        const response = await axios.post('/user/register', {
          firstName: formUser.firstName,
          lastName: formUser.lastName,
          email: formUser.email,
          password: formUser.password,
          birthdate: formUser.birthdate,
          wantsNotifications: notifications
        });
        const data = response.data.userId
        setUserId(data)
        setShowPhotoUser(true);
        notification.success({
          message: '¡Excelente!',
          description: 'El registro de usuario se realizó con éxito.',
          placement: 'bottomLeft'
        });
        const name = response.data.user.firstName + " " + response.data.user.lastName;
        axios.post(`/email`, {
            to: response.data.user.email,
            subject: "Registro exitoso en NómadaSuite",
            html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings></xml><![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta name="x-apple-disable-message-reformatting"> <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--> <title></title> <style type="text/css"> @media only screen and (min-width: 620px) { .u-row { width: 600px !important; } .u-row .u-col { vertical-align: top; } .u-row .u-col-100 { width: 600px !important; }}@media (max-width: 620px) { .u-row-container { max-width: 100% !important; padding-left: 0px !important; padding-right: 0px !important; } .u-row .u-col { min-width: 320px !important; max-width: 100% !important; display: block !important; } .u-row { width: 100% !important; } .u-col { width: 100% !important; } .u-col > div { margin: 0 auto; }}body { margin: 0; padding: 0;}table,tr,td { vertical-align: top; border-collapse: collapse;}p { margin: 0;}.ie-container table,.mso-container table { table-layout: fixed;}* { line-height: inherit;}a[x-apple-data-detectors='true'] { color: inherit !important; text-decoration: none !important;}table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_heading_1 .v-container-padding-padding { padding: 8px 20px 0px !important; } #u_content_heading_1 .v-font-size { font-size: 21px !important; } #u_content_heading_1 .v-text-align { text-align: center !important; } #u_content_text_2 .v-container-padding-padding { padding: 35px 15px 10px !important; } #u_content_text_3 .v-container-padding-padding { padding: 10px 15px 40px !important; } } </style> <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]--></head><body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #c2e0f4;color: #000000"> <!--[if IE]><div class="ie-container"><![endif]--> <!--[if mso]><div class="mso-container"><![endif]--> <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #dadeea;width:100%" cellpadding="0" cellspacing="0"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #c2e0f4;"><![endif]--> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]--> <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="height: 100%;width: 100% !important;"> <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]--> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left"> <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 6px solid #7e8c8d;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td> </tr> </tbody> </table> </td> </tr> </tbody></table> <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--> </div></div><!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]--> <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]--> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center"> <img align="center" border="0" src="https://nomadasuitefront-production-cf39.up.railway.app/assets/banner-81eb9417.png" alt="Banner" title="Banner" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 600px;" width="600"/> </td> </tr></table> </td> </tr> </tbody></table><table id="u_content_heading_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:25px 30px 25px 31px;font-family:arial,helvetica,sans-serif;" align="left"> <h1 class="v-text-align v-font-size" style="margin: 0px; color: #023047; line-height: 170%; text-align: center; word-wrap: break-word; font-family: 'Open Sans',sans-serif; font-size: 26px; font-weight: 400;"><div><p><span style="text-decoration: underline;"><strong>¡Gracias por registrarte!</strong></span></p></div></h1> </td> </tr> </tbody></table> <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--> </div></div><!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]--> <!--[if (mso)|(IE)]><td align="center" width="598" style="width: 598px;padding: 0px;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]--> <table id="u_content_text_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:35px 55px 10px;font-family:arial,helvetica,sans-serif;" align="left"> <div class="v-text-align v-font-size" style="font-size: 14px; color: #333333; line-height: 180%; text-align: left; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 18px; line-height: 32.4px; font-family: Lato, sans-serif;"><strong><span style="line-height: 32.4px; font-size: 18px;">Hola ${name}, </span></strong></span></p><p style="font-size: 14px; line-height: 180%;"> </p><p style="font-size: 14px; line-height: 180%;"><span style="color: #000000; font-family: Lato, sans-serif; line-height: 28.8px; font-size: 16px;">Te damos la bienvenida a NómadaSuite. Tu cuenta ya se encuentra activa, ahora puedes reservar un alojamiento en cualquier parte de Latinoamérica.</span></p> </div> </td> </tr> </tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 30px;font-family:arial,helvetica,sans-serif;" align="left"> <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]--><div class="v-text-align" align="center"> <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://unlayer.com" style="height:47px; v-text-anchor:middle; width:183px;" arcsize="93.5%" strokecolor="#231ca7" strokeweight="2px" fillcolor="#ffffff"><w:anchorlock/><center style="color:#231ca7;"><![endif]--> <a href="https://nomadasuitefront-production-cf39.up.railway.app/" target="_blank" class="v-button v-font-size" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #231ca7; background-color: #ffffff; border-radius: 44px;-webkit-border-radius: 44px; -moz-border-radius: 44px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-width: 2px; border-top-style: solid; border-top-color: #231ca7; border-left-width: 2px; border-left-style: solid; border-left-color: #231ca7; border-right-width: 2px; border-right-style: solid; border-right-color: #231ca7; border-bottom-width: 2px; border-bottom-style: solid; border-bottom-color: #231ca7;font-size: 14px;"> <span style="display:block;padding:15px 50px;line-height:120%;"><strong><span style="font-family: 'Open Sans', sans-serif; font-size: 14px; line-height: 16.8px;">IR A LA WEB</span></strong></span> </a> <!--[if mso]></center></v:roundrect><![endif]--></div> </td> </tr> </tbody></table><table id="u_content_text_3" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px 40px;font-family:arial,helvetica,sans-serif;" align="left"> <div class="v-text-align v-font-size" style="font-size: 14px; line-height: 170%; text-align: left; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 170%;"> </p><p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 16px; line-height: 27.2px;">Saludos,</span></p><p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 23.8px;"><strong><span style="font-size: 16px; line-height: 27.2px;">Equipo de NómadaSuite</span></strong></span></p> </div> </td> </tr> </tbody></table> <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--> </div></div><!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]--> <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]--> <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--> </div></div><!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #424250;"> <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #424250;"><![endif]--> <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]--> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:42px 10px 15px;font-family:arial,helvetica,sans-serif;" align="left"> <div align="center"> <div style="display: table; max-width:134px;"> <!--[if (mso)|(IE)]><table width="134" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:134px;"><tr><![endif]--> <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 13px;" valign="top"><![endif]--> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 13px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://instagram.com/" title="Instagram" target="_blank"> <img src="https://cdn.tools.unlayer.com/social/icons/circle-white/instagram.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> </td></tr> </tbody></table> <!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 13px;" valign="top"><![endif]--> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 13px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://youtube.com/" title="YouTube" target="_blank"> <img src="https://cdn.tools.unlayer.com/social/icons/circle-white/youtube.png" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> </td></tr> </tbody></table> <!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]--> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://email.com/" title="Email" target="_blank"> <img src="https://cdn.tools.unlayer.com/social/icons/circle-white/email.png" alt="Email" title="Email" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> </td></tr> </tbody></table> <!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div></div> </td> </tr> </tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 35px;font-family:arial,helvetica,sans-serif;" align="left"> <div class="v-text-align v-font-size" style="font-size: 14px; color: #ffffff; line-height: 210%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 210%;"><span style="font-family: Lato, sans-serif; line-height: 29.4px;">Copyrights © Todos los derechos reservados</span></p> </div> </td> </tr> </tbody></table> <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--> </div></div><!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div> </div> </div> <!--[if (mso)|(IE)]></td></tr></table><![endif]--> </td> </tr> </tbody> </table> <!--[if mso]></div><![endif]--> <!--[if IE]></div><![endif]--></body></html>`
          }
        );
      } catch (error) {
        notification.error({
          message: 'Error',
          description: `Lo sentimos, ${(error.response.data.error).toLowerCase()}.`,
          placement: 'bottomLeft'
        })
      }
    }
  };

  const loginGoogleAccount = useGoogleLogin({
    onSuccess: (googleUser) => {
      dispatch(loginGoogle(googleUser))
        .then(() => {
          closeUserModal()
        })
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  return (
    <div>
      <Form
        name="user"
        onFinish={handleSubmit}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        style={{
          maxWidth: "100%",
        }}
      >

        {/* FirstName */}

        <Form.Item
          name="firstName"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese su nombre',
            },
          ]}
        >
          <div className={style.nameField}>
            <Input
              name="firstName"
              value={formUser.firstName}
              type="text"
              onChange={handleChange}
              autoComplete="true"
              placeholder="Nombres"
            />
          </div>
        </Form.Item>

        {/* FirstName end*/}
        {/* LastName */}

        <Form.Item
          name="lastName"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese sus apellidos',
            },
          ]}
        >
          <div className={style.lastnameField}>
            <Input
              name="lastName"
              value={formUser.lastName}
              type="text"
              onChange={handleChange}
              autoComplete="true"
              placeholder="Apellidos"
            />
          </div>
        </Form.Item>

        {/* LastName end*/}

        <div className={style.ageField}>
          <p>Para registrarte, debes tener al menos 18 años. Tu fecha de nacimiento no se compartirá con otras personas que utilicen nuestra app.</p>
        </div>

        {/* Birthdate */}

        <Form.Item name="date-picker"
          rules={[{
            required: true,
            message: "La fecha de nacimiento es obligatoria."
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              const currentDate = new Date();
              const age = currentDate.getFullYear() - new Date(value).getFullYear();
              if (age < 18) {
                return Promise.reject(new Error('Debes ser mayor de 18 años para registrarte.'));
              }
              return Promise.resolve();
            },
          }),
          ]}
        >
          <DatePicker
            className={style.datePicker}
            onChange={(date, dateString) => handleDateChange(date, dateString)}
            placeholder='Fecha de nacimiento'
          />
        </Form.Item>

        {/* Birthdate end*/}
        {/* Email */}

        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'La información no es válida',
            },
            {
              required: true,
              message: 'Por favor ingrese su email',
            },
          ]}
        >
          <div className={style.emailField}>
            <Input
              autoComplete="true"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              value={formUser.email}
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
            {
              min: 6,
              max: 15,
              message: 'La contraseña debe tener entre 6 y 15 caracteres',
            },
            {
              pattern: /^(?=.*[0-9]).*$/,
              message: 'La contraseña debe contener al menos un número',
            },
            {
              pattern: /^(?=.*[A-Z]).*$/,
              message: 'La contraseña debe contener al menos una letra mayúscula',
            },
            {
              pattern: /^(?=.*[.!@#$%^&*]).*$/,
              message: 'La contraseña debe contener al menos un carácter especial (por ejemplo: !@#$%^&*)',
            },
          ]}
          hasFeedback
        >
          <div className={style.passwordField}>
            <Input.Password
              name="password"
              onChange={handleChange}
              placeholder="Contraseña"
              value={formUser.password}
            />
          </div>
        </Form.Item>

        {/* Password end*/}
        {/* Confirm password */}

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Confirmar contraseña',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('La contraseña no coincide'));
              },
            }),
          ]}
        >
          <div className={style.passwordField}>
            <Input.Password
              name="confirm"
              onChange={handleChange}
              value={formUser.confirm}
              placeholder='Confirmar contraseña'
            />
          </div>
        </Form.Item>

        {/* Confirm password end*/}
        {/* Notifications */}

        <div className={style.notification}>
          <p>¿Desea recibir notificaciones?</p>
          <Switch
            checked={notifications}
            checkedChildren="Si"
            unCheckedChildren="No"
            onChange={(value) => {
              setNotifications(value);
            }}
          />
        </div>

        {/* Notifications end*/}
        {/* Button submit */}

        <Form.Item
          wrapperCol={{
            span: 24,
          }}
        >
          <div className={style.submitBtn}>
            <Button
              block
              htmlType="submit"
              style={buttonStyle}
              type="primary"
            >
              Registrarse
            </Button>
          </div>

          {/* Button submit end */}
          {/* Google */}

          <div className={style.googleBtn}>
            <Button
              onClick={loginGoogleAccount}
              style={googleBtnStyle}
              type="submit"
              block
            >
              Regístrate con Google
              <FcGoogle className={style.icon} />
            </Button>
          </div>
        </Form.Item>

        {/* Google end*/}

      </Form>

      <Photo showPhoto={showPhotoUser} userId={userId} closeUserModal={closeUserModal} />

    </div>
  )
};

export default User;