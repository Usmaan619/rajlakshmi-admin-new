import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import CustomerTable from "../../Common/CustomerTable/customerTable";
import { getData } from "../../Common/APIs/api";

const Customer = () => {
  const [customer, setCustomers] = useState([]);

  useEffect(() => {
    getCustomerAPI();
  }, []);

  const getCustomerAPI = async () => {
    const endpoint = "admin/getRajlaxmiUsers";
    try {
      const response = await getData(endpoint);
      if (Array.isArray(response)) {
        setCustomers(response);
      } else if (response?.success) {
        setCustomers(response?.Customer || []);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>
          <div className="mb-4">
            <h1 className="page-title">Customers</h1>
            <p className="page-subtitle">
              View and manage registered customers
            </p>
          </div>
          <CustomerTable CustomerData={customer} />
        </div>
      </div>
    </div>
  );
};

export default Customer;
