import React, { useState, useRef, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { DropdownContext } from "../../../Context/DropdownContext";
import "./dropdown.css";

function FilterDropdown() {
  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [showYearly, setShowYearly] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedType, setSelectedType] = useState("last7days");

  const dropdownRef = useRef(null);
  const location = useLocation();
  const isGauswarnDashboard = location.pathname !== "/rajlaxmi";

  const { setDropdownData } = useContext(DropdownContext);

  const years = [2025, 2026, 2027, 2028, 2029, 2030];

  const monthsByYear = years.reduce((acc, year) => {
    acc[year] = [...Array(12)].map((_, i) => ({
      label: new Date(year, i).toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      value: i + 1,
    }));
    return acc;
  }, {});

  const toggleMonth = (monthObj) => {
    let updatedMonths;

    if (selectedMonths.some((m) => m.label === monthObj.label)) {
      updatedMonths = [];
    } else {
      updatedMonths = [monthObj];
    }

    setSelectedType("monthly");
    setSelectedMonths(updatedMonths);

    const monthString = updatedMonths
      .map((m) => String(m.value).padStart(2, "0"))
      .join(",");

    setDropdownData({
      filterType: "monthly",
      month: monthString,
      year: selectedYear,
    });
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedType("yearly");
    setSelectedMonths([]);
    setShowMonthly(true);
    setShowYearly(false);
    setDropdownData({
      filterType: "yearly",
      month: null,
      year: year,
    });
  };

  const handleMonthlyClick = () => {
    setSelectedType("monthly");
    setShowMonthly(!showMonthly);
    setShowYearly(false);
  };

  const handleLast7Days = () => {
    setSelectedType("last7days");
    setSelectedMonths([]);
    setSelectedYear(null);
    setShowMonthly(false);
    setShowYearly(false);
    setShowMainDropdown(false);
    setDropdownData({
      filterType: "last7days",
      month: null,
      year: null,
    });
  };

  const renderDateDisplay = () => {
    if (selectedType === "monthly" && selectedMonths.length > 0) {
      return selectedMonths.map((m) => m.label).join(", ");
    } else if (selectedType === "yearly" && selectedYear) {
      return selectedYear;
    } else {
      return "Last 7 Days";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMainDropdown(false);
        setShowMonthly(false);
        setShowYearly(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="filter-container" ref={dropdownRef}>
      <div
        className={`date-display ${isGauswarnDashboard ? "rajlaxmi-date-display" : ""}`}
      >
        {renderDateDisplay()}
      </div>

      <div className="dropdown">
        <button
          className={`custom-btn d-flex justify-content-between text-capitalize align-items-center ${isGauswarnDashboard ? "rajlaxmi-btn" : ""}`}
          onClick={() => {
            setShowMainDropdown(!showMainDropdown);
            setShowMonthly(false);
            setShowYearly(false);
          }}
        >
          {selectedType === "last7days" ? "Last 7 Days" : selectedType}{" "}
          <span className="ms-1">
            <IoIosArrowDown />
          </span>
        </button>

        {showMainDropdown && (
          <div className="main-dropdown">
            <div className="sub-options">
              <button onClick={handleLast7Days}>Last 7 Days</button>
              {/* <button onClick={handleMonthlyClick}>Monthly <IoIosArrowDown className="float-end" /></button> */}
              <button
                onClick={() => {
                  setShowYearly(!showYearly);
                  setShowMonthly(false);
                  setSelectedType("yearly");
                }}
              >
                Yearly <IoIosArrowDown className="float-end" />
              </button>
            </div>

            {showMonthly && (
              <div className="month-dropdown scrollable-months">
                {(monthsByYear[selectedYear] || []).map((monthObj) => (
                  <label key={monthObj.label}>
                    <input
                      type="checkbox"
                      checked={selectedMonths.some(
                        (m) => m.label === monthObj.label,
                      )}
                      onChange={() => toggleMonth(monthObj)}
                    />
                    {monthObj.label}
                  </label>
                ))}
              </div>
            )}

            {showYearly && (
              <div className="year-dropdown">
                {years.map((year) => (
                  <div key={year} onClick={() => handleYearSelect(year)}>
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterDropdown;
