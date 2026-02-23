import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthRoutes from "./Routes/routes.jsx";
import { UserProvider } from "./Context/UserContext.js";
import { DropdownProvider } from "./Context/DropdownContext.js";

function App() {
  return (
    <>
      <ToastContainer />
      <UserProvider>
        <DropdownProvider>
          <AuthRoutes />
        </DropdownProvider>
      </UserProvider>
    </>
  );
}

export default App;
