import React from "react";

const RecentOrderTable = ({ RecentOrderTableData = [] }) => {
  const getStatusConfig = (status, isPaid) => {
    if (isPaid === "1") {
      return {
        label: "Paid",
        bg: "rgba(16, 185, 129, 0.1)",
        color: "#059669",
        dot: "#10b981",
      };
    }
    switch (status) {
      case "Pending":
        return {
          label: "Pending",
          bg: "rgba(245, 158, 11, 0.1)",
          color: "#d97706",
          dot: "#f59e0b",
        };
      case "Cancel":
        return {
          label: "Cancelled",
          bg: "rgba(239, 68, 68, 0.1)",
          color: "#dc2626",
          dot: "#ef4444",
        };
      case "Shipped":
        return {
          label: "Shipped",
          bg: "rgba(59, 130, 246, 0.1)",
          color: "#2563eb",
          dot: "#3b82f6",
        };
      case "captured":
        return {
          label: "Captured",
          bg: "rgba(16, 185, 129, 0.1)",
          color: "#059669",
          dot: "#10b981",
        };
      default:
        return {
          label: "Unpaid",
          bg: "rgba(245, 158, 11, 0.1)",
          color: "#d97706",
          dot: "#f59e0b",
        };
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Table Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
        }}
      >
        <div>
          <h6
            style={{
              fontWeight: 700,
              fontSize: "15px",
              color: "#0f172a",
              marginBottom: "2px",
            }}
          >
            Recent Orders
          </h6>
          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              marginBottom: 0,
            }}
          >
            {RecentOrderTableData.length} records found
          </p>
        </div>
        <span
          style={{
            background: "rgba(224, 122, 95, 0.1)",
            color: "#e07a5f",
            fontSize: "11px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "20px",
            border: "1px solid rgba(224, 122, 95, 0.2)",
          }}
        >
          Live
        </span>
      </div>

      {/* Table */}
      <div className="table-responsive" style={{ minHeight: "auto" }}>
        <table className="table mb-0">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!RecentOrderTableData || RecentOrderTableData.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-5 text-center">
                  <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                      📋
                    </div>
                    <strong
                      style={{
                        display: "block",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    >
                      No Recent Orders
                    </strong>
                    <span>Orders will appear here once placed.</span>
                  </div>
                </td>
              </tr>
            ) : (
              RecentOrderTableData.map((order, index) => {
                const statusConfig = getStatusConfig(
                  order.status,
                  order.isPaymentPaid,
                );
                return (
                  <tr key={index}>
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#4f46e5",
                          fontSize: "13px",
                        }}
                      >
                        #{order?.user_id}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #e07a5f, #c96745)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {(order?.user_name || "?")[0].toUpperCase()}
                        </div>
                        <span
                          style={{
                            fontWeight: 500,
                            color: "#334155",
                            fontSize: "13px",
                          }}
                        >
                          {order?.user_name}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: "#64748b", fontSize: "12px" }}>
                      {new Date(order.date).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#0f172a",
                          fontSize: "13px",
                        }}
                      >
                        ₹{order.user_total_amount}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          background: statusConfig.bg,
                          color: statusConfig.color,
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "20px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: statusConfig.dot,
                            flexShrink: 0,
                          }}
                        />
                        {statusConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrderTable;
