import React, { useState, useEffect } from "react";
import BlogJsonForm from "./BlogJsonForm";
import BlogTable from "./BlogTable";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminBlogPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBlogAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Blog Management
                </h1>
                <p className="text-gray-500 mt-1">
                  Rajlakshmi Javiks - Organic Dairy Blog Admin
                </p>
              </div>
            </header>

            {/* Form Section */}
            <div className="grid grid-cols-1 gap-8">
              <BlogJsonForm onSuccess={handleBlogAdded} />
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Existing Blogs
                </h2>
                <div className="text-sm text-gray-500 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                  Total Managed Content
                </div>
              </div>
              <BlogTable refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminBlogPage;
