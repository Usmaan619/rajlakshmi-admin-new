import React, { useEffect, useState } from "react";
import SideBar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import { getData } from "../../Common/APIs/api";
import "./ActiveCarts.css";

const ActiveCarts = () => {
  const [activeCarts, setActiveCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveCartsAPI();
  }, []);

  const getActiveCartsAPI = async () => {
    setLoading(true);
    const endpoint = "admin/active-carts";
    try {
      const response = await getData(endpoint);
      if (response?.success) {
        setActiveCarts(response?.activeCarts || []);
      }
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <SideBar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>
          <div className="mb-4">
            <h1 className="page-title" style={{ fontSize: "24px", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>Active User Carts</h1>
            <p className="page-subtitle" style={{ color: "#64748b", fontSize: "14px" }}>
              Track what users currently have in their shopping carts.
            </p>
          </div>

          <div className="table-container" style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            {loading ? (
              <div>Loading...</div>
            ) : activeCarts.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>No active carts found.</div>
            ) : (
              <div className="table-responsive">
                <table className="w-100" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "14px" }}>Customer</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "14px" }}>Contact</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "14px" }}>Items</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "14px" }}>Total Amount</th>
                      <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "14px" }}>Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCarts.map((cart, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px", fontSize: "14px", color: "#334155" }}>
                          <div style={{ fontWeight: "600" }}>{cart.user_name}</div>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px", color: "#334155" }}>
                          <div>{cart.user_email}</div>
                          <div style={{ color: "#64748b", fontSize: "12px" }}>{cart.user_phone}</div>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px", color: "#334155" }}>
                          <ul style={{ margin: 0, paddingLeft: "16px" }}>
                            {cart.items.map((item, i) => (
                              <li key={i} style={{ marginBottom: "4px" }}>
                                {item.name} {item.weight && `(${item.weight})`} x {item.quantity}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                          ₹{cart.cart_total.toFixed(2)}
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px", color: "#64748b" }}>
                          {new Date(cart.last_active).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveCarts;
