import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import ContactTable from "../../Common/ContactTable/contactTable";
import { getData } from "../../Common/APIs/api";

const Contact = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    getContactsAPI();
  }, []);

  const getContactsAPI = async () => {
    const endpoint = "/getAllContact";
    try {
      const response = await getData(endpoint);
      if (response?.success) setContacts(response?.contact || []);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>
          <div className="mb-4">
            <h1 className="page-title">Contact Inquiries</h1>
            <p className="page-subtitle">
              View and respond to contact form submissions
            </p>
          </div>
          <ContactTable ContactData={contacts} />
        </div>
      </div>
    </div>
  );
};

export default Contact;
