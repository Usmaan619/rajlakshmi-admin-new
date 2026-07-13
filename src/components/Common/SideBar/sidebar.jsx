import React, { useState, useEffect, useContext } from "react";
import "./sidebar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiLogOut } from "react-icons/fi";
import { GoListUnordered } from "react-icons/go";
import { LiaTagSolid } from "react-icons/lia";
import {
  MdConnectWithoutContact,
  MdPeopleOutline,
  MdSlowMotionVideo,
} from "react-icons/md";
import { BiPhone } from "react-icons/bi";
import { FaRegCommentDots, FaBars, FaUsers, FaYoutube } from "react-icons/fa6";

import LogoRajlaxmi from "../../Assets/Images/Logo/rajlaxmi.svg";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { UserContext } from "../../../Context/UserContext";
import { PiFlagBannerFold } from "react-icons/pi";
import { LayoutPanelTop, RibbonIcon } from "lucide-react";
import { IoNewspaperOutline } from "react-icons/io5";

const isTabletWidth = () =>
  typeof window !== "undefined" &&
  window.innerWidth >= 768 &&
  window.innerWidth <= 1024;

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(isTabletWidth());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { setUserLogin, userPermissions, setUserPermissions } =
    useContext(UserContext);

  const isRajlaxmi = location.pathname.includes("/rajlaxmi");

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const hasPermission = (required) => {
    if (!required) return true;
    if (!userPermissions) return false;
    return (
      userPermissions.includes(required) || userPermissions.includes("all")
    );
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 768 && width <= 1024) {
        setIsMobileOpen(true);
        setIsCollapsed(false);
      } else if (width > 1024) {
        setIsMobileOpen(false);
      } else {
        setIsMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("permissions");
    setUserLogin(null);
    setUserPermissions([]);
    navigate("/login");
  };

  const gauswarnLinks = [
    { to: "/home", icon: FiHome, label: "Dashboard" },
    {
      to: "/order",
      icon: GoListUnordered,
      label: "Orders",
      permission: "orders",
    },
    {
      to: "/home-page-banner-change",
      icon: PiFlagBannerFold,
      label: "Home Banner",
      permission: "banners",
    },
    {
      to: "/reels-upload",
      icon: MdSlowMotionVideo,
      label: "Reels",
      permission: "reels",
    },
    {
      to: "/youtube-shorts",
      icon: FaYoutube,
      label: "YouTube Shorts",
      permission: "reels",
    },

    {
      to: "/blog",
      icon: LayoutPanelTop,
      label: "Blogs",
      permission: "blogs",
    },
    {
      to: "/create-admin-user",
      icon: FaUsers,
      label: "Create Users",
      permission: "users",
    },
    {
      to: "/productinfo",
      icon: LiaTagSolid,
      label: "Products",
      permission: "products",
    },
    {
      to: "/customer",
      icon: MdPeopleOutline,
      label: "Customers",
      permission: "customers",
    },
    {
      to: "/inquiry",
      icon: MdConnectWithoutContact,
      label: "B2B Inquiry",
      permission: "b2b",
    },
    {
      to: "/contact",
      icon: BiPhone,
      label: "Contact",
      permission: "contact",
    },
    {
      to: "/newlatter",
      icon: IoNewspaperOutline,
      label: "Newsletter",
      permission: "newsletter",
    },
    {
      to: "/offerBanner",
      icon: RibbonIcon,
      label: "Offer Banner",
      permission: "offerbanner",
    },
    {
      to: "/feedback",
      icon: FaRegCommentDots,
      label: "Feedback",
      permission: "feedback",
    },
  ];

  const links = isRajlaxmi ? [] : gauswarnLinks;

  return (
    <>
      {/* Mobile / Tablet Toggle Button */}
      <button
        className={`mobile-toggle-btn ${isMobileOpen ? "tablet-open" : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isMobileOpen &&
        window.innerWidth <= 1024 &&
        window.innerWidth >= 768 ? (
          <IoIosArrowBack />
        ) : isMobileOpen ? (
          "✕"
        ) : (
          <FaBars />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "open" : ""
        }`}
      >
        {/* Logo Section */}
        <div className="logo-container">
          {!isCollapsed && (
            <img
              src={LogoRajlaxmi}
              className="rajlaxmi-logo"
              alt="Rajlaxmi Logo"
            />
          )}
          {isCollapsed && (
            <img
              src={LogoRajlaxmi}
              style={{
                width: "36px",
                height: "36px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
              alt="Logo"
            />
          )}
          <button
            className="desktop-toggle-btn"
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
          </button>
        </div>

        {/* Section Label */}
        {!isCollapsed && <div className="sidebar-section-label">Main Menu</div>}

        {/* Nav Links */}
        <nav className="nav-links">
          {links.map(({ to, icon: Icon, label, permission }) => {
            if (!hasPermission(permission)) return null;

            const hoverClass = isRajlaxmi ? "rajlaxmi-hover" : "gauswarn-hover";

            return (
              <NavLink
                key={to}
                to={to}
                data-label={label}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-2 ${hoverClass} ${
                    isActive
                      ? isRajlaxmi
                        ? "active-rajlaxmi"
                        : "active-gauswarn"
                      : ""
                  }`
                }
              >
                <span className="icon">
                  <Icon />
                </span>
                {!isCollapsed && <span className="label">{label}</span>}
              </NavLink>
            );
          })}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Logout */}
          <NavLink
            to="/"
            data-label="Logout"
            onClick={handleLogout}
            className={`d-flex align-items-center gap-2 ${
              isRajlaxmi ? "rajlaxmi-hover" : "gauswarn-hover"
            }`}
            style={{
              marginTop: "auto",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "14px",
              color: "rgba(239, 68, 68, 0.75)",
            }}
          >
            <span className="icon" style={{ color: "rgba(239, 68, 68, 0.75)" }}>
              <FiLogOut />
            </span>
            {!isCollapsed && (
              <span
                className="label"
                style={{ color: "rgba(239, 68, 68, 0.75)" }}
              >
                Logout
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
