// import React, { useContext } from "react";
// import { useForm } from "react-hook-form";

// import logo from "../../../Assets/Images/Logo/rajlaxmi.svg";
// import { NavLink, useNavigate } from "react-router-dom";
// import { postData } from "../../APIs/api";
// import { Bounce, toast } from "react-toastify";
// import { toastError, toastSuccess } from "../../../../Services/toast.service";
// import { setItem } from "../../../../Services/storage.service";
// import { UserContext } from "../../../../Context/UserContext";
// const Login = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const navigate = useNavigate();
//   const endpoint = "/login";
//   // const { setUserLogin } = useContext(UserContext);
//   const { setUserLogin, setUserPermissions } = useContext(UserContext);

//   const onSubmit = async (data) => {
//     try {
//       const response = await postData(endpoint, data);

//       console.log("response?.data?: ", response?.data);
//       if (response?.data?.success && response?.data?.accessToken) {
//         setItem("token", response?.data?.accessToken);
//         setItem("email", response?.data?.email);
//         setItem("name", response?.data?.name);

//         setUserLogin(response?.data?.accessToken);
//         setUserPermissions(response?.data?.permissions || []);

//         toastSuccess(response?.data?.message);
//         setTimeout(() => navigate("/home"), 1000);
//       } else {
//         toastError(response?.data?.message || "Login failed");
//       }
//     } catch (error) {
//       toastError(error?.message || "Something went wrong");
//     }
//   };
//   return (
//     <>
//       <div className="login-container d-flex align-items-center justify-content-center">
//         <div className="login-box text-center p-4">
//           <div className="mb-4">
//             <img src={logo} alt="Logo" className="logo mb-3" />
//             <h2 className="title font-20 inter-font-family-600 text-white">
//               Admin Login
//             </h2>
//             <p className="subtitle font-14 inter-font-family-300 text-white">
//               Access your dashboard by logging into your admin account.
//             </p>
//           </div>

//           <form
//             className="login-form d-flex flex-column text-start"
//             onSubmit={handleSubmit(onSubmit)}
//           >
//             <div className="login-input mb-3">
//               <label className="font-14 mb-1 form-label text-white inter-font-family-400">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 className="form-control text-white py-2 border-0"
//                 {...register("email", {
//                   required: "Email is required",
//                 })}
//               />
//               {errors.email && (
//                 <div className="text-danger">{errors.email.message}</div>
//               )}
//             </div>

//             <div className="login-input mb-3">
//               <label className="font-14 mb-1 form-label text-white  inter-font-family-400">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 className="form-control text-white py-2 border-0"
//                 //   {...register("password", {
//                 //     required: "Passowrd is required",
//                 //   })}
//                 // />
//                 // {errors.password && (
//                 //   <div className="text-danger">{errors.password.message}</div>
//                 // )}

//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: {
//                     value: 6,
//                     message: "Password must be at least 6 characters",
//                   },
//                   pattern: {
//                     // one uppercase, one special char, min 6 chars total
//                     value:
//                       /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{6,}$/,
//                     message:
//                       "Must include 1 capital letter and 1 special character",
//                   },
//                 })}
//               />
//               {errors.password && (
//                 <div className="text-danger">{errors.password.message}</div>
//               )}
//             </div>

//             <div className="options d-flex align-items-center justify-content-between">
//               <div className="d-flex align-items-center">
//                 <input
//                   type="checkbox"
//                   className="login-checkbox custom-checkbox"
//                   id="remember"
//                 />
//                 <p className="remember-text text-red-color ms-2 font-16 fw-bold  mb-0">
//                   Remember me
//                 </p>
//               </div>
//               <NavLink to={"/forgot"} className={"text-decoration-none"}>
//                 <p className="forgot-link text-red-color font-16 fw-bold mt-1 text-decoration-none mb-0">
//                   Forgot Password?
//                 </p>
//               </NavLink>
//             </div>

//             <button
//               type="submit"
//               className="login-btn rounded-pill border-0 font-16 inter-font-family-500 py-2 mt-5 text-white bg-red-color"
//             >
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;

import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import logo from "../../../Assets/Images/Logo/rajlaxmi.svg";
import { useNavigate } from "react-router-dom";
import { postData } from "../../APIs/api";
import { toastError, toastSuccess } from "../../../../Services/toast.service";
import { setItem } from "../../../../Services/storage.service";
import { UserContext } from "../../../../Context/UserContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const endpoint = "admin/login";
  const { setUserLogin, setUserPermissions } = useContext(UserContext);

  const onSubmit = async (data) => {
    try {
      const response = await postData(endpoint, data);

      console.log("response?.data?: ", response?.data);
      if (response?.data?.success && response?.data?.accessToken) {
        // 🔥 Token aur email directly setItem se save ho jayega (localStorage mein)
        setItem("token", response?.data?.accessToken);
        setItem("email", response?.data?.email);
        setItem("name", response?.data?.name);

        // 🔥 Context mein bhi set karo (jo internally localStorage mein save karega)
        setUserLogin(response?.data?.accessToken);
        setUserPermissions(response?.data?.permissions || []);

        toastSuccess(response?.data?.message);
        setTimeout(() => navigate("/home"), 1000);
      } else {
        toastError(response?.data?.message || "Login failed");
      }
    } catch (error) {
      toastError(error?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="login-container d-flex align-items-center justify-content-center">
        <div className="login-box text-center p-4">
          <div className="mb-4">
            <img src={logo} alt="Logo" className="logo mb-3" />
            <h2 className="title font-20 inter-font-family-600 text-white">
              Admin Login
            </h2>
            <p className="subtitle font-14 inter-font-family-300 text-white">
              Access your dashboard by logging into your admin account.
            </p>
          </div>

          <form
            className="login-form d-flex flex-column text-start"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="login-input mb-3">
              <label className="font-14 mb-1 form-label text-white inter-font-family-400">
                Email Address
              </label>
              <input
                type="email"
                className="form-control text-white py-2 border-0"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <div className="text-danger">{errors.email.message}</div>
              )}
            </div>

            <div className="login-input mb-3">
              <label className="font-14 mb-1 form-label text-white inter-font-family-400">
                Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control text-white py-2 border-0 pe-5"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{6,}$/,
                      message:
                        "Must include 1 capital letter and 1 special character",
                    },
                  })}
                />
                <button
                  type="button"
                  className="btn-eye position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer", padding: "8px 12px" }}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="text-danger">{errors.password.message}</div>
              )}
            </div>

            <button
              type="submit"
              className="login-btn rounded-pill border-0 font-16 inter-font-family-500 py-2 mt-5 text-white bg-red-color"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
