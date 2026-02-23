// import axios from "axios";
// import { getItem } from "../Services/storage.service";

// const API_BASE_URL = process.env.REACT_APP_API_URL;

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//     "Content-Type": "application/json",
//   },
// });

// // Add token to every request if available
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getItem("token");
//     if (token) {
//       config.headers["Authorization"] = token;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Optional: Global error handling
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized. Consider redirecting to login.");
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from "axios";
import { clearCache, getItem } from "../Services/storage.service";
 
const API_BASE_URL = process.env.REACT_APP_API_URL;


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});
 
const axiosInterceptor = contexts => {
 
 
  // Add token to every request if available
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getItem("token");
      if (token) {
        config.headers["Authorization"] = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
 
  // Optional: Global error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
       
      }
      return Promise.reject(error);
    }
  );
 
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
       
        clearCache();
        contexts(null)
        // window.location.href = '/';
       
      }
      return Promise.reject(error);
    }
  );


}
export  { axiosInstance, axiosInterceptor };
