import { Button, Flex, Space, Table, Tag, notification, Input, Image, Tooltip, Switch, Modal, Form, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import { FaCircleUser } from "react-icons/fa6";
import userStyles from "./User.module.css";
import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser_A, getAllUers_A, updateUser_A } from '../../../redux/Actions/actions';
import axios from 'axios';

const Users = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [data, setData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reloadTable, setReloadTable] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [currentUserId, setCurrentUserId] = useState('');
  const [editUser, setEditUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const users = useSelector((state) => state.allUsers_A);
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  const showModal = (userId, userFirstName, userLastName, userEmail, userImage) => {
    setCurrentUserId(userId);
    setEditUser({ ...editUser, firstName: userFirstName, lastName: userLastName,  email: userEmail });
    setFileList([
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: userImage,
      },
    ])
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
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
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
    },
    {
      title: 'Nombres',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Administrador',
      dataIndex: 'admin',
      key: 'admin',
    },
    {
      title: 'Activo',
      dataIndex: 'active',
      key: 'active',
    },
    {
      title: 'Etiquetas',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
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
      dataIndex: 'action',
    },
  ];

  const onChangeActive = (checked, userId) => {
    dispatch(updateUser_A(userId, { "isActive": checked })).then(
      notification.success({
        description: 'Usuario actualizado exitosamente',
        placement: 'bottomRight'
      })
    )
  };

  const onChangeAdmin = (checked, userId) => {
    dispatch(updateUser_A(userId, { "isAdmin": checked })).then(
      notification.success({
        description: 'Usuario actualizado exitosamente',
        placement: 'bottomRight'
      })
    )
  };

  const onDelete = () => {
    dispatch(deleteUser_A()).then(
      notification.success({
        description: 'Usuario eliminado exitosamente',
        placement: 'bottomRight'
      })
    );
  };

  const beforeUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFileList(() => [{ url: reader.result, originFileObj: file }]);
    };
    return false;
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleFormSubmit = async () => {
    const formDataToSend = new FormData();
    try {
      formDataToSend.append('images', fileList[0].originFileObj);
      formDataToSend.append('firstName', editUser.firstName);
      formDataToSend.append('lastName', editUser.lastName);
      formDataToSend.append('email', editUser.email);
      await axios.put(`/user/update/${currentUserId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      notification.success({
        message: '¡Excelente!',
        description: 'El usuario fue actualizado con éxito.',
        placement: 'bottomRight'
      });
      setReloadTable(!reloadTable);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: `Lo sentimos, no se pudo actualizar el usuario.`,
        placement: 'bottomRight'
      });
    }
    setIsModalOpen(false);
  }

  useEffect(() => {
    dispatch(getAllUers_A());
    const dataColumns = [];
    if(users.length > 0) {
      users.reverse().map((user, index) => {
        const tags = [];
        const userId = user._id;
        const userFirstName = user.firstName;
        const userLastName = user.lastName;
        const userEmail = user.email;
        const userImage = user.profileImage;
        if(user.isActive) {
          tags.push("Activo")
        }
        else {
          tags.push("Inactivo")
        }
        if(user.isAdmin) {
          tags.push("Admin")
        }
        dataColumns.push({
          key: index,
          avatar:
          userImage ?
            <Image
              width={30}
              style={{ borderRadius: "50%" }}
              src={user.profileImage}
            />
          :
          <FaCircleUser style={{ fontSize: "30px", color: "#d3ceee" }}/>,
          name: userFirstName + " " + userLastName,
          email: userEmail,
          admin: <Switch className={userStyles.toggle} defaultChecked={user.isAdmin} onChange={(checked) => onChangeAdmin(checked, userId)} />,
          active: <Switch className={userStyles.toggle} defaultChecked={user.isActive} onChange={(checked) => onChangeActive(checked, userId)} />,
          tags: tags,
          action: 
          <Space size="middle">
            <a onClick={() => showModal(userId, userFirstName, userLastName, userEmail, userImage)}><EditOutlined /></a>
            <Tooltip title="El usuario se eliminará de manera definitiva">
              <DeleteOutlined onClick={onDelete}/>
            </Tooltip>
          </Space>
        })
      })
    }
    setData(dataColumns);
  }, [users])
  
  return (
    <div className={userStyles.userContainer}>
      {/* <Flex justify='end' style={{ marginBottom: "1rem"}}>
        <Button><PlusOutlined /> Añadir usuario</Button>
      </Flex> */}
      <Table columns={columns} dataSource={data} className={userStyles.tableUser}/>
      <Modal title="Editar Usuario" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleFormSubmit}>
          Actualizar
        </Button>
      ]}>
        <Form layout="horizontal">
          <Form.Item
            name="image"
            valuePropName="fileList"
            label="Imagen de perfil"
          >
            <ImgCrop rotationSlider>
              <Upload
                accept="image/*"
                beforeUpload={beforeUpload}
                fileList={fileList}
                listType="picture-circle"
                onChange={onChange}
                type="file"
              >
                {fileList.length < 1 && '+ Upload'}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item label="Nombres">
            <Input
              value={editUser.firstName}
              onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Apellidos"> 
            <Input
              value={editUser.lastName}
              onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Email"> 
            <Input
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Users