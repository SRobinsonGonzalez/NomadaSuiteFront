import { deleteAccommodation_A, getAccommodationById_A, getAccommodationPendingConfirmation_A, getActiveAccommodation_A, getDisabledAccommodation_A, getServices, updateAccommodation_A } from '../../../redux/Actions/actions';
import { Button, Space, Table, Input, notification, Tooltip, Modal, Form, Row, Col, Select, Checkbox, Upload, InputNumber, Tag, Switch } from 'antd';
import { EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { MdDomainDisabled } from "react-icons/md";
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineDelete } from "react-icons/ai";
import Highlighter from "react-highlight-words";
import style from "./Accommodation.module.css"

//Description
const { TextArea } = Input;

const buttonStyle = {
  background: "#231CA7",
  color: "white",
  height: "3rem",
  width: "160%"
};

//image
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

const AccommodationAdmin = () => {

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [servicesGroup, setServicesGroup] = useState([]);
  const services = useSelector((state) => state.services);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeAccommodation = useSelector((state) => state.activeAccommodation_A)
  const disabledAccommodation = useSelector((state) => state.disabledAccommodation_A)
  const accommodationPendingConfirmation = useSelector((state) => state.accommodationPendingConfirmation_A)
  const accommodationById = useSelector((state) => state.accommodationById_A)
  console.log(accommodationById);

  const [putAccommodationId, setPutAccommodationId] = useState();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: accommodationById.name,
    services: accommodationById.idServices,
    image: '',
    description: accommodationById.description,
    price: accommodationById.price
  });

  useEffect(() => {
    dispatch(getActiveAccommodation_A());
    dispatch(getAccommodationPendingConfirmation_A());
    dispatch(getDisabledAccommodation_A());
    dispatch(getServices())
    setFormData({
      name: accommodationById.name,
      services: [],
      image: '',
      description: accommodationById.description,
      price: accommodationById.price
    });
  }, [accommodationById]);

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

  const dataActive = activeAccommodation.map((object, index) => {
    return {
      key: object._id,
      id: object._id,
      name: object.name,
      owner: object.ownerId,
      services: object.idServices.map(service => service.name).join(', '),
      photos: <img src={object.photos[0]} style={{ maxWidth: '50px' }} />,
      location: `${object.idLocation.city}, ${object.idLocation.country}`,
      description: object.description,
      price: `$${object.price}`,
      active: <Switch className={style.toggle} defaultChecked={activeAccommodation[index].isActive} onChange={(checked) => handleDesactive(checked, object._id)} />,
      rating: object.rating || 'N/A',
      tags: ["Activo"],
    };
  });
  const dataPending = accommodationPendingConfirmation.map((object, index) => {
    return {
      key: object._id,
      id: object._id,
      name: object.name,
      owner: object.ownerId,
      services: object.idServices.map(service => service.name).join(', '),
      photos: <img src={object.photos[0]} style={{ maxWidth: '50px' }} />,
      location: `${object.idLocation.city}, ${object.idLocation.country}`,
      description: object.description,
      price: `$${object.price}`,
      active: <Switch className={style.toggle} defaultChecked={accommodationPendingConfirmation[index].isActive} onChange={(checked) => handleActive(checked, object._id)} />,
      rating: object.rating || 'N/A',
      tags: ["Pendiente"],
    };
  });

  const dataDisabled = disabledAccommodation.map((object, index) => {
    return {
      key: object._id,
      id: object._id,
      name: object.name,
      owner: object.ownerId,
      services: object.idServices.map(service => service.name).join(', '),
      photos: <img src={object.photos[0]} style={{ maxWidth: '50px' }} />,
      location: `${object.idLocation.city}, ${object.idLocation.country}`,
      description: object.description,
      price: `$${object.price}`,
      active: <Switch className={style.toggle} defaultChecked={disabledAccommodation[index].isActive} onChange={(checked) => handleActive(checked, object._id)} />,
      rating: object.rating || 'N/A',
      tags: ["Inactivo"],
    };
  });

  const handleDelete = (accommodationId) => {
    dispatch(deleteAccommodation_A(accommodationId))
      .then(() => {
        notification.success({
          message: '¡Excelente!',
          description: 'El alojamiento se eliminó con éxito.',
          placement: 'bottomLeft'
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: `Lo sentimos, ${(error).toLowerCase()}.`,
          placement: 'bottomLeft'
        })
      });
  };

  const handleActive = (checked, accommodationId) => {
    const dataToSend = {
      isActive: checked,
    };
    dispatch(updateAccommodation_A(accommodationId, dataToSend))
      .then(() => {
        notification.success({
          message: '¡Excelente!',
          description: 'El alojamiento se activó con éxito.',
          placement: 'bottomLeft'
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: `Lo sentimos, ${(error).toLowerCase()}.`,
          placement: 'bottomLeft'
        })
      });
  };

  const handleDesactive = (checked, accommodationId) => {
    const dataToSend = {
      isActive: checked,
    };
    dispatch(updateAccommodation_A(accommodationId, dataToSend))
      .then(() => {
        notification.success({
          message: '¡Excelente!',
          description: 'El alojamiento se desactivó con éxito.',
          placement: 'bottomLeft'
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: `Lo sentimos, ${(error).toLowerCase()}.`,
          placement: 'bottomLeft'
        })
      });
  };

  const showModal = (accommodationId) => {
    setIsModalOpen(true);
    setPutAccommodationId(accommodationId);
    dispatch(getAccommodationById_A(accommodationId))
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setPutAccommodationId(null);
    setFormData({
      name: '',
      services: '',
      image: '',
      description: '',
      price: ''
    });
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setPutAccommodationId(null);
    setFormData({
      name: '',
      services: '',
      image: '',
      description: '',
      price: ''
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Anfitrión',
      dataIndex: 'owner',
      key: 'owner',
      ...getColumnSearchProps('owner'),
    },
    {
      title: 'Servicios',
      dataIndex: 'services',
      key: 'services',
    },
    {
      title: 'Fotos',
      dataIndex: 'photos',
      key: 'photos',
    },
    {
      title: 'Ubicación',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Activo',
      dataIndex: 'active',
      key: 'active',
    },
    {
      title: 'Valoración',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Etiquetas',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length === 6 ? 'green' : 'red';
            if (tag === 'Pendiente') {
              color = 'geekblue';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Acciones',
      key: 'action',
      dataIndex: 'tags',
      render: (_, { tags, id }, record) => (
        <Space size="middle">
          <a onClick={() => showModal(id)}><EditOutlined /></a>
          {tags.map((tag) => {
            if (tag === "Pendiente") {
              return (
                <Tooltip title="El alojamiento se desactivará">
                  <MdDomainDisabled
                    onClick={() => handleDesactive(record.id)}
                    style={{ cursor: 'pointer', maxWidth: '50px' }}
                  />
                </Tooltip>
              )
            }
          })}
          <Tooltip title="El alojamiento se eliminará de manera definitiva">
            <AiOutlineDelete
              onClick={() => handleDelete(record.id)}
              style={{ cursor: 'pointer', maxWidth: '50px' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleFormSubmit = async (values) => {
    let form = document.querySelector('form');
    let dataToSend = new FormData(form);

    if (formData.name) dataToSend.append("name", formData.name);
    if (formData.services && formData.services.length > 0) {
      formData.services.forEach((service) => {
        dataToSend.append("services", service);
      })
    }
    if (formData.description) dataToSend.append("description", formData.description);
    if (formData.price) dataToSend.append("price", formData.price);
    if (values.image && values.image.length > 0) {
      values.image.forEach((image) => {
        dataToSend.append("images", image.originFileObj);
      })
    }

    dispatch(updateAccommodation_A(putAccommodationId, dataToSend))
      .then(() => {
        notification.success({
          message: '¡Excelente!',
          description: 'El alojamiento se actualizó con éxito.',
          placement: 'bottomLeft'
        });
        setTimeout(() => {
          handleCancelModal()
        }, "1000");
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: `Lo sentimos, ${(error).toLowerCase()}.`,
          placement: 'bottomLeft'
        });
      });
  };

  return (
    <>
      <Table columns={columns} dataSource={[...dataActive, ...dataPending, ...dataDisabled]} />
      <Modal
        title="Editar Alojamiento"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancelModal}
        footer={null}
      >
        <Form
          name="form"
          onFinish={handleFormSubmit}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          style={{
            maxWidth: "100%",
          }}
        >
          {/* Accommodation Name */}

          <div>
            <Form.Item
              label="Nombre"
              style={{ paddingTop: ".5rem" }}
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

          <hr style={{ paddingBottom: "1rem" }} />
          <h1 style={{ paddingBottom: "1rem" }}>Servicios</h1>

          <Form.Item
            label="Habitaciones: "
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

          <Col span={12}>
            <Form.Item
              label="Baños: "
              labelCol={{ span: 12 }}
            >
              <Select
                style={{ width: '234%' }}
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

          <Form.Item>
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
          <hr style={{ padding: "1rem" }} />

          {/* Services end */}
          {/* Photos */}

          <Form.Item
            name='image'
            label="Fotos"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            wrapperCol={{
              span: 20,
            }}
          >
            <Upload
              {...props}
              accept="image/*"
              fileList={fileList}
              listType="picture-card"
              onPreview={handlePreview}
              value={formData.image}
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
          <hr style={{ paddingBottom: "2rem" }} />
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
          {/* Description */}

          <Form.Item
            label="Despripción"
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
              Actualizar
            </Button>
          </Form.Item>

        </Form>
      </Modal>
    </>
  )
}

export default AccommodationAdmin