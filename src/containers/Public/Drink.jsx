import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { path } from "../../ultils/constant";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import HeaderLayout from "./HeaderLayout";
import DrinkTable from "./TableLayout/DrinkTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrinkData } from "../../store/Slice/drinkSlice";

import AddDrinkForm from "./FormLayout/AddDrinkForm";
import {
  showSuccessNotification,
  showFailureNotification,
} from "../../ultils/notificationUtils";
import EditForm from "./FormLayout/EditForm";
import { callAPINoHead, callAPIDelete } from "../../ultils/axiosApi";
const { Header, Content, Footer, Sider } = Layout;
const items2 = [
  {
    key: "sub1",
    icon: React.createElement(UserOutlined),
    label: "Quản lý kho",
    children: [
      { key: "1", label: "Quản lý đồ dùng kho" },
      { key: "2", label: "Xem danh sách" },
      { key: "3", label: "Cập nhật thông tin" },
      { key: "4", label: "Xóa nhân viên" },
    ],
  },
  {
    key: "sub2",
    icon: React.createElement(LaptopOutlined),
    label: "Quản lý menu ",
    children: [
      { key: "5", label: "Quản lý đồ uống" },
      { key: "6", label: "Quản lý menu" },
    ],
  },
  {
    key: "sub3",
    icon: React.createElement(NotificationOutlined),
    label: "Quản lý nhân viên",
    children: [{ key: "9", label: "Danh sách nhân viên" }],
  },
  {
    key: "sub4",
    icon: React.createElement(NotificationOutlined),
    label: "Quản lý Bill",
    children: [
      { key: "10", label: "Quản lý Bill" },
      { key: "11", label: "Cảnh báo hệ thống" },
    ],
  },
];
const Drink = () => {
  const [selectedKeys, setSelectedKeys] = useState(["5"]);
  const [dataSource, setDataSource] = useState();
  const dispatch = useDispatch();
  const drinkList = useSelector((state) => state.drink.drinkList);

  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  useEffect(() => {
    dispatch(fetchDrinkData());
  }, [dispatch]);

  useEffect(() => {
    if (selectedKeys[0] === "5") {
      return;
    } else if (selectedKeys[0] === "2") {
      navigate(path.CONTENT2);
    } else if (selectedKeys[0] === "1") {
      navigate(path.CONTENT1);
    } else if (selectedKeys[0] === "9") {
      navigate(path.STAFF);
    }
  }, [selectedKeys, navigate]);
  const handleAdd = (data) => {
    // Kiểm tra xem formData có dữ liệu không
    if (
      Object.values(data).some(
        (value) => value !== "" && value !== null && value !== undefined
      )
    ) {
      setDataSource([...dataSource, data]);
    } else {
      console.log("Vui lòng điền đầy đủ thông tin trước khi thêm.");
    }
  };

  const handleEdit = (drink_id) => {};

  const handleDelete = async (itemId) => {
    console.log(itemId);
    try {
      await callAPIDelete(`http://localhost:5000/drinks/${itemId}`);
      console.log("Drink Item deleted successfully!");
      const newData = dataSource.filter((item) => item.drink_id !== itemId);
      setDataSource(newData);
      showSuccessNotification("Thông báo", "Đã xóa thành công");
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  // const handleDelete = (key) => {
  //   const newData = dataSource.filter((item) => item.drink_id !== key);
  //   console.log(newData);

  //   setDataSource(newData);
  //   showSuccessNotification("Thông báo", "Đã xóa thành công");
  // };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.storage_id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const handleMenuClick = (e) => {
    const key = e.key;
    setSelectedKeys([key]);
  };
  return (
    <Layout>
      <HeaderLayout />
      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              onClick={handleMenuClick}
              mode="inline"
              selectedKeys={selectedKeys}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
              }}
              items={items2}
            />
          </Sider>
          <Content
            style={{
              padding: "0 24px",
              minHeight: 280,
            }}
          >
            <div className="flex justify-center p-1 ">
              <span className="text-[28px] font-bold ">Quản lý kho</span>
            </div>
            <div className="w-1800 flex flex-col justify-start  mt-3">
              <div className="w-200">
                <AddDrinkForm onAddData={handleAdd} />
              </div>
            </div>
            <DrinkTable
              dataSource={drinkList}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onSave={handleSave}
              onEdit={handleEdit}
            />
          </Content>
        </Layout>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      ></Footer>
    </Layout>
  );
};
export default Drink;