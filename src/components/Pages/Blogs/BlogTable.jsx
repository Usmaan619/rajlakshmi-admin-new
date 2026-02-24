import React, { useState, useEffect } from "react";
import {
  Trash2,
  Eye,
  Calendar,
  User,
  Clock,
  Loader2,
  Search,
  BookOpen,
} from "lucide-react";
import moment from "moment";
import { toast } from "react-toastify";
import { getAllBlogs, deleteBlog } from "./blogApi";

const BlogTable = ({ refreshTrigger }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogs();
      setBlogs(data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm("Do you really want to delete this blog?")) return;

    try {
      await deleteBlog(id);
      toast.success("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Could not delete blog.");
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="animate-spin text-orange-600 mb-4" size={48} />
        <p className="text-gray-500 font-semibold animate-pulse">
          Fetching latest blogs...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Search Header */}
      <div className="p-4 bg-gray-50/50 border-b border-gray-100">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by title, category or author..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-50 focus:border-orange-200 outline-none text-sm transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-600">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                Blog Details
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                Category
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                Author
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                Read Time
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b border-gray-100 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="hover:bg-gray-50/80 transition-all"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg text-orange-600 mt-1">
                        <BookOpen size={16} />
                      </div>
                      <div className="max-w-xs md:max-w-md">
                        <div className="font-bold text-gray-900 line-clamp-1">
                          {blog.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          ID: {blog.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                      {blog.category || "Organic"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User size={14} className="text-orange-400" />
                      {blog.author || "Rajlakshmi"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={14} className="text-gray-400" />
                      {blog.readTime || blog.read_time || "5m"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} className="text-gray-400" />
                      {moment(blog.createdAt || blog.created_at).format(
                        "DD MMM YYYY",
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Post"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <BookOpen size={40} className="text-gray-200 mb-2" />
                    <p className="text-gray-400 font-medium">
                      No blog records found.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogTable;
