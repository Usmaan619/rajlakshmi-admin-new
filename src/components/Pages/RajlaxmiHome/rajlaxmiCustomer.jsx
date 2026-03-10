import React, { useState, useEffect } from "react";
import Navbar from "../../Common/Navbar/navbar";
import Sidebar from "../../Common/SideBar/sidebar";
import CustomerTable from "../../Common/CustomerTable/customerTable";
import { getData } from "../../Common/APIs/api";

// Import your image
import noDataImg from "../../Assets/Images/home-img/flat-design-no-data-illustration.png";

const RajlaxmiCustomer = () => {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    getCustomerData();
  }, []);

  const getCustomerData = async () => {
    try {
      const response = await getData("admin/getRajlaxmiUsers");
      if (Array.isArray(response)) {
        setCustomerData(response);
      } else if (response?.success) {
        setCustomerData(response.Customer || []);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  return (
    <div className="container-fluid bg-light-cream-color">
      <Navbar />
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-10 px-lg-5 align-item-center">
            <CustomerTable CustomerData={customerData} />
        </div>
      </div>
    </div>
  );
};

export default RajlaxmiCustomer;
