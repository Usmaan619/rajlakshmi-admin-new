import React, { useState, useEffect } from 'react';
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import ContactTable from "../../Common/ContactTable/contactTable";
import noDataImg from "../../Assets/Images/home-img/flat-design-no-data-illustration.png"; // Adjust path if needed

const RajlaxmiContact = () => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    // TODO: Replace with real API call
    setProductData([]); // Simulating no data
  }, []);

  return (
    <div className="container-fluid bg-light-cream-color">
      <Navbar />

      <div className="row py-2">
        <div className="col-lg-2">
          <Sidebar />
        </div>

        <div className="col-lg-10 px-lg-5">
          {productData.length === 0 ? (
            <div className="no-data text-center d-flex flex-column align-items-center">
              <img src={noDataImg} alt="No Data" className="no-data-img" />
              <h3 className="mt-3">No Records Found</h3>
            </div>
          ) : (
            <ContactTable  />
          )}
        </div>
      </div>
    </div>
  );
};

export default RajlaxmiContact;
