import React, { useEffect, useState } from "react";
import OrderTable from "../../Common/OrderTable/ordertable";
import SideBar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import { getData } from "../../Common/APIs/api";

const Order = () => {
  const OrderHeadings = [
    "Order ID",
    "Customer Name",
    "Order Date",
    "Total Amount",
    "Payment Status",
    "Order Status",
    "Action",
  ];

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrderAPI();
  }, []);

  const getOrderAPI = async () => {
    const endpoint = "admin/getAllOrderDetails";
    try {
      const response = await getData(endpoint);
      if (response?.success) setOrders(response?.orderDetails || []);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <SideBar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>
          <div className="mb-4">
            <h1 className="page-title">Order Management</h1>
            <p className="page-subtitle">
              Track and manage all customer orders
            </p>
          </div>
          <OrderTable
            ordersData={orders}
            headings={OrderHeadings}
            refresh={getOrderAPI}
          />
        </div>
      </div>
    </div>
  );
};

export default Order;
