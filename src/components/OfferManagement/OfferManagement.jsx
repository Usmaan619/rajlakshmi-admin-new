import React from "react";
import Navbar from "../Common/Navbar/navbar";
import Sidebar from "../Common/SideBar/sidebar";
import OfferTable from "./OfferTable";

const OfferManagement = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>
          <div className="mb-4">
            <h1 className="page-title">Offer Banner</h1>
            <p className="page-subtitle">
              Manage promotional offer texts for the top banner
            </p>
          </div>
          <OfferTable />
        </div>
      </div>
    </div>
  );
};

export default OfferManagement;
