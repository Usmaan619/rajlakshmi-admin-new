import React, { createContext, useState } from "react";

export const DropdownContext = createContext();

export const DropdownProvider = ({ children }) => {
  const [dropdownData, setDropdownData] = useState({
    filterType: "last7days",
    month: null,
    year: null,
  });

  return (
    <DropdownContext.Provider value={{ dropdownData, setDropdownData }}>
      {children}
    </DropdownContext.Provider>
  );
};
