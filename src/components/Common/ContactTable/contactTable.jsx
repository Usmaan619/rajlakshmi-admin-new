import React, { useState, useMemo } from "react";
import Pagination from "react-bootstrap/Pagination";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import noDataImg from "../../Assets/Images/home-img/flat-design-no-data-illustration.png";
import moment from "moment";

const ITEMS_PER_PAGE = 10;

const ContactTable = React.memo(({ ContactData = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ContactData.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const paginatedContact = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return ContactData.slice(start, start + ITEMS_PER_PAGE);
  }, [ContactData, currentPage]);

  if (!ContactData.length) {
    return (
      <div className="text-center d-flex flex-column align-items-center">
        <img src={noDataImg} alt="No Data" className="no-data-img mb-3" />
        <h3>No Contact Data Found</h3>
      </div>
    );
  }

  return (
    <div className="recent-table bg-white">
      <p className="p-3 recent-tble-header text-murmaid-color bg-light-green-color font-20 inter-font-family-500">
        Contact
      </p>

      {/* ===== TABLE ===== */}
      <div className="table-responsive">
        <table
          className="table text-nowrap align-middle"
          style={{ minWidth: "1100px" }}
        >
          <thead className="text-center">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Create Date</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {paginatedContact.map((item, index) => (
              <tr key={item.id ?? `${item.user_email}-${index}`}>
                <td>{item.user_name || "-"}</td>
                <td>{item.user_email || "-"}</td>
                <td>{item.user_mobile || "-"}</td>
                <td>{item.user_subject || "-"}</td>
                <td>
                  {item.created_at
                    ? moment(item.created_at).format(
                        "DD MMM YYYY, hh:mm A",
                      )
                    : "-"}
                </td>
                <td
                  style={{
                    maxWidth: "300px",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                  title={item.user_message}
                >
                  {item.user_message || "-"}
                </td>
              </tr>
            ))}

            {/* ===== EMPTY ROWS ===== */}
            {Array.from({
              length: ITEMS_PER_PAGE - paginatedContact.length,
            }).map((_, i) => (
              <tr key={`empty-${i}`} style={{ height: "52px" }}>
                <td colSpan="6"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="d-flex p-3 align-items-center">
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
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
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <IoIosArrowRoundForward />
            </Pagination.Next>
          </Pagination>
        </div>
      )}
    </div>
  );
});

export default ContactTable;
