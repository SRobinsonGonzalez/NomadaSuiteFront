import { useState } from "react";
import { Link } from 'react-router-dom';
import {
  PageContainer,
  ProCard,
  ProConfigProvider,
  ProLayout,
} from '@ant-design/pro-components';
import {
  CaretDownFilled,
  DashboardOutlined,
  UserOutlined,
  StarOutlined,
  ShopOutlined,
} from '@ant-design/icons';

import {
  ConfigProvider,
  Divider,
  Popover,
  theme,
} from 'antd';
import AccommodationAdmin from "./Accommodations/Accommodations";
import stylesAdmin from "./Admin.module.css"
import Dashboard from "./Dashboard/Dashboard";
import Users from "./Users/Users";

const Admin = () => {
  const [pathname, setPathname] = useState('/dashboard');
  const [num, setNum] = useState(40);

  const defaultProps = {
    route: {
      path: '/',
      routes: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          icon: <DashboardOutlined />,
        },
        {
          path: '/users',
          name: 'Usuarios',
          icon: <UserOutlined />,
        },
        {
          path: '/accommodations',
          name: 'Alojamientos',
          icon: <ShopOutlined />,

        },
        {
          path: '/reviews',
          name: 'Reviews',
          icon: <StarOutlined />,
        },
      ],
    },
    location: {
      pathname: '/',
    },
  }

  const MenuCard = () => {
    const { token } = theme.useToken();
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Divider
          style={{
            height: '1.5em',
          }}
          type="vertical"
        />
        <Popover
          placement="bottom"
          overlayStyle={{
            width: 'calc(100vw - 24px)',
            padding: '24px',
            paddingTop: 8,
            height: '307px',
            borderRadius: '0 0 6px 6px',
          }}
        >
          <div
            style={{
              color: token.colorTextHeading,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              gap: 4,
              paddingInlineStart: 8,
              paddingInlineEnd: 12,
              alignItems: 'center',
            }}
          >
            <span></span>
            <CaretDownFilled />
          </div>
        </Popover>
      </div>
    );
  };

  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById("test-pro-layout") || document.body;
          }}
        >
          <ProLayout
            className={stylesAdmin.adminLayout}
            title={"Nómada Suite"}
            logo={<Link to="/"><img src={"https://nomadasuitefront-production-cf39.up.railway.app/assets/favicon-3e9afa0c.png"} alt="Logo" style={{ width: '35px' }} /></Link>}
            {...defaultProps}
            location={{
              pathname,
            }}
            token={{
              header: {
                colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
              },
            }}
            siderMenuType="group"
            menu={{
              collapsedShowGroupTitle: true,
            }}
            menuItemRender={(item, dom) => (
              <div
                onClick={() => {
                  setPathname(item.path || '/dashboard');
                }}
              >
                {dom}
              </div>
            )}
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <a>
                  {logo}
                  {title}
                </a>
              );
              if (typeof window === 'undefined') return defaultDom;
              if (document.body.clientWidth < 1400) {
                return defaultDom;
              }
              if (_.isMobile) return defaultDom;
              return (
                <>
                  {defaultDom}
                  <MenuCard />
                </>
              );
            }}
          >
            <PageContainer
              token={{
                paddingInlinePageContainerContent: num,
              }}
              subTitle="| &nbsp; Admin"
              fixedHeader
            >
              <ProCard
                style={{
                  height: '100vh',
                  minHeight: 800,
                }}
              >
                {pathname === "/dashboard" && <Dashboard/>}
                {pathname === "/users" && <Users/>}
                {pathname === "/accommodations" && <AccommodationAdmin/>}
              </ProCard>
            </PageContainer>
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};

export default Admin;
