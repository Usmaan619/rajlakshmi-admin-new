// import React, { useState, useRef, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import "./dropdown.css";
// import { IoIosArrowDown } from "react-icons/io";

// function FilterDropdown() {
//   const [showMainDropdown, setShowMainDropdown] = useState(false);
//   const [showMonthly, setShowMonthly] = useState(false);
//   const [showYearly, setShowYearly] = useState(false);
//   const [selectedMonths, setSelectedMonths] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [selectedType, setSelectedType] = useState("last7days");

//   const dropdownRef = useRef(null);
//   const location = useLocation();
//   const isGauswarnDashboard = location.pathname !== "/rajlaxmi";

//   const monthsByYear = {
//     "2025": [
//       "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025",
//       "May 2025", "Jun 2025", "Jul 2025", "Aug 2025",
//       "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"
//     ],
//     "2024": [
//       "Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024",
//       "May 2024", "Jun 2024", "Jul 2024", "Aug 2024",
//       "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024"
//     ],
//     "2023": [
//       "Jan 2023", "Feb 2023", "Mar 2023", "Apr 2023",
//       "May 2023", "Jun 2023", "Jul 2023", "Aug 2023",
//       "Sep 2023", "Oct 2023", "Nov 2023", "Dec 2023"
//     ],
//     "2022": [
//       "Jan 2022", "Feb 2022", "Mar 2022", "Apr 2022",
//       "May 2022", "Jun 2022", "Jul 2022", "Aug 2022",
//       "Sep 2022", "Oct 2022", "Nov 2022", "Dec 2022"
//     ]
//   };

//   const years = Object.keys(monthsByYear);

//   const toggleMonth = (month) => {
//     setSelectedType("Monthly");
//     if (selectedMonths.includes(month)) {
//       setSelectedMonths(selectedMonths.filter((m) => m !== month));
//     } else {
//       setSelectedMonths([...selectedMonths, month]);
//     }
//   };

//   const handleYearSelect = (year) => {
//     setSelectedYear(year);
//     setSelectedMonths([]);
//     setSelectedType("Yearly");
//     setShowMonthly(true);
//     setShowYearly(false);
//   };

//   const handleMonthlyClick = () => {
//     setSelectedType("Monthly");
//     setShowMonthly(!showMonthly);
//     setShowYearly(false);
//   };

//   const handleLast7Days = () => {
//     setSelectedType("last7days");
//     setSelectedMonths([]);
//     setSelectedYear(null);
//     setShowMonthly(false);
//     setShowYearly(false);
//     setShowMainDropdown(false);
//   };

//   const renderDateDisplay = () => {
//     if (selectedType === "Monthly" && selectedMonths.length > 0) {
//       return selectedMonths.join(", ");
//     } else if (selectedType === "Yearly" && selectedYear) {
//       return selectedYear;
//     } else {
//       return "Apr 3 – Apr 9";
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowMainDropdown(false);
//         setShowMonthly(false);
//         setShowYearly(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="filter-container" ref={dropdownRef}>
//       {/* ✅ Display Date Text */}
//       <div className={`date-display ${isGauswarnDashboard ? "rajlaxmi-date-display" : ""}`}>
//         {renderDateDisplay()}
//       </div>

//       {/* ✅ Dropdown Button */}
//       <div className="dropdown">
//         <button
//           className={`custom-btn d-flex justify-content-between align-items-center ${isGauswarnDashboard ? "rajlaxmi-btn" : ""}`}
//           onClick={() => {
//             setShowMainDropdown(!showMainDropdown);
//             setShowMonthly(false);
//             setShowYearly(false);
//           }}
//         >
//           {selectedType} <span className="ms-1"><IoIosArrowDown /></span>
//         </button>

