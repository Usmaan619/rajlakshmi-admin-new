import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import NewsletterTable from "./NewsletterTable";
import { getData } from "../../Common/APIs/api";

const NewsletterPage = () => {
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  useEffect(() => {
    loadNewsletter();
  }, [filters]);

  const loadNewsletter = async () => {
    const endpoint = `getNewsletter?page=${filters.page}&limit=${filters.limit}&search=${filters.search}&status=${filters.status}`;
    const res = await getData(endpoint);
    if (res?.success) {
      setList(res.data);
      setPagination(res.pagination);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>
          <div className="mb-4">
            <h1 className="page-title">Newsletter</h1>
            <p className="page-subtitle">Manage newsletter subscribers</p>
          </div>
          <NewsletterTable
            data={list}
            pagination={pagination}
            filters={filters}
            setFilters={setFilters}
            refresh={loadNewsletter}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
