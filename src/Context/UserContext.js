import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [UserLogin, setUserLogin] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //  Initialize from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const permissions = localStorage.getItem("permissions");

    if (token) {
      setUserLogin(token);
    }

    if (permissions) {
      try {
        setUserPermissions(JSON.parse(permissions));
      } catch (error) {
        console.error("Error parsing permissions:", error);
        setUserPermissions([]);
      }
    }

    setIsLoading(false);
  }, []);

  //  Save permissions to localStorage whenever they change
  const setUserPermissionsWrapper = (permissions) => {
    setUserPermissions(permissions);
    localStorage.setItem("permissions", JSON.stringify(permissions));
  };

  //  Save login to localStorage whenever it changes
  const setUserLoginWrapper = (token) => {
    setUserLogin(token);
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  };

  return (
    <UserContext.Provider
      value={{
        UserLogin,
        setUserLogin: setUserLoginWrapper,
        userPermissions,
        setUserPermissions: setUserPermissionsWrapper,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
