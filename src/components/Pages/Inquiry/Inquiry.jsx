import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import InquiryTable from "./inquiryTable";
import { getData } from "../../Common/APIs/api";

const Inquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  useEffect(() => {
    getInquiriesAPI();
  }, [filters]);

  const getInquiriesAPI = async () => {
    try {
      const endpoint = `getb2bInquiries?page=${filters.page}&limit=${filters.limit}&search=${filters.search}&status=${filters.status}`;
      const response = await getData(endpoint);
      if (response?.success) {
        setInquiries(response.data || []);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.log("Inquiry Fetch Error:", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>
          <div className="mb-4">
            <h1 className="page-title">B2B Inquiries</h1>
            <p className="page-subtitle">
              Manage business-to-business inquiry requests
            </p>
          </div>
          <InquiryTable
            inquiries={inquiries}
            pagination={pagination}
            filters={filters}
            setFilters={setFilters}
            refresh={getInquiriesAPI}
          />
        </div>
      </div>
    </div>
  );
};

export default Inquiry;
