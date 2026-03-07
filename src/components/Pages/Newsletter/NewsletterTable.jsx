import React from "react";
import Pagination from "react-bootstrap/Pagination";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { deleteDataNew, postData } from "../../Common/APIs/api";
import { toastSuccess } from "../../../Services/toast.service";
import "./newsletter.css"; // 👈 CSS import

const NewsletterTable = ({
  data,
  pagination,
  filters,
  setFilters,
  refresh,
}) => {
  const changePage = (p) => {
    if (p >= 1 && p <= pagination.totalPages)
      setFilters({ ...filters, page: p });
  };

  const updateStatus = async (id, status) => {
    await postData(`admin/updateNewsletterStatus/${id}`, { status });
    refresh();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this email?")) return;
    await deleteDataNew(`admin/deleteNewsletter/${id}`);
    toastSuccess("Deleted");
    refresh();
  };

  return (
    <div className="recent-table bg-white">
      <p className="p-3 font-20 bg-light-green-color">Newsletter Subscribers</p>

      {/* 🔹 Newsletter Search Input */}
      <div className="newsletter-input-wrapper">
        <label className="newsletter-label">Newsletter Email</label>
        <input
          type="text"
          className="newsletter-input"
          placeholder="Search by email"
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 1 })
          }
        />
      </div>

      <table className="table text-center mt-3">
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((i) => (
            <tr key={i.id}>
              <td>{i.email}</td>
              <td>
                <select
                  value={i.status}
                  className="form-select"
                  onChange={(e) => updateStatus(i.id, e.target.value)}
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => remove(i.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <Pagination className="p-3">
        <Pagination.Prev
          disabled={filters.page === 1}
          onClick={() => changePage(filters.page - 1)}
        >
          <IoIosArrowRoundBack />
        </Pagination.Prev>

        {Array.from({ length: pagination.totalPages || 0 }, (_, i) => (
          <Pagination.Item
            key={i}
            active={filters.page === i + 1}
            onClick={() => changePage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          disabled={filters.page === pagination.totalPages}
          onClick={() => changePage(filters.page + 1)}
        >
          <IoIosArrowRoundForward />
        </Pagination.Next>
      </Pagination>
    </div>
  );
};

export default NewsletterTable;
