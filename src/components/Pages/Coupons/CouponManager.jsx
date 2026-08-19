import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import {
  getData,
  postData,
  updateData,
  deleteData,
} from "../../Common/APIs/api";
import { toastError, toastSuccess } from "../../../Services/toast.service";
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  Calendar,
  Percent,
  Check,
  X,
  Ticket,
} from "lucide-react";

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percent",
    discount_value: "",
    min_order_value: 0,
    max_discount: "",
    usage_limit: "",
    expiry_date: "",
    is_active: 1,
  });

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getData("admin/coupons");

      // Handle both {success: true, data: []} and direct array [] responses
      if (res) {
        if (Array.isArray(res)) {
          setCoupons(res);
        } else if (res.success || res.status === 200) {
          setCoupons(res.data || res.coupons || res.coupon || []);
        } else if (typeof res === "object" && !res.hasOwnProperty("success")) {
          // Fallback for direct object response
          setCoupons(Array.isArray(res) ? res : []);
        }
      }
    } catch (err) {
      toastError("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleActive = async (coupon) => {
    try {
      const res = await updateData("admin/coupons", coupon.id, {
        is_active: coupon.is_active ? 0 : 1,
      });
      if (res.data?.success) {
        toastSuccess(
          `Coupon ${coupon.is_active ? "deactivated" : "activated"}`,
        );
        fetchCoupons();
      }
    } catch (err) {
      toastError("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        const res = await deleteData("admin/coupons", id);
        if (res.success) {
          toastSuccess("Coupon deleted");
          fetchCoupons();
        }
      } catch (err) {
        toastError("Failed to delete coupon");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, CODE: formData.code || formData.CODE };
      let res;
      if (editingCoupon) {
        res = await updateData(
          "admin/coupons",
          editingCoupon.id || editingCoupon.coupon_id,
          payload,
        );
      } else {
        res = await postData("admin/coupons", payload);
      }

      if (res.data?.success) {
        toastSuccess(
          `Coupon ${editingCoupon ? "updated" : "created"} successfully`,
        );
        setShowModal(false);
        resetForm();
        fetchCoupons();
      } else {
        toastError(res.data?.message || "Operation failed");
      }
    } catch (err) {
      toastError(err?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discount_type: "percent",
      discount_value: "",
      min_order_value: 0,
      max_discount: "",
      usage_limit: "",
      expiry_date: "",
      is_active: 1,
    });
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);

    let formattedDate = "";
    if (coupon.expiry_date) {
      try {
        formattedDate = new Date(coupon.expiry_date)
          .toISOString()
          .split("T")[0];
      } catch (e) {
        formattedDate = coupon.expiry_date;
      }
    }

    setFormData({
      code: coupon.CODE || coupon.code || coupon.coupon_code || "",
      discount_type: coupon.discount_type || "percent",
      discount_value:
        coupon.discount_value !== undefined
          ? coupon.discount_value
          : coupon.value || "",
      min_order_value:
        coupon.min_order_value !== undefined
          ? coupon.min_order_value
          : coupon.min_value || 0,
      max_discount: coupon.max_discount || "",
      usage_limit: coupon.usage_limit || coupon.limit || "",
      expiry_date: formattedDate,
      is_active: coupon.is_active !== undefined ? coupon.is_active : 1,
    });

    setShowModal(true);
  };

  return (
    <div className="container-fluid gauswarn-bg-color min-vh-100 px-4">
      <Navbar title="Coupon Management" />

      <div className="row">
        <div className="col-lg-2">
          <SideBar />
        </div>

        <div className="col-lg-10 px-lg-5 py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">
                <Ticket className="me-2" size={28} />
                Coupon Manager
              </h2>
              <p className="text-muted mb-0">
                Create and manage your discount codes for users
              </p>
            </div>
            <button
              className="btn btn-lg px-4 shadow-sm text-white border-0"
              style={{
                background:
                  "linear-gradient(135deg, #d23636ff 0%, #7c213eff 100%)",
              }}
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              <Plus size={20} className="me-2" /> Add New Coupon
            </button>
          </div>

          <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
            <div className="card-header bg-white py-3 border-0">
              <h5 className="mb-0 fw-semibold text-murmaid-color">
                Active Coupons List
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3">Coupon Details</th>
                      <th className="py-3">Discount Type</th>
                      <th className="py-3">Value</th>
                      <th className="py-3">Requirements</th>
                      <th className="py-3">Usage Stat</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 text-end px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          ></div>
                          <p className="mt-2 text-muted">Loading coupons...</p>
                        </td>
                      </tr>
                    ) : coupons.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          No coupons found. Start by creating one!
                        </td>
                      </tr>
                    ) : (
                      coupons.map((coupon, index) => (
                        <tr key={coupon.id || index}>
                          <td className="px-4">
                            <div className="d-flex align-items-center gap-3">
                              <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success">
                                <Tag size={20} />
                              </div>
                              <div>
                                <span className="fw-bold d-block text-uppercase">
                                  {coupon.CODE ||
                                    coupon.code ||
                                    coupon.coupon_code ||
                                    "N/A"}
                                </span>
                                <small className="text-muted">
                                  <Calendar size={12} className="me-1" />
                                  Exp:{" "}
                                  {coupon.expiry_date
                                    ? new Date(
                                        coupon.expiry_date,
                                      ).toLocaleDateString()
                                    : "No Expiry"}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {(coupon.discount_type || coupon.type) ===
                              "percent" ? (
                                <span className="badge bg-info-subtle text-info rounded-pill px-3">
                                  Percentage
                                </span>
                              ) : (
                                <span className="badge bg-warning-subtle text-warning rounded-pill px-3">
                                  Fixed Amount
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="fw-semibold">
                              {(coupon.discount_type || coupon.type) ===
                              "percent"
                                ? `${coupon.discount_value || coupon.value || 0}%`
                                : `₹${coupon.discount_value || coupon.value || 0}`}
                            </span>
                            {(coupon.max_discount || coupon.max_off) && (
                              <small className="text-muted d-block opacity-75">
                                Max Off: ₹
                                {coupon.max_discount || coupon.max_off}
                              </small>
                            )}
                          </td>
                          <td>
                            <small className="d-block">
                              Min Order:{" "}
                              <b>
                                ₹
                                {coupon.min_order_value ||
                                  coupon.min_value ||
                                  0}
                              </b>
                            </small>
                            <small className="d-block text-muted">
                              Limit:{" "}
                              {coupon.usage_limit ||
                                coupon.limit ||
                                "Unlimited"}
                            </small>
                          </td>
                          <td>
                            <div
                              className="d-flex align-items-center gap-2"
                              style={{ maxWidth: "120px" }}
                            >
                              <div
                                className="progress flex-grow-1"
                                style={{ height: "6px" }}
                              >
                                <div
                                  className="progress-bar bg-success rounded shadow-sm"
                                  role="progressbar"
                                  style={{
                                    width: `${Math.min(((coupon.used_count || 0) / (coupon.usage_limit || coupon.limit || 1)) * 100, 100)}%`,
                                  }}
                                ></div>
                              </div>
                              <small className="fw-medium">
                                {coupon.used_count || 0}/
                                {coupon.usage_limit || coupon.limit || "∞"}
                              </small>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge ${coupon.is_active == 1 || coupon.is_active === true ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"} rounded-pill px-3`}
                            >
                              {coupon.is_active == 1 ||
                              coupon.is_active === true
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>
                          <td className="text-end px-4">
                            <div className="btn-group shadow-sm">
                              <button
                                className={`btn btn-sm ${coupon.is_active == 1 || coupon.is_active === true ? "btn-white text-danger" : "btn-white text-success"}`}
                                onClick={() => handleToggleActive(coupon)}
                                title={
                                  coupon.is_active == 1 ||
                                  coupon.is_active === true
                                    ? "Deactivate"
                                    : "Activate"
                                }
                              >
                                {coupon.is_active == 1 ||
                                coupon.is_active === true ? (
                                  <X size={18} />
                                ) : (
                                  <Check size={18} />
                                )}
                              </button>
                              <button
                                className="btn btn-sm btn-white text-primary"
                                onClick={() => openEditModal(coupon)}
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                className="btn btn-sm btn-white text-danger"
                                onClick={() =>
                                  handleDelete(coupon.id || coupon.coupon_id)
                                }
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Modern Styled */}
      {showModal && (
        <div
          className="modal show d-block animate__animated animate__fadeIn"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div
                className="modal-header border-0 text-white p-4"
                style={{
                  background:
                    "linear-gradient(135deg, #d23636ff 0%, #7c213eff 100%)",
                }}
              >
                <h5 className="modal-title d-flex align-items-center gap-2 fw-bold">
                  {editingCoupon ? <Edit size={22} /> : <Plus size={22} />}
                  {editingCoupon ? "Update Coupon" : "Create New Coupon"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4 bg-light">
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark small text-uppercase mb-2">
                      Coupon Code
                    </label>
                    <div className="input-group shadow-sm">
                      <span className="input-group-text bg-white border-end-0">
                        <Tag size={18} className="text-success" />
                      </span>
                      <input
                        type="text"
                        className="form-control text-uppercase border-start-0 ps-0 fw-bold"
                        name="code"
                        value={formData.code || formData.CODE}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. WELCOME100"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small text-uppercase mb-2">
                        Discount Type
                      </label>
                      <select
                        className="form-select shadow-sm border-0 bg-white"
                        name="discount_type"
                        value={formData.discount_type}
                        onChange={handleInputChange}
                      >
                        <option value="percent">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small text-uppercase mb-2">
                        Discount Value
                      </label>
                      <div className="input-group shadow-sm">
                        <span className="input-group-text bg-white border-end-0">
                          {formData.discount_type === "percent" ? (
                            <Percent size={16} />
                          ) : (
                            "₹"
                          )}
                        </span>
                        <input
                          type="number"
                          className="form-control border-start-0 ps-0"
                          name="discount_value"
                          value={formData.discount_value}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small text-uppercase mb-2">
                        Min Order (₹)
                      </label>
                      <input
                        type="number"
                        className="form-control shadow-sm border-0"
                        name="min_order_value"
                        value={formData.min_order_value}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small text-uppercase mb-2">
                        Max Off (₹)
                      </label>
                      <input
                        type="number"
                        className="form-control shadow-sm border-0"
                        name="max_discount"
                        value={formData.max_discount}
                        placeholder="Optional"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small text-uppercase mb-2">
                        Usage Limit
                      </label>
                      <input
                        type="number"
                        className="form-control shadow-sm border-0"
                        name="usage_limit"
                        value={formData.usage_limit}
                        onChange={handleInputChange}
                        required
                        placeholder="Total uses"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small text-uppercase mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        className="form-control shadow-sm border-0"
                        name="expiry_date"
                        value={formData.expiry_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 bg-light p-4 pt-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 rounded-pill"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success px-5 rounded-pill shadow-sm fw-bold"
                  >
                    {editingCoupon ? "Update Now" : "Create Coupon"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .btn-white {
          background-color: white;
          border: 1px solid #eee;
        }
        .btn-white:hover {
          background-color: #f8f9fa;
        }
        .text-murmaid-color {
          color: #ff8f00;
        }
        .bg-success-subtle {
          background-color: #e7f3eb !important;
          color: #ff8f00 !important;
        }
        .bg-info-subtle {
          background-color: #e3f2fd !important;
          color: #01579b !important;
        }
        .bg-warning-subtle {
          background-color: #fff8e1 !important;
          color: #ff8f00 !important;
        }
        .card {
          transition: transform 0.2s;
        }
        .table thead th {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default CouponManager;
