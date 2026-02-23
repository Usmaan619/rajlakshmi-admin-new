import React, { useState } from 'react';
import DashboardCards from '../../Common/Dashboard-cards/cards';
import RecentOrderTable from '../../Common/Recent-order-table/recentOrder';
import CustomerCards from '../../Common/CustomerCards/customercards';
import Navbar from '../../Common/Navbar/navbar';
import Dropdown from '../../Common/Dropdown/dropdown';
import Sidebar from '../../Common/SideBar/sidebar';
import BarChart from '../../Common/Graph/Graph';
import ProductCards from '../../Common/TopProductCards/productCards';
import { Outlet } from 'react-router-dom';

// images
import Team from "../../Assets/Images/home-img/team.svg";
import Trend from "../../Assets/Images/home-img/trend.svg";
import Rupee from "../../Assets/Images/home-img/Rupee.svg";
import Cart from "../../Assets/Images/home-img/shopping-cart.svg";
import noDataImg from '../../Assets/Images/home-img/flat-design-no-data-illustration.png'; // Adjust path if needed

const DashboardCardData = [
  { label: 'Total Products', count: 1234, imgSrc: Team, cardColor: "bg-light-blue-color", circleColor: "dashboard-blue-color" },
  { label: 'Total Sales', count: 1234, imgSrc: Trend, cardColor: "bg-light-green-color", circleColor: "dashboard-green-color" },
  { label: 'Total Order', count: 1234, imgSrc: Cart, cardColor: "bg-light-yellow-color", circleColor: "dashboard-yellow-color" },
  { label: 'Total Profit', count: 1234, imgSrc: Rupee, cardColor: "bg-light-purple-color", circleColor: "dashboard-purple-color" },
];

const RajlaxmiDashboard = () => {
  const [customerData, setCustomerData] = useState([]); // ✅ This is the only fix

  return (
    <div className="container-fluid bg-light-cream-color">
      {/* Navbar */}
      <Navbar title="Rajlaxmi Dashboard" />

      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-2">
          <Sidebar className="w-25" />
        </div>

        {/* Main Content */}
        <div className="col-lg-10 px-lg-5 d-flex justify-content-center flex-column">

          {/* Dashboard Title + Dropdown */}
          <div className="row align-items-center my-3">
            <div className="col-md-6 col-12">
              <p className='font-20 mb-0 inter-font-family-500'>Dashboard</p>
            </div>
            <div className="col-md-6 col-12 mt-2 mt-md-0 d-flex justify-content-md-end justify-content-end">
              <Dropdown />
            </div>
          </div>

          <DashboardCards cardData={DashboardCardData} />
          <BarChart />

          <div className="row my-5">
            <div className="col-lg-7">
              <RecentOrderTable />
            </div>
            <div className="col-lg-5">
              <p className="font-20 inter-font-family-500 text-murmaid-color mt-lg-0 mt-4">Top Customers</p>
              {customerData.length === 0 ? (
                <div className="no-data text-center d-flex flex-column align-items-center">
                  <img src={noDataImg} alt="No Data" className="no-data-img" />
                  <h5 className="mt-3">No Top Customers Found</h5>
                </div>
              ) : (
                <CustomerCards data={customerData} />
              )}
            </div>
            <div className="col-lg-12 my-4">
              <ProductCards />
            </div>
          </div>

          {/* Render child routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RajlaxmiDashboard;
