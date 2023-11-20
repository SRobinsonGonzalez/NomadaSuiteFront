import { Button, Flex, Space, Table, Tag, notification, Input, Image, Tooltip, Switch, Modal, Form, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
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

const Users = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [data, setData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const users = useSelector((state) => state.allUsers_A);
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  const showModal = () => {
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

  useEffect(() => {
    dispatch(getAllUers_A());
    const dataColumns = [];
    if(users.length > 0) {
      users.reverse().map((user, index) => {
        const tags = [];
        const userId = user._id;
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
          user.profileImage ?
            <Image
              width={30}
              style={{ borderRadius: "50%" }}
              src={user.profileImage}
            />
          :
          <FaCircleUser style={{ fontSize: "30px", color: "#d3ceee" }}/>,
          name: user.firstName + " " + user.lastName,
          email: user.email,
          admin: <Switch className={userStyles.toggle} defaultChecked={user.isAdmin} onChange={(checked) => onChangeAdmin(checked, userId)} />,
          active: <Switch className={userStyles.toggle} defaultChecked={user.isActive} onChange={(checked) => onChangeActive(checked, userId)} />,
          tags: tags,
          action: 
          <Space size="middle">
            <a onClick={showModal}><EditOutlined /></a>
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
    <>
      <Flex justify='end' style={{ marginBottom: "1rem"}}>
        <Button><PlusOutlined /> Añadir usuario</Button>
      </Flex>
      <Table columns={columns} dataSource={data} />
      <Modal title="Editar Usuario" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Canceler
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Guardar
        </Button>
      ]}>
        <Form>
          <Form.Item name="image" label="Imagen"> 
            
          </Form.Item>
          <Form.Item name="userName" label="Nombre"> 
            <Input/>
          </Form.Item>
          <Form.Item name="email" label="Email"> 
            <Input/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Users