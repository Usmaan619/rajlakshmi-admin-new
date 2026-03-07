import React from "react";
import Navbar from "../../Common/Navbar/navbar";
import SideBar from "../../Common/SideBar/sidebar";
import GauswarnUsersTable from "./GauswarnUsersTable";

const CreateAdminUserPage = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <SideBar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>
          <div className="mb-4">
            <h1 className="page-title">Create Admin User</h1>
            <p className="page-subtitle">
              Manage admin users and their permissions
            </p>
          </div>
          <GauswarnUsersTable />
        </div>
      </div>
    </div>
  );
};

export default CreateAdminUserPage;
