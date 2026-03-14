import React, { useContext, useEffect, useState, useCallback } from "react";
import SideBar from "../../Common/SideBar/sidebar";
import DashboardCards from "../../Common/Dashboard-cards/cards";
import RecentOrderTable from "../../Common/Recent-order-table/recentOrder";
import CustomerCards from "../../Common/CustomerCards/customercards";
import Navbar from "../../Common/Navbar/navbar";
import DropDowns from "../../Common/Dropdown/dropdown";
import BarChart from "../../Common/Graph/Graph";

// images
import Team from "../../Assets/Images/home-img/team.svg";
import Trend from "../../Assets/Images/home-img/trend.svg";
import Rupee from "../../Assets/Images/home-img/Rupee.svg";
import noDataImg from "../../Assets/Images/home-img/flat-design-no-data-illustration.png";
import Cart from "../../Assets/Images/home-img/shopping-cart.svg";
import { postData, getData } from "../../Common/APIs/api";
import { DropdownContext } from "../../../Context/DropdownContext";

const Home = () => {
  const { dropdownData } = useContext(DropdownContext);
  const [salesData, setSalesData] = useState();
  const [totalCustomers, setTotalCustomers] = useState(0);

  const getSalesDataByAPI = useCallback(async () => {
    const endpoint = "admin/getAllSales";
    try {
      const payload = {
        filterType: dropdownData.filterType,
        month: dropdownData.month,
        year: dropdownData.year,
      };
      const response = await postData(endpoint, payload);
      if (response?.data?.success) {
        setSalesData(response?.data?.data);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }, [dropdownData]);

  const getCustomerCount = useCallback(async () => {
    try {
      const res = await getData("admin/getRajlaxmiUsers?limit=1");
      if (res?.success) {
        setTotalCustomers(res.total || 0);
      }
    } catch (err) {
      console.log("Customer fetch error:", err);
    }
  }, []);

  useEffect(() => {
    getSalesDataByAPI();
    getCustomerCount();
  }, [getSalesDataByAPI, getCustomerCount]);

  const DashboardCardData = [
    {
      label: "Total Products",
      count: salesData?.totalProducts ?? "0",
      imgSrc: Team,
      cardColor: "bg-light-blue-color",
      circleColor: "dashboard-blue-color",
    },
    {
      label: "Total Sales",
      count: `₹${salesData?.summary?.total_sales ?? "0"}`,
      imgSrc: Trend,
      cardColor: "bg-light-green-color",
      circleColor: "dashboard-green-color",
    },
    {
      label: "Total Orders",
      count: salesData?.totalOrders ?? "0",
      imgSrc: Cart,
      cardColor: "bg-light-yellow-color",
      circleColor: "dashboard-yellow-color",
    },
    {
      label: "Total Profit",
      count: `₹${salesData?.monthlyProfit ?? "0"}`,
      imgSrc: Rupee,
      cardColor: "bg-light-purple-color",
      circleColor: "dashboard-purple-color",
    },
    {
      label: "Total Customers",
      count: totalCustomers,
      imgSrc: Team,
      cardColor: "bg-light-blue-color",
      circleColor: "dashboard-blue-color",
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        {/* Sticky Navbar */}
        <Navbar title="Rajlaxmi Dashboard" />

        {/* Page Content */}
        <div style={{ padding: "24px 28px", maxWidth: "100%" }}>
          {/* Page Header */}
          <div
            className="d-flex flex-wrap align-items-center justify-content-between mb-4"
            style={{ gap: "12px" }}
          >
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <DropDowns />
          </div>

          {/* Stats Cards */}
          <DashboardCards cardData={DashboardCardData} />

          {/* Bar Chart */}
          <div className="mt-4">
            <BarChart BarChartData={salesData} />
          </div>

          {/* Bottom Section: Orders + Customers */}
          <div className="row mt-4 mb-5 g-4">
            {/* Recent Orders */}
            <div className="col-lg-8">
              <RecentOrderTable
                RecentOrderTableData={salesData?.recentOrders}
              />
            </div>

            {/* Top Customers */}
            <div className="col-lg-4">
              <div
                style={{
                  background: "white",
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                }}
              >
                {/* Section Header */}
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #f1f5f9",
                    background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                  }}
                >
                  <h6
                    style={{
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#0f172a",
                      marginBottom: "2px",
                    }}
                  >
                    Top Customers
                  </h6>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginBottom: 0,
                    }}
                  >
                    Highest spending users
                  </p>
                </div>

                <div style={{ padding: "12px" }}>
                  {!salesData?.topUsers || salesData?.topUsers?.length === 0 ? (
                    <div className="text-center py-4">
                      <img
                        src={noDataImg}
                        alt="No Data"
                        className="no-data-img mb-3"
                        style={{ maxWidth: "160px", opacity: 0.6 }}
                      />
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: "13px",
                          marginBottom: 0,
                        }}
                      >
                        No top customers yet
                      </p>
                    </div>
                  ) : (
                    <CustomerCards CustomerCardData={salesData?.topUsers} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
