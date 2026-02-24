import axios from "axios";

const BASE_URL = "http://localhost:5001/blogs";

/**
 * Add a new blog from JSON input
 * @param {Object} blogData - The parsed JSON blog object
 * @returns {Promise}
 */
export const addBlog = async (blogData) => {
  try {
    const response = await axios.post(`${BASE_URL}/add_blog`, blogData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Fetch all blogs from the backend
 * @returns {Promise<Array>}
 */
export const getAllBlogs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get_all_blogs`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a blog post by ID
 * @param {string|number} id - The ID of the blog to delete
 * @returns {Promise}
 */
export const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
