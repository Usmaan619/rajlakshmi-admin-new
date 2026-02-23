import React from "react";

import CustomerInfoForm from "../../Common/CustomerInfoForm/CustomerForm";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import { useSearchParams } from "react-router-dom";

const CustomerInfo = () => {
  const [searchParams] = useSearchParams();
  const customerData = JSON?.parse(searchParams.get("customerData"));
  console.log("customerData: =================", customerData);
  return (
    <>
      <div className="container-fluid gauswarn-bg-color">
        <div className="row">
          <div className="col-lg-2">
            <Sidebar />
          </div>
          <div className="col-lg-10 px-lg-5">
            <Navbar />
            {/* <p className='inter-font-family-500 font-20 text-drak-blue-colo'>Navbar</p> */}
            <CustomerInfoForm CustomerInfoData={customerData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerInfo;
