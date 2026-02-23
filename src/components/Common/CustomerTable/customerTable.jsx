import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const itemsPerPage = 8;

  const filteredProducts = CustomerData?.filter((item) => {
    const nameMatch = item.user_name
      ?.toLowerCase()
      ?.includes(searchTerm?.toLowerCase());

    const pincodeMatch = String(item.user_pincode)
      ?.toLowerCase()
      ?.includes(searchTerm?.toLowerCase());

    const filterCondition =
      selectedFilter === "All"
        ? true
        : selectedFilter === "In Stock"
          ? item.user_landmark !== "Out Of location"
          : item.user_landmark === "Out Of location";

    return (nameMatch || pincodeMatch) && filterCondition;
  });

  const totalPages = Math?.ceil(filteredProducts?.length / itemsPerPage);
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
            {/* <div className="col-12 col-sm-6 col-lg-2">
              <Dropdown className='border rounded-3 w-100'>
                <Dropdown.Toggle variant="white" className="d-flex justify-content-between align-items-center w-100">
                  <span>{selectedFilter || "Filter"}</span>
                  <span className="ms-auto"><IoIosArrowDown /></span>
                </Dropdown.Toggle>
                <Dropdown.Menu className='w-100'>
                  <Dropdown.Item onClick={() => setSelectedFilter('')}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedFilter('Pending')}>Pending</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedFilter('Shipped')}>Shipped</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedFilter('Delivered')}>Delivered</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedFilter('Cancel')}>Cancel</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div> */}

            <div className='col-lg-4'>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><IoIosSearch /></span>
                <input
                  className="form-control border border-start-0"
                  type="search"
                  placeholder="Search by Name or CustomerID"
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
                    Customer ID
                  </th>
                  <th className="text-start text-dark-silver-color inter-font-family-500 align-middle ps-5">
                    <div className="d-flex align-items-center">Name</div>
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Location
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Pincode
                  </th>
                  <th className="text-dark-silver-color inter-font-family-500 align-middle">
                    Amount
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
                      {c?.user_id}
                    </td>

                    <td className="text-murmaid-color inter-font-family-400 align-middle ps-5">
                      <div className="d-flex align-items-center">
                        {c?.user_name}
                      </div>
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      {c?.user_landmark}, {c?.user_city}, {c?.user_state}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      {c?.user_pincode}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      ₹ {c?.user_total_amount ?? "-"}
                    </td>
                    <td className="text-murmaid-color inter-font-family-400 align-middle">
                      <div className="d-flex align-items-center justify-content-center">
                        <NavLink
                          to={`/customerinfo?customerData=${JSON.stringify(c)}`}
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
                    <td colSpan="6" className="empty_row"></td>
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
