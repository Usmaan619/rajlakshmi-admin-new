import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { clearCache, getItem } from "../../../Services/storage.service";
import "./navbar.css";

import { FaExchangeAlt, FaChevronDown } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import profile from "../../Assets/Images/navbar/User-60.svg";
import { UserContext } from "../../../Context/UserContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRajlaxmi = location.pathname.startsWith("/rajlaxmi");

  const title = isRajlaxmi ? "Gauswarn Dashboard" : "Rajlaxmi Dashboard";
  const linkTo = isRajlaxmi ? "/home" : "/rajlaxmi";

  const { setUserLogin } = useContext(UserContext);

  const handleLogout = () => {
    clearCache("token");
    clearCache("email");
    clearCache("name");
    setUserLogin(null);
    navigate("/");
  };

  const userName = getItem("name") || "";
  const userEmail = getItem("email") || "";

  return (
    <div className="navbar-container">
      <div className="navbar-row d-flex flex-wrap justify-content-end align-items-center">
        {/* Switch Dashboard Button */}
        <NavLink to={linkTo} className="text-decoration-none">
          <div
            className="dashboard-btn"
            style={{
              background: isRajlaxmi
                ? "linear-gradient(135deg, #92400e, #78350f)"
                : "linear-gradient(135deg, #e07a5f, #c96745)",
            }}
          >
            <FaExchangeAlt size={13} />
            <span>{title}</span>
          </div>
        </NavLink>

        {/* Profile Button */}
        <button
          className="btn d-flex align-items-center profile-section"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#profileModal"
        >
          <img src={profile} alt="Profile" className="profile-img me-2" />
          <span className="username me-1 text-capitalize">{userName}</span>
          <FaChevronDown className="dropdown-icon" />
        </button>

        {/* Profile Modal */}
        <div
          className="modal fade"
          id="profileModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-sm modal-dialog-end">
            <div className="modal-content border-0 p-0">
              <ul className="list-unstyled mb-0">
                {/* Profile Header */}
                <li className="px-4 py-4 text-center">
                  <div className="position-relative d-inline-block mb-3">
                    <img
                      src={profile}
                      alt="avatar"
                      className="rounded-circle"
                      width="52"
                      height="52"
                      style={{
                        border: "3px solid #e07a5f",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: 2,
                        width: 11,
                        height: 11,
                        background: "#10b981",
                        border: "2px solid white",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <h6
                    className="mb-1 fw-700 text-uppercase"
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {userName}
                  </h6>
                  <small style={{ color: "#94a3b8", fontSize: "12px" }}>
                    {userEmail}
                  </small>
                </li>

                <li>
                  <hr
                    className="dropdown-divider m-0"
                    style={{ borderColor: "rgba(226, 232, 240, 0.8)" }}
                  />
                </li>

                {/* Logout */}
                <li className="text-center py-3 px-4">
                  <button
                    className={`btn shadow-none w-100 ${isRajlaxmi ? "logout-btn-orange" : "logout-btn-brown"}`}
                    onClick={handleLogout}
                    data-bs-dismiss="modal"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
