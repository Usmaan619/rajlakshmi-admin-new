import React, { useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import {
  IoIosSearch,
  IoIosArrowRoundForward,
  IoIosArrowRoundBack,
  IoIosArrowDown,
} from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { PiPencilSimple } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { NavLink } from "react-router-dom";
import Customer from "../../Assets/Images/Logo/mainlogo.png";
import noDataImg from "../../Assets/Images/home-img/flat-design-no-data-illustration.png";

// Rajlaxmi-Admin-Panel/src/components/Assets/Images/Logo/mainlogo.png

const CustomerTable = ({ CustomerData }) => {
  console.log(CustomerData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const itemsPerPage = 8;

  const filteredProducts = CustomerData?.filter((item) => {
    const nameMatch = item.full_name
      ?.toLowerCase()
      ?.includes(searchTerm?.toLowerCase());

    const emailMatch = item.email
      ?.toLowerCase()
      ?.includes(searchTerm?.toLowerCase());

    const mobileMatch = item.mobile_number
      ?.toLowerCase()
      ?.includes(searchTerm?.toLowerCase());

    const idMatch = String(item.id)
      ?.toLowerCase()
      ?.includes(searchTerm?.toLowerCase());

    const filterCondition =
      selectedFilter === "All"
        ? true
        : selectedFilter === "In Stock"
          ? item.status === "active"
          : item.status !== "active";

    return (
      (nameMatch || emailMatch || mobileMatch || idMatch) && filterCondition
    );
  });

  const totalPages = Math?.ceil(filteredProducts?.length / itemsPerPage);
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const isRajlaxmi = window.location.pathname.includes("rajlaxmi");

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      {!CustomerData?.length ? (
        <div className="text-center d-flex flex-column align-items-center ">
          <img src={noDataImg} alt="No Data" className="no-data-img mb-3" />
          <h3>No Customer Data Found</h3>
        </div>
      ) : (
        <div className="recent-table bg-white">
          <p className="p-3 recent-tble-header text-murmaid-color bg-light-green-color font-20 inter-font-family-500">
            Customer
          </p>

          {/* Filters */}
          <form className="row gy-3 px-lg-5 px-3 pb-4 pt-2 w-100">
            <div className="col-lg-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <IoIosSearch />
                </span>
                <input
                  className="form-control border border-start-0"
                  type="search"
                  placeholder="Search by Name, Email or Mobile"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </form>

          <div className="table-responsive customer-table-wrapper">
            <table className="table text-nowrap fixed-table">
              <thead className="text-center">
                <tr>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    ID
                  </th>
                  <th className="text-start text-dark-silver-color inter-font-family-500 align-middle ps-5">
                    <div className="d-flex align-items-center">Name</div>
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Email
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Mobile No
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Status
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Joined
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-center">
                {paginatedProducts?.map((c, index) => (
                  <tr key={index}>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      {c?.id}
                    </td>

                    <td className="text-murmaid-color inter-font-family-400 align-middle ps-5 text-start">
                      <div className="d-flex align-items-center">
                        {c?.full_name}
                      </div>
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      {c?.email}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      {c?.mobile_number}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      <span
                        className={`badge ${c?.status === "active" ? "bg-success" : "bg-danger"}`}
                      >
                        {c?.status}
                      </span>
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      {new Date(c?.created_at).toLocaleDateString()}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      <div className="d-flex align-items-center justify-content-center">
                        <NavLink
                          to={`/customerinfo?customerData=${encodeURIComponent(JSON.stringify(c))}`}
                        >
                          <span className="border-2 border eye-icon-color fs-5 p-1 rounded-3 d-flex align-items-center justify-content-center">
                            <IoEyeOutline />
                          </span>
                        </NavLink>
                        {isRajlaxmi && (
                          <>
                            <NavLink to={"/customerinfo"}>
                              <span className="border-2 border edit-icon-color fs-5 p-1 rounded-3 mx-3 d-flex align-items-center justify-content-center">
                                <PiPencilSimple />
                              </span>
                            </NavLink>
                            <span
                              className="border-2 border trash-icon-color fs-5 p-1 rounded-3 d-flex align-items-center justify-content-center"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              <RiDeleteBinLine />
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Render Empty Rows if needed to fill the table */}
                {Array.from({
                  length: itemsPerPage - paginatedProducts?.length,
                }).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td colSpan="7" className="empty_row"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex align-items-center justify-content-left">
            <Pagination className="border-0">
              <Pagination.Prev
                className="fs-3"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <IoIosArrowRoundBack />
              </Pagination.Prev>
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                className="fs-3"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <IoIosArrowRoundForward />
              </Pagination.Next>
            </Pagination>
          </div>
        </div>
      )}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <p
                className="modal-title font-16 inter-font-family-600 text-murmaid-color"
                id="exampleModalLabel"
              >
                Delete Items
              </p>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body inter-font-family-400 text-murmaid-color font-14 pt-0">
              Are you sure you want to delete 4 selected items?
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="font-12 inter-font-family-400 text-murmaid-color border-0 bg-transparent"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="border-0 px-3 py-2 rounded font-12 inter-font-family-500 text-murmaid-color bg-light-green-color"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerTable;
