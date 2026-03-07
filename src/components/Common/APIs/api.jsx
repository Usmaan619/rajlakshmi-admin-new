import {
  axiosInstance,
} from "../../../AxiosInstance/axiosInstance";

// Helper to clean endpoint paths
const cleanPath = (path) => {
  if (typeof path !== 'string') return path;
  // Remove leading slash to ensure it appends to baseURL properly
  return path.startsWith('/') ? path.substring(1) : path;
};

// 🔹 GET: Fetch data from a dynamic endpoint
export const getData = async (endpoint, config = {}) => {
  try {
    const response = await axiosInstance.get(cleanPath(endpoint), {
      ...config,
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 🔹 POST: Send data to a dynamic endpoint
export const postData = async (endpoint, data, config = {}) => {
  try {
    const response = await axiosInstance.post(
      cleanPath(endpoint),
      data,
      {
        ...config,
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          ...config.headers,
        },
      },
    );

    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const postFormData = async (endpoint, formData, config = {}) => {
  try {
    const response = await axiosInstance.post(
      cleanPath(endpoint),
      formData,
      {
        ...config,
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "multipart/form-data",
          ...config.headers,
        },
      },
    );

    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 🔹 PUT: Update data on a dynamic endpoint
export const updateData = async (endpoint, id, data, config = {}) => {
  try {
    const response = await axiosInstance.put(
      `${cleanPath(endpoint)}/${id}`,
      data,
      config
    );
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 🔹 DELETE: Remove data from a dynamic endpoint
export const deleteData = async (endpoint, id, config = {}) => {
  try {
    const response = await axiosInstance.delete(
      `${cleanPath(endpoint)}/${id}`,
      config
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteDataReel = async (endpoint, config = {}) => {
  try {
    const response = await axiosInstance.delete(cleanPath(endpoint), config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteDataNew = async (url, config = {}) => {
  try {
    const res = await axiosInstance.delete(cleanPath(url), config);
    return res.data;
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return err.response?.data || { success: false };
  }
};
