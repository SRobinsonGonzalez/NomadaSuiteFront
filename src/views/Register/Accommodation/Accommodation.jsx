import { getCities, getCountries, getServices } from "../../../redux/Actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Select, Upload, notification } from "antd";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { PlusOutlined } from "@ant-design/icons";
import style from "./Accommodation.module.css"
import axios from "axios";
import Login from "../../../components/Modals/Login/Login";

const { TextArea } = Input;

const buttonStyle = {
  background: "#231CA7",
  color: "white",
  height: "3rem",
  width: "160%"
};

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const containerStyle = {
  width: '100%',
  height: '315px'
};

const center = {
  lat: -38.158,
  lng: -63.107
};

const Accommodation = () => {

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [servicesGroup, setServicesGroup] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const countries = useSelector((state) => state.countries);
  const services = useSelector((state) => state.services);
  const cities = useSelector((state) => state.cities);
  const user = useSelector((state) => state.userLogged);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    services: [],
    country: "",
    city: "",
    address: "",
    zipCode: "",
    description: "",
    price: 0,
    coordinates: ""
  });

  useEffect(() => {
    dispatch(getServices());
    dispatch(getCountries());
  }, []);

  const handleFormChange = (field, value) => {
    if (field === "bedroom" || field === "bathroom") {
      setFormData({
        ...formData,
        services: [...formData.services, value]
      });
    } else {
      if (field === "services") {
        const services = formData.services.filter(service => !servicesGroup.includes(service));
        setServicesGroup(value);
        setFormData({
          ...formData,
          services: [...services, ...value]
        });
      } else {
        setFormData({
          ...formData,
          [field]: value
        });
      }
      if (field === "country") {
        dispatch(getCities(value));
      }
    }
  };

  // Images
  const props = {
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // GoogleMaps
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    lat: 0,
    lng: 0,
  });

  const handleMapClick = (event) => {
    const coordinates = `${event.latLng.lat()}, ${event.latLng.lng()}`
    setFormData({
      ...formData,
      coordinates: coordinates
    })
    setSelectedCoordinates({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleFormSubmit = async (values) => {
    var form = document.querySelector('form');
    let formDataToSend = new FormData(form);
    formDataToSend.append("name", values.name);
    formDataToSend.append("ownerId", user._id);
    if (formData.services.length > 0) {
      formData.services.forEach((service) => {
        formDataToSend.append("services", service);
      })
    }
    formDataToSend.append("country", values.country);
    formDataToSend.append("city", values.city);
    formDataToSend.append("address", values.address);
    formDataToSend.append("zipCode", values.zipCode);
    formDataToSend.append("description", values.description);
    formDataToSend.append("price", values.price);
    formDataToSend.append("coordinates", formData.coordinates);
    if (values.image.length > 0) {
      values.image.forEach((image) => {
        formDataToSend.append("images", image.originFileObj);
      })
    }
    if (Object.keys(user).length === 0) {
      setIsLoginModalVisible(true)
    } else {
      try {
        const response = await axios.post('/accommodation/create', formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        notification.success({
          message: 'Hemos recibido tu formulario.',
          description: 'Estamos en proceso de revisión.',
          placement: 'bottomLeft'
        });
        const userName = user.firstName + " " + user.lastName;
        axios.post(`/email`, {
          to: user.email,
          subject: "Registro exitoso de alojamiento en NómadaSuite",
          html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings></xml><![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta name="x-apple-disable-message-reformatting"> <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--> <title></title> <style type="text/css"> @media only screen and (min-width: 620px) { .u-row { width: 600px !important; } .u-row .u-col { vertical-align: top; } .u-row .u-col-100 { width: 600px !important; }}@media (max-width: 620px) { .u-row-container { max-width: 100% !important; padding-left: 0px !important; padding-right: 0px !important; } .u-row .u-col { min-width: 320px !important; max-width: 100% !important; display: block !important; } .u-row { width: 100% !important; } .u-col { width: 100% !important; } .u-col > div { margin: 0 auto; }}body { margin: 0; padding: 0;}table,tr,td { vertical-align: top; border-collapse: collapse;}p { margin: 0;}.ie-container table,.mso-container table { table-layout: fixed;}* { line-height: inherit;}a[x-apple-data-detectors='true'] { color: inherit !important; text-decoration: none !important;}table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_heading_1 .v-container-padding-padding { padding: 8px 20px 0px !important; } #u_content_heading_1 .v-font-size { font-size: 21px !important; } #u_content_heading_1 .v-text-align { text-align: center !important; } #u_content_text_2 .v-container-padding-padding { padding: 35px 15px 10px !important; } #u_content_text_5 .v-container-padding-padding { padding: 35px 15px 10px !important; } #u_content_text_3 .v-container-padding-padding { padding: 10px 15px 40px !important; } } </style> <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]--></head><body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #c2e0f4;color: #000000"> <!--[if IE]><div class="ie-container"><![endif]--> <!--[if mso]><div class="mso-container"><![endif]--> <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #c2e0f4;width:100%" cellpadding="0" cellspacing="0"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #c2e0f4;"><![endif]--> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]--> <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="height: 100%;width: 100% !important;"> <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]--> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left"> <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 6px solid #7e8c8d;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td> </tr> </tbody> </table> </td> </tr> </tbody></table> <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--> </div></div><!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]--> <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]--> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center"> <img align="center" border="0" src="https://nomadasuitefront-production-cf39.up.railway.app/assets/banner-81eb9417.png" alt="Banner" title="Banner" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 600px;" width="600"/> </td> </tr></table> </td> </tr> </tbody></table><table id="u_content_heading_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:25px 30px 30px 31px;font-family:arial,helvetica,sans-serif;" align="left"> <h1 class="v-text-align v-font-size" style="margin: 0px; color: #023047; line-height: 170%; text-align: center; word-wrap: break-word; font-family: 'Open Sans',sans-serif; font-size: 26px; font-weight: 400;"><div><p><span style="text-decoration: underline;"><strong>¡Gracias por registrar tu alojamiento!</strong></span></p></div></h1> </td> </tr> </tbody></table> <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--> </div></div><!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]--> <!--[if (mso)|(IE)]><td align="center" width="598" style="width: 598px;padding: 15px 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 15px 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]--> <table id="u_content_text_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:25px 55px 10px;font-family:arial,helvetica,sans-serif;" align="left"> <div class="v-text-align v-font-size" style="font-size: 14px; color: #333333; line-height: 180%; text-align: left; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 18px; line-height: 32.4px; font-family: Lato, sans-serif;"><strong><span style="line-height: 32.4px; font-size: 18px;">Hola ${userName}, </span></strong></span></p><p style="font-size: 14px; line-height: 180%;"> </p><p style="font-size: 14px; line-height: 180%;"><span style="font-family: Lato, sans-serif; line-height: 28.8px; font-size: 16px;">Estamos evaluando tu solicitud para publicar tu alojamiento en NómadaSuite, te notificaremos una vez haya sido aprobada tu publicación.</span><span style="font-family: Lato, sans-serif; line-height: 28.8px; font-size: 16px;"></span></p> </div> </td> </tr> </tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:15px 55px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center"> <img align="center" border="0" src=${response.data.photos[0]} alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 490px;" width="490"/> </td> </tr></table> </td> </tr> </tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px;font-family:arial,helvetica,sans-serif;" align="left"> <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td> </tr> </tbody> </table> </td> </tr> </tbody></table><table id="u_content_text_5" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 55px;font-family:arial,helvetica,sans-serif;" align="left"> <div class="v-text-align v-font-size" style="font-size: 14px; color: #333333; line-height: 180%; text-align: left; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 180%;"><span style="font-family: Lato, sans-serif; line-height: 28.8px; font-size: 16px;"><strong>Nombre: </strong>${response.data.name}</span></p><p style="font-size: 14px; line-height: 180%;"><strong><span style="font-family: Lato, sans-serif; line-height: 28.8px; font-size: 16px;">Ubicación: </span></strong><span style="font-family: Lato, sans-serif; line-height: 28.8px; font-size: 16px;">${response.data.city}, ${response.data.country}<br /><strong>Descripción: </strong>${response.data.description}</span></p> </div> </td> </tr> </tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px;font-family:arial,helvetica,sans-serif;" align="left"> <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td> </tr> </tbody> </table> </td> </tr> </tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 30px;font-family:arial,helvetica,sans-serif;" align="left"> <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]--><div class="v-text-align" align="center"> <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://nomadasuitefront-production-cf39.up.railway.app/" style="height:47px; v-text-anchor:middle; width:239px;" arcsize="93.5%" strokecolor="#231ca7" strokeweight="2px" fillcolor="#ffffff"><w:anchorlock/><center style="color:#231ca7;"><![endif]--> <a href="https://nomadasuitefront-production-cf39.up.railway.app/" target="_blank" class="v-button v-font-size" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #231ca7; background-color: #ffffff; border-radius: 44px;-webkit-border-radius: 44px; -moz-border-radius: 44px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-width: 2px; border-top-style: solid; border-top-color: #231ca7; border-left-width: 2px; border-left-style: solid; border-left-color: #231ca7; border-right-width: 2px; border-right-style: solid; border-right-color: #231ca7; border-bottom-width: 2px; border-bottom-style: solid; border-bottom-color: #231ca7;font-size: 14px;"> <span style="display:block;padding:15px 50px;line-height:120%;"><strong><span style="font-family: 'Open Sans', sans-serif; font-size: 14px; line-height: 16.8px;">IR A NÓMADASUITE</span></strong></span> </a> <!--[if mso]></center></v:roundrect><![endif]--></div> </td> </tr> </tbody></table><table id="u_content_text_3" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px 40px;font-family:arial,helvetica,sans-serif;" align="left"> <div class="v-text-align v-font-size" style="font-size: 14px; line-height: 170%; text-align: left; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 170%;"> </p><p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 16px; line-height: 27.2px;">Saludos,</span></p><p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 23.8px;"><strong><span style="font-size: 16px; line-height: 27.2px;">Equipo de NómadaSuite</span></strong></span></p> </div> </td> </tr> </tbody></table> <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--> </div></div><!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]--> <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]--> <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--> </div></div><!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #424250;"> <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"> <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #424250;"><![endif]--> <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]--> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:42px 10px 15px;font-family:arial,helvetica,sans-serif;" align="left"> <div align="center"> <div style="display: table; max-width:134px;"> <!--[if (mso)|(IE)]><table width="134" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:134px;"><tr><![endif]--> <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 13px;" valign="top"><![endif]--> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 13px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://instagram.com/" title="Instagram" target="_blank"> <img src="https://cdn.tools.unlayer.com/social/icons/circle-white/instagram.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> </td></tr> </tbody></table> <!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 13px;" valign="top"><![endif]--> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 13px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://youtube.com/" title="YouTube" target="_blank"> <img src="https://cdn.tools.unlayer.com/social/icons/circle-white/youtube.png" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> </td></tr> </tbody></table> <!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]--> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://email.com/" title="Email" target="_blank"> <img src="https://cdn.tools.unlayer.com/social/icons/circle-white/email.png" alt="Email" title="Email" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> </td></tr> </tbody></table> <!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div></div> </td> </tr> </tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 35px;font-family:arial,helvetica,sans-serif;" align="left"> <div class="v-text-align v-font-size" style="font-size: 14px; color: #ffffff; line-height: 210%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 210%;"><span style="font-family: Lato, sans-serif; line-height: 29.4px;">Copyrights © Todos los derechos reservados</span></p> </div> </td> </tr> </tbody></table> <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--> </div></div><!--[if (mso)|(IE)]></td><![endif]--> <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--> </div> </div> </div> <!--[if (mso)|(IE)]></td></tr></table><![endif]--> </td> </tr> </tbody> </table> <!--[if mso]></div><![endif]--> <!--[if IE]></div><![endif]--></body></html>`
        })
      } catch (error) {
        notification.error({
          message: 'Lo sentimos.',
          description: 'el registro no se ha completado.',
          placement: 'bottomLeft'
        });
      }
    }
  }

  const closeLoginModal = () => {
    setIsLoginModalVisible(false);
  };

  return (
    <div className={style.Accommodation}>
      <div className={style.accommodationBox}>
        <Form
          name="form"
          onFinish={handleFormSubmit}
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          layout="horizontal"
          style={{
            maxWidth: "100%",
          }}
        >

          <Row gutter={50}>
            <Col span={12}>
              {/* Accommodation Name */}

              <div>
                <Form.Item
                  label="Nombre"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor ingrese su nombre',
                    },
                  ]}
                >
                  <Input
                    type="text"
                    autoComplete="true"
                    value={formData.name}
                    onChange={(event) => handleFormChange("name", event.target.value)}
                  />
                </Form.Item>
              </div>

              {/* Accommodation Name end */}
              {/* Services */}

              <hr />
              <h1>Servicios</h1>

              <Row>
                <Col span={12}>
                  <Form.Item
                    label="Habitaciones: "
                    name="bedroom"
                    rules={[
                      {
                        required: true,
                        message: 'Por favor ingrese la cantidad de habitaciones de su alojamiento',
                      },
                    ]}
                    labelCol={{ span: 10 }}
                  >
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Cantidad"
                      value={formData.bedroom}
                      onChange={(value) => handleFormChange("bedroom", value)}
                    >
                      {services.filter((service) => service.name === 'Habitación')
                        .map((service) => (
                          <Select.Option
                            key={service._id}
                            value={service._id}
                          >
                            {`${service.quantity}`}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Baños: "
                    name="bathroom"
                    labelCol={{ span: 10 }}
                  >
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Cantidad"
                      value={formData.bathroom}
                      onChange={(value) => handleFormChange("bathroom", value)}
                    >
                      {services
                        .filter((service) => service.name === 'Baño')
                        .map((service) => (
                          <Select.Option
                            key={service._id}
                            value={service._id}
                          >
                            {`${service.quantity}`}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="services">
                <Checkbox.Group
                  style={{
                    width: '175%',
                  }}
                  value={formData.services}
                  onChange={(value) => handleFormChange("services", value)}
                >
                  <Row>
                    {services
                      .filter((service) => service.name !== 'Habitación' && service.name !== 'Baño')
                      .map((service) => (
                        <Col span={8} key={service._id}>
                          <Checkbox value={service._id}>{service.name}</Checkbox>
                        </Col>
                      ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              <hr />

              {/* Services end */}
              {/* Photos */}

              <Form.Item
                label="Fotos"
                name='image'
                valuePropName="fileList"
                getValueFromEvent={normFile}
                wrapperCol={{
                  span: 20,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese una imagen',
                  },
                ]}
              >
                <Upload
                  {...props}
                  accept="image/*"
                  fileList={fileList}
                  listType="picture-card"
                  onPreview={handlePreview}
                  type="file"
                >
                  <div>
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </div>
                </Upload>
              </Form.Item>
              <hr />
              <Modal
                footer={null}
                onCancel={handleCancel}
                open={previewOpen}
              >
                <img
                  alt="example"
                  style={{
                    width: '100%',
                  }}
                  src={previewImage}
                />
              </Modal>

              {/* Photos end */}
              {/* Country */}

              <Form.Item
                label="País"
                name="country"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese un país',
                  },
                ]}
              >
                <Select
                  placeholder="Selecciona el país"
                  onChange={(value) => handleFormChange("country", value)}
                  value={formData.country}
                >
                  {countries.map((country) => (
                    <Select.Option
                      key={country.country_name}
                      value={country.country_name}
                    >
                      {`${country.country_name}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Country end */}
              {/* City */}

              <Form.Item
                label="Ciudad"
                name="city"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese la ciudad',
                  },
                ]}
              >
                <Select
                  placeholder="Selecciona la ciudad"
                  value={formData.city}
                  onChange={(value) => handleFormChange("city", value)}
                >
                  {cities.map((country) => (
                    <Select.Option
                      key={country.state_name}
                      value={country.state_name}
                    >
                      {`${country.state_name}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* City end */}
              {/* Address */}

              <Form.Item
                label="Dirección"
                name="address"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese una dirección',
                  },
                ]}
              >
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(event) => handleFormChange("address", event.target.value)}
                />
              </Form.Item>

              {/* Address end */}
            </Col>
            <Col span={12}>
              {/* Zip Code */}

              <Form.Item
                label="Código Postal"
                name="zipCode"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese el código postal',
                  },
                ]}
              >
                <Input
                  value={formData.zipCode}
                  onChange={(event) => handleFormChange("zipCode", event.target.value.replace(/\D/g, ''))}
                />
              </Form.Item>
              <hr />

              {/* Zip Code end */}
              {/* GoogleMaps */}

              <div className={style.map}>
                <LoadScript
                  googleMapsApiKey="AIzaSyArs06xMpsgYYgUJFVEkngG6e0TZkF0Sus"
                  name="coordinates"
                >
                  <GoogleMap
                    name="coordinates"
                    mapContainerStyle={containerStyle}
                    center={center}
                    id="map"
                    zoom={5}
                    onClick={handleMapClick}
                  >
                    <Marker position={selectedCoordinates} />
                  </GoogleMap>
                </LoadScript>
              </div>
              <hr />

              {/* GoogleMaps end */}
              {/* Description */}

              <Form.Item
                label="Despripción"
                name="description"
              >
                <TextArea
                  rows={4}
                  value={formData.description}
                  onChange={(event) => handleFormChange("description", event.target.value)}
                  placeholder="En este espacio, puedes proporcionar no solo una descripción de tu alojamiento, sino también información detallada sobre los servicios que ofreces y/o condiciones."
                />
              </Form.Item>

              {/* Description end */}
              {/* Price */}

              <Form.Item
                label="Precio"
                name="price"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese un valor',
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  min={5}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  step="0.01"
                  value={formData.price}
                  onChange={(value) => handleFormChange("price", value)}
                />
              </Form.Item>

              {/* Price end */}

              <Form.Item>
                <Button
                  block
                  htmlType="submit"
                  style={buttonStyle}
                  type="primary"
                >
                  Registrar
                </Button>
              </Form.Item>

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
        </Form >
      </div >
    </div >
  )
};

export default Accommodation;