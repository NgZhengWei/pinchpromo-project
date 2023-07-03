
import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate,useLocation } from "react-router-dom";

const SideMenu = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");
  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();
  return (
    <div className="SideMenu">
      <Menu
        onClick={(item) => {
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Dashboard",
            key: "/businessdashboard",
            icon: <AppstoreOutlined />,
          },
          {
            label: "Inventory",
            key: "/businessdashboard/inventory",
            icon: <ShopOutlined />,
          },
          {
            label: "Orders",
            key: "/businessdashboard/orders",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: "Customers",
            key: "/businessdashboard/customers",
            icon: <UserOutlined />,
          },
        ]}
      ></Menu>
    </div>
  );
};

export default SideMenu;
