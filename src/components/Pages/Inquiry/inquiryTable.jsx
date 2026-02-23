import React, { useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { deleteData, deleteDataNew, postData } from "../../Common/APIs/api";
import noDataImg from "../../Assets/Images/home-img/flat-design-no-data-illustration.png";
import { toastError, toastSuccess } from "../../../Services/toast.service";

const InquiryTable = ({
  inquiries,
  pagination,
  filters,
  setFilters,
  refresh,
}) => {
  const [viewData, setViewData] = useState(null);

  const changePage = (num) => {
    if (num >= 1 && num <= pagination.totalPages) {
      setFilters({ ...filters, page: num });
    }
  };

  // DELETE INQUIRY
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?"))
      return;

    console.log("Deleting ID:", id);

    const response = await deleteDataNew(`/deleteb2bInquiry/${id}`);

    if (response?.success) {
      toastSuccess("Inquiry deleted successfully!");
      refresh();
    } else {
      toastError(response?.message || "Failed to delete inquiry");
    }
  };

  // UPDATE STATUS USING POST (as required)
  const updateStatus = async (id, status) => {
    const response = await postData(`/updateb2bInquiry/${id}`, { status });
    if (response?.success) refresh();
  };

  return (
    <div>
      {/* SEARCH + FILTERS */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search inquiry..."
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 1 })
          }
        />

        <select
          className="form-select w-25"
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value, page: 1 })
          }
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {!inquiries?.length ? (
        <div className="text-center d-flex flex-column align-items-center">
          <img src={noDataImg} alt="No Data" className="no-data-img mb-3" />
          <h3>No Inquiry Found</h3>
        </div>
      ) : (
        <div className="recent-table bg-white">
          <p className="p-3 font-20 inter-font-family-500 bg-light-green-color">
            B2B Inquiries
          </p>

          <div className="table-responsive">
            <table className="table text-nowrap align-middle">
              <thead className="text-center">
                <tr>
                  <th>Name</th>
                  <th>Business</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Business Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {inquiries?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.full_name}</td>
                    <td>{item.business_name}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>{item.business_type}</td>

                    <td>
                      <select
                        className="form-select"
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                      >
                        <option value="new">New</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => setViewData(item)}
                      >
                        View
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="d-flex p-3 align-items-center">
            <Pagination>
              <Pagination.Prev
                onClick={() => changePage(filters.page - 1)}
                disabled={filters.page === 1}
              >
                <IoIosArrowRoundBack />
              </Pagination.Prev>

              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={filters.page === i + 1}
                  onClick={() => changePage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                onClick={() => changePage(filters.page + 1)}
                disabled={filters.page === pagination.totalPages}
              >
                <IoIosArrowRoundForward />
              </Pagination.Next>
            </Pagination>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewData && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Inquiry Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setViewData(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p>
                  <strong>Name:</strong> {viewData.full_name}
                </p>
                <p>
                  <strong>Business:</strong> {viewData.business_name}
                </p>
                <p>
                  <strong>Phone:</strong> {viewData.phone}
                </p>
                <p>
                  <strong>Email:</strong> {viewData.email}
                </p>
                <p>
                  <strong>Business Type:</strong> {viewData.business_type}
                </p>
                <p>
                  <strong>Monthly Requirement:</strong>{" "}
                  {viewData.monthly_requirement}
                </p>
                <p>
                  <strong>Message:</strong> {viewData.message}
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewData(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryTable;
