import React from "react";
import Navbar from "../../Common/Navbar/navbar";
import SideBar from "../../Common/SideBar/sidebar";
import GauswarnUsersTable from "./GauswarnUsersTable";

const CreateAdminUserPage = () => {
  return (
    <div className="container-fluid gauswarn-bg-color min-vh-100">
      <Navbar />

      <div className="row">
        <div className="col-lg-2">
          <SideBar />
        </div>

        <div className="col-lg-10 px-lg-5">
          <h3 className="my-4">Create Admin User</h3>
          <GauswarnUsersTable />
        </div>
      </div>
    </div>
  );
};

export default CreateAdminUserPage;
