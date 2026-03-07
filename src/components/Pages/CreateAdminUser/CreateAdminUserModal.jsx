import React, { useEffect, useState } from "react";
import { postData } from "../../Common/APIs/api";
import { toastError, toastSuccess } from "../../../Services/toast.service";
import { X, User, Mail, Phone, Lock, Shield, CheckSquare } from "lucide-react";

const ROLES = ["super_admin", "admin", "manager", "user"];

const PERMISSION_LIST = [
  { id: "orders", label: "Orders" },
  { id: "all", label: "All" },
  { id: "b2b", label: "B2B Inquiry" },
  { id: "blogs", label: "Blogs" },
  { id: "users", label: "User Management" },
  { id: "banners", label: "Home Banners" },
  { id: "reels", label: "Reels" },
  { id: "products", label: "Products" },
  { id: "customers", label: "Customers" },
  { id: "contact", label: "Contact" },
  { id: "feedback", label: "Feedback" },
  { id: "offerbanner", label: "Offer Banner" },
  { id: "newsletter", label: "Newlatter" },
];

const CreateAdminUserModal = ({ show, onClose, onSuccess, editUser }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
    password: "",
    role: "",
    permissions: [],
  });

  useEffect(() => {
    if (editUser) {
      let permissionsArray = [];

      try {
        if (typeof editUser.permissions === "string") {
          permissionsArray = JSON.parse(editUser.permissions);
        } else {
          permissionsArray = editUser.permissions || [];
        }
      } catch {
        permissionsArray = [];
      }

      setFormData({
        ...editUser,
        permissions: permissionsArray,
      });
    } else {
      setFormData({
        full_name: "",
        email: "",
        mobile_number: "",
        password: "",
        role: "",
        permissions: [],
      });
    }
  }, [editUser]);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePermission = (permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await postData(
        editUser ? `admin/updateUser/${editUser.id}` : "admin/register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.success) {
        toastSuccess(
          editUser ? "User updated successfully!" : "User created successfully!"
        );
        onSuccess();
        onClose();
      } else {
        toastError(response?.data?.message);
      }
    } catch {
      toastError("Request failed");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{
        background: "rgba(19, 21, 35, 0.75)",
        backdropFilter: "blur(4px)",
        overflowY: "auto",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0 shadow-lg"
          style={{
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* Modal Header */}
          <div
            className="p-4 d-flex justify-content-between align-items-center"
            style={{
              background: "linear-gradient(135deg, #2f3e46 0%, #131523 100%)",
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle p-2"
                style={{ background: "#fefbe9" }}
              >
                <User size={24} style={{ color: "#2f3e46" }} />
              </div>
              <h4 className="mb-0 fw-bold text-white">
                {editUser ? "Edit Admin User" : "Create New Admin User"}
              </h4>
            </div>
            <button
              className="btn btn-link p-0"
              onClick={onClose}
              style={{ color: "#fefbe9" }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4" style={{ background: "#fefbe9" }}>
            {/* Personal Information Section */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3" style={{ color: "#2f3e46" }}>
                Personal Information
              </h6>

              <div className="mb-3">
                <label
                  className="form-label small fw-semibold"
                  style={{ color: "#575757" }}
                >
                  <User size={16} className="me-1" /> Full Name
                </label>
                <input
                  name="full_name"
                  placeholder="Enter full name"
                  className="form-control border-0 shadow-sm"
                  value={formData.full_name}
                  onChange={handleInput}
                  style={{
                    borderRadius: "8px",
                    background: "white",
                    padding: "12px",
                  }}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label
                    className="form-label small fw-semibold"
                    style={{ color: "#575757" }}
                  >
                    <Mail size={16} className="me-1" /> Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    className="form-control border-0 shadow-sm"
                    value={formData.email}
                    onChange={handleInput}
                    style={{
                      borderRadius: "8px",
                      background: "white",
                      padding: "12px",
                    }}
                  />
                </div>

                <div className="col-md-6">
                  <label
                    className="form-label small fw-semibold"
                    style={{ color: "#575757" }}
                  >
                    <Phone size={16} className="me-1" /> Mobile Number
                  </label>
                  <input
                    name="mobile_number"
                    placeholder="Enter mobile number"
                    className="form-control border-0 shadow-sm"
                    value={formData.mobile_number}
                    onChange={handleInput}
                    style={{
                      borderRadius: "8px",
                      background: "white",
                      padding: "12px",
                    }}
                  />
                </div>
              </div>

              {!editUser && (
                <div className="mb-3">
                  <label
                    className="form-label small fw-semibold"
                    style={{ color: "#575757" }}
                  >
                    <Lock size={16} className="me-1" /> Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    className="form-control border-0 shadow-sm"
                    value={formData.password}
                    onChange={handleInput}
                    style={{
                      borderRadius: "8px",
                      background: "white",
                      padding: "12px",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Role Section */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3" style={{ color: "#2f3e46" }}>
                <Shield size={18} className="me-1" /> Role & Access
              </h6>

              <select
                name="role"
                className="form-select border-0 shadow-sm"
                value={formData.role}
                onChange={handleInput}
                style={{
                  borderRadius: "8px",
                  background: "white",
                  padding: "12px",
                }}
              >
                <option value="">Select Role</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Permissions Section */}
            <div className="mb-3">
              <h6
                className="fw-bold mb-3 d-flex align-items-center"
                style={{ color: "#2f3e46" }}
              >
                <CheckSquare size={18} className="me-2" /> Permissions
              </h6>

              <div
                className="p-3 rounded"
                style={{
                  background: "white",
                  border: "2px dashed #f6f0e4",
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
              >
                <div className="row g-2">
                  {PERMISSION_LIST.map((p) => (
                    <div key={p.id} className="col-md-6">
                      <label
                        className="d-flex align-items-center p-2 rounded cursor-pointer"
                        style={{
                          cursor: "pointer",
                          background: formData.permissions.includes(p.id)
                            ? "#c5ebaa"
                            : "#f6f0e4",
                          transition: "all 0.2s",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(p.id)}
                          onChange={() => togglePermission(p.id)}
                          className="form-check-input me-2"
                          style={{
                            cursor: "pointer",
                            borderColor: "#2f3e46",
                          }}
                        />
                        <span
                          className="small fw-semibold"
                          style={{ color: "#2f3e46" }}
                        >
                          {p.label}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className="p-4 d-flex gap-3 justify-content-end"
            style={{ background: "#f6f0e4" }}
          >
            <button
              className="btn px-4 py-2 fw-semibold"
              onClick={onClose}
              style={{
                background: "white",
                color: "#575757",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
              }}
            >
              Cancel
            </button>

            <button
              className="btn px-4 py-2 fw-semibold shadow-sm"
              onClick={handleSubmit}
              style={{
                background: "linear-gradient(135deg, #2f3e46 0%, #5d4037 100%)",
                color: "#fefbe9",
                border: "none",
                borderRadius: "8px",
              }}
            >
              {editUser ? "Update User" : "Create User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminUserModal;
