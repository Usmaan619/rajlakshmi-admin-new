import { Route, Routes } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../Context/UserContext";
import { getItem } from "../Services/storage.service.js";

// Public Pages
import Login from "../components/Common/Auth/Login/login";
import Forgot from "../components/Common/Auth/Forgot/forgot";

// Gauswarn Pages
import Home from "../components/Pages/Home/home";
import Order from "../components/Pages/Order/order";
import Product from "../components/Pages/Products/product";
import ProductInfo from "../components/Pages/Products/productInfo";
import Customer from "../components/Pages/Customer/customer";
import CustomerInfo from "../components/Pages/Customer/customerInfo";
import Feedback from "../components/Pages/Feedback/feedback";
import Contact from "../components/Pages/Contact/contact";

// Rajlaxmi Pages
import RajlaxmiDashboard from "../components/Pages/RajlaxmiHome/rajlaxmihome";
import RajlaxmiOrder from "../components/Pages/RajlaxmiHome/rajlaxmiOrder";
import RajlaxmiProducts from "../components/Pages/RajlaxmiHome/rajlaxmiProducts";
import RajlaxmiProductInfo from "../components/Pages/RajlaxmiHome/rajlaxmiProductinfo.jsx";
import RajlaxmiCustomer from "../components/Pages/RajlaxmiHome/rajlaxmiCustomer";
import RajlaxmiFeedback from "../components/Pages/RajlaxmiHome/rajlaxmiFeedback";
import RajlaxmiContact from "../components/Pages/RajlaxmiHome/rajlaxmiContact";
import { axiosInterceptor } from "../AxiosInstance/axiosInstance.jsx";
import Error from "../components/Pages/Error404/error.jsx";
import HomeBannerMainPage from "../components/Pages/Home-Banner/home-banner-main-page.jsx";
import BannerManager from "../components/Pages/Home-Banner/home-banner.jsx";
import ReelUploader from "../components/Pages/Reels/reelsUpload.jsx";
import BlogMain from "../components/Pages/Blogs/BlogMain.jsx";
import BlogCreate from "../components/Pages/Blogs/BlogCreate.jsx";
import BlogList from "../components/Pages/Blogs/BlogList.jsx";
import BlogView from "../components/Pages/Blogs/BlogView.jsx";
import BlogEdit from "../components/Pages/Blogs/BlogEdit.jsx";
import BlogsTest from "../components/Pages/Blogs/blogtest.jsx";
import Inquiry from "../components/Pages/Inquiry/Inquiry.jsx";
import NewsletterPage from "../components/Pages/Newsletter/Newsletter.jsx";

import CreateAdminUserPage from "../components/Pages/CreateAdminUser/CreateAdminUserPage.jsx";
import OfferManagement from "../components/OfferManagement/OfferManagement.jsx";

const AuthRoutes = () => {
  const { UserLogin, setUserLogin } = useContext(UserContext);

  axiosInterceptor(setUserLogin);

  useEffect(() => {
    const token = getItem("token");
    setUserLogin(token ?? null);
  }, [setUserLogin]);

  return (
    <Routes>
      {!UserLogin ? (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
        </>
      ) : (
        <>
          {/* Gauswarn Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/product" element={<Product />} />
          <Route path="/home-page-banner-change" element={<BannerManager />} />

          <Route path="/reels-upload" element={<ReelUploader />} />

          <Route path="/productinfo" element={<ProductInfo />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/customerinfo" element={<CustomerInfo />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/blog" element={<BlogsTest />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/newlatter" element={<NewsletterPage />} />
          <Route path="/offerBanner" element={<OfferManagement />} />
          <Route path="/create-admin-user" element={<CreateAdminUserPage />} />

          <Route path="/blog/create" element={<BlogCreate />} />
          <Route path="/blog/list" element={<BlogList />} />
          <Route path="/blog/view/:slug" element={<BlogView />} />
          <Route path="/blog/edit/:id" element={<BlogEdit />} />

          {/* Rajlaxmi Routes */}
          <Route path="/rajlaxmi" element={<RajlaxmiDashboard />} />
          <Route path="/rajlaxmi/order" element={<RajlaxmiOrder />} />
          <Route path="/rajlaxmi/product" element={<RajlaxmiProducts />} />
          <Route
            path="/rajlaxmi/productinfo"
            element={<RajlaxmiProductInfo />}
          />
          <Route path="/rajlaxmi/customer" element={<RajlaxmiCustomer />} />
          <Route path="/rajlaxmi/feedback" element={<RajlaxmiFeedback />} />
          <Route path="/rajlaxmi/contact" element={<RajlaxmiContact />} />
          <Route path="*" element={<Error />} />
        </>
      )}

      {/* Fallback route */}

      <Route path="/" element={UserLogin ? <Home /> : <Login />} />
    </Routes>
  );
};

export default AuthRoutes;