//         {showMainDropdown && (
//           <div className="main-dropdown">
//             <div className="sub-options">
//               <button
//                 className={isGauswarnDashboard ? "rajlaxmi-dropdown-btn" : ""}
//                 onClick={handleLast7Days}
//               >
//                 Last 7 Days
//               </button>
//               <button
//                 className={isGauswarnDashboard ? "rajlaxmi-dropdown-btn" : ""}
//                 onClick={handleMonthlyClick}
//               >
//                 Monthly <span className="float-end"><IoIosArrowDown /></span>
//               </button>
//               <button
//                 className={`d-flex justify-content-between align-items-center ${isGauswarnDashboard ? "rajlaxmi-dropdown-btn" : ""}`}
//                 onClick={() => {
//                   setShowYearly(!showYearly);
//                   setShowMonthly(false);
//                   setSelectedType("Yearly");
//                 }}
//               >
//                 Yearly <span className="float-end"><IoIosArrowDown /></span>
//               </button>
//             </div>
//              {/* ✅ Month list */}
// {showMonthly && (
//   <div
//     className={`month-dropdown scrollable-months ${
//       isGauswarnDashboard ? "rajlaxmi-month-dropdown" : ""
//     }`}
//   >
//     {(monthsByYear[selectedYear] || monthsByYear["2025"]).map((month) => (
//       <label key={month}>
//         <input
//           type="checkbox"
//           checked={selectedMonths.includes(month)}
//           onChange={() => toggleMonth(month)}
//         />
//         {month}
//       </label>
//     ))}
//   </div>
// )}

            
            

//             {/* ✅ Year list */}
//             {showYearly && (
//               <div className={`${isGauswarnDashboard ? "rajlaxmi-year-dropdown" : "year-dropdown"}`}>
//                 {years.map((year) => (
//                   <div key={year} onClick={() => handleYearSelect(year)}>
//                     {year}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default FilterDropdown;




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

  const monthsByYear = {
    "2025": [...Array(12)].map((_, i) => ({
      label: new Date(2025, i).toLocaleString("default", { month: "short", year: "numeric" }),
      value: i + 1, // month number (1-based)
    })),
    "2026": [...Array(12)].map((_, i) => ({
      label: new Date(2024, i).toLocaleString("default", { month: "short", year: "numeric" }),
      value: i + 1,
    })),
    "2027": [...Array(12)].map((_, i) => ({
      label: new Date(2023, i).toLocaleString("default", { month: "short", year: "numeric" }),
      value: i + 1,
    })),
    "2028": [...Array(12)].map((_, i) => ({
      label: new Date(2022, i).toLocaleString("default", { month: "short", year: "numeric" }),
      value: i + 1,
    })),
    "2029": [...Array(12)].map((_, i) => ({
      label: new Date(2022, i).toLocaleString("default", { month: "short", year: "numeric" }),
      value: i + 1,
    })),
    "2030": [...Array(12)].map((_, i) => ({
      label: new Date(2022, i).toLocaleString("default", { month: "short", year: "numeric" }),
      value: i + 1,
    })),
  };

  const years = Object.keys(monthsByYear);

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

  // const toggleMonth = (monthObj) => {
  //   let updatedMonths = [];
  //   if (selectedMonths.some(m => m.label === monthObj.label)) {
  //     updatedMonths = selectedMonths.filter((m) => m.label !== monthObj.label);
  //   } else {
  //     updatedMonths = [...selectedMonths, monthObj];
  //   }

  //   setSelectedType("Monthly");
  //   setSelectedMonths(updatedMonths);
  //   setDropdownData({
  //     filterType: "Monthly",
  //     month: updatedMonths.map(m => m.value).join(","), // only numeric month values
  //     year: selectedYear,
  //   });
  // };


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
      return selectedMonths.map(m => m.label).join(", ");
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
      <div className={`date-display ${isGauswarnDashboard ? "rajlaxmi-date-display" : ""}`}>
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
          {selectedType === "last7days" ? "Last 7 Days" : selectedType }  <span className="ms-1"><IoIosArrowDown /></span>
        </button>

        {showMainDropdown && (
          <div className="main-dropdown">
            <div className="sub-options">
              <button onClick={handleLast7Days}>Last 7 Days</button>
              {/* <button onClick={handleMonthlyClick}>Monthly <IoIosArrowDown className="float-end" /></button> */}
              <button onClick={() => {
                setShowYearly(!showYearly);
                setShowMonthly(false);
                setSelectedType("yearly");
              }}>
                Yearly <IoIosArrowDown className="float-end" />
              </button>
            </div>

            {showMonthly && (
              <div className="month-dropdown scrollable-months">
                {(monthsByYear[selectedYear] || []).map((monthObj) => (
                  <label key={monthObj.label}>
                    <input
                      type="checkbox"
                      checked={selectedMonths.some(m => m.label === monthObj.label)}
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