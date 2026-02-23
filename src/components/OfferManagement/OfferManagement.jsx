import React from "react";
import Navbar from "../Common/Navbar/navbar";
import Sidebar from "../Common/SideBar/sidebar";
import OfferTable from "./OfferTable";

const OfferManagement = () => {
  return (
    <div className="container-fluid px-4">
      <Navbar />
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-10 px-lg-5">
          <OfferTable />
        </div>
      </div>
    </div>
  );
};

export default OfferManagement;
