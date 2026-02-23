import React, { useState, useEffect } from "react";
import Navbar from "../../Common/Navbar/navbar";
import Sidebar from "../../Common/SideBar/sidebar";
import CustomerTable from "../../Common/CustomerTable/customerTable";

// Import your image
import noDataImg from "../../Assets/Images/home-img/flat-design-no-data-illustration.png";

const RajlaxmiCustomer = () => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    setProductData([]); // Simulating no data
  }, []);

  return (
    <div className="container-fluid bg-light-cream-color">
      <Navbar />
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>
       <div className="col-lg-10 px-lg-5 align-item-center">
          {productData.length === 0 ? (
            <div className="no-data text-center d-flex flex-column align-items-center">
              <img src={noDataImg} alt="No Data" className="no-data-img" />
              <h3 className="mt-3">No Records Found</h3>
              
            </div>
          ) : (
            <CustomerTable />
          )}
        </div>
      </div>
    </div>
  );
};

export default RajlaxmiCustomer;
