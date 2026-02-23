import React from "react";
import ProductTable from "../../Common/ProductTable/productTable";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import BannerManager from "./home-banner";

const HomeBannerMainPage = () => {
  return (
    <>
      <div className="container-fluid px-4 gauswarn-bg-color">
        <Navbar />
        <div className="row">
          <div className="col-lg-2">
            <Sidebar />
          </div>

          <div className="col-lg-10 px-lg-5">
            {/* <p className='inter-font-family-500 font-20 text-drak-blue-colo'>Navbar</p> */}
            <BannerManager />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeBannerMainPage;
