import axios from "axios";
import {
  axiosInstance,
  axiosInterceptor,
} from "../../../AxiosInstance/axiosInstance";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// 🔹 GET: Fetch data from a dynamic endpoint
export const getData = async (endpoint) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        "ngrok-skip-browser-warning": "true", // Required for ngrok
        "Content-Type": "application/json", // Adjust as needed
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 🔹 POST: Send data to a dynamic endpoint
export const postData = async (endpoint, data) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/${endpoint}`,
      data,
      {
        headers: {
          "ngrok-skip-browser-warning": "true", // Required for ngrok
          "Content-Type": "application/json", // Adjust as needed
          //  "Access-Control-Allow-Origin": "*",
        },
      },
    );

    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const postFormData = async (endpoint, formData) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/${endpoint}`,
      formData,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 🔹 PUT: Update data on a dynamic endpoint
export const updateData = async (endpoint, id, data) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/${endpoint}/${id}`,
      data,
    );
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 🔹 DELETE: Remove data from a dynamic endpoint
export const deleteData = async (endpoint, id) => {
  try {
    const response = await axiosInstance.delete(
      `${API_BASE_URL}/${endpoint}/${id}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteDataReel = async (endpoint) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteDataNew = async (url) => {
  try {
    const res = await axiosInstance.delete(`${API_BASE_URL}${url}`);
    return res.data;
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return err.response?.data || { success: false };
  }
};
