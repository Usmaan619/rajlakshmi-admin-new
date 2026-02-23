import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import { getData, postFormData, deleteData } from "../../Common/APIs/api";
import { toastSuccess, toastError } from "../../../Services/toast.service";
import {
  Plus,
  FileText,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Save,
  Upload,
  Search,
} from "lucide-react";

// Main Blog Manager Component
const BlogManager = () => {
  const [banners, setBanners] = useState({
    banner1: null,
    banner2: null,
    banner3: null,
    banner4: null,
  });
  const [uploading, setUploading] = useState(null);
  const [currentView, setCurrentView] = useState("main");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);

  // Blog state

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Blog CRUD APIs
  // ==================== Fetch Blogs with Pagination ====================
  const fetchBlogs = async (pageNo = 1) => {
    setLoading(true);

    try {
      const res = await getData(`blogs?page=${pageNo}&limit=${limit}`);

      console.log("BLOG API RESPONSE:", res);

      if (res?.blogs) {
        setBlogs(res.blogs);
        setPage(res.page || 1);

        // 🔥 सबसे जरूरी fixes यहाँ हैं 🔥
        const totalCount =
          res?.total ||
          res?.count ||
          res?.totalBlogs ||
          res?.blogs?.length ||
          1;

        setTotalPages(Math.ceil(totalCount / limit));
      }
    } catch (err) {
      toastError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (id, blogData) => {
    console.log("FINAL BLOG DATA RECEIVED:", blogData);

    for (let [key, val] of blogData.entries()) {
      console.log("FD ENTRY:", key, val);
    }

    try {
      const res = await postFormData("/blogs/create", blogData);
      toastSuccess("Blog created successfully!");
      fetchBlogs();
      setCurrentView("list");
    } catch (err) {
      toastError("Failed to create blog");
      console.log(err);
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      await postFormData(`/blogs/update/${id}`, blogData);
      toastSuccess("Blog updated successfully!");
      fetchBlogs();
      setCurrentView("list");
    } catch (err) {
      toastError("Failed to update blog");
      console.log(err);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteData("blogs", id);

      toastSuccess("Blog deleted successfully!");
      fetchBlogs(page);
    } catch (err) {
      toastError("Failed to delete blog");
      console.log(err);
    }
  };

  const handleNavigate = (view, id = null, slug = null) => {
    setCurrentView(view);
    setSelectedId(id);
    setSelectedSlug(slug);

    if (view === "list") fetchBlogs(1);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case "main":
        return <BlogMain onNavigate={handleNavigate} />;
      case "list":
        return (
          <BlogList
            onNavigate={handleNavigate}
            blogs={blogs}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onDelete={deleteBlog}
            page={page}
            totalPages={totalPages}
            fetchBlogs={fetchBlogs}
          />
        );
      case "create":
        return (
          <BlogForm
            onNavigate={handleNavigate}
            onSubmit={createBlog}
            title="Create New Blog"
          />
        );
      case "edit":
        return (
          <BlogForm
            onNavigate={handleNavigate}
            onSubmit={updateBlog}
            blogId={selectedId}
            title="Edit Blog"
          />
        );
      case "view":
        return <BlogView onNavigate={handleNavigate} slug={selectedSlug} />;
      default:
        return <BlogMain onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="container-fluid px-4 gauswarn-bg-color min-vh-100">
      <Navbar />
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-10 px-lg-5 py-4">{renderCurrentView()}</div>
      </div>

      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-5px);
        }
        .blog-card-hover:hover {
          transform: translateY(-4px);
        }
        .action-card-hover:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </div>
  );
};

// ==================== BlogMain (4 Cards) ====================
const BlogMain = ({ onNavigate }) => {
  return (
    <div>
      {" "}
      <div>
        <div style={{ textAlign: "start", marginBottom: "50px" }}>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 700,
              //   color: "white",
              marginBottom: "16px",
            }}
          >
            Blog Manager
          </h1>
          <p style={{ fontSize: "18px" }}>Manage your blog posts with ease</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            // maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <ActionCard
            icon={<Plus size={36} />}
            title="Create Blog"
            description="Write and publish new blog posts"
            color="#10b981"
            onClick={() => onNavigate("create")}
          />
          <ActionCard
            icon={<FileText size={36} />}
            title="View Blogs"
            description="Browse all published blogs"
            color="#3b82f6"
            onClick={() => onNavigate("list")}
          />
          <ActionCard
            icon={<Edit size={36} />}
            title="Edit Blog"
            description="Update existing blog posts"
            color="#f59e0b"
            onClick={() => onNavigate("list")}
          />
          <ActionCard
            icon={<Trash2 size={36} />}
            title="Delete Blog"
            description="Remove unwanted blog posts"
            color="#ef4444"
            onClick={() => onNavigate("list")}
          />
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, title, description, color, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "32px",
        cursor: "pointer",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 25px 50px rgba(0,0,0,0.25)"
          : "0 8px 25px rgba(0,0,0,0.15)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: "16px",
          background: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          color,
          fontSize: "24px",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "12px",
          color: "#1f2937",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
};

const BlogList = ({
  onNavigate,
  blogs,
  loading,
  searchTerm,
  setSearchTerm,
  onDelete,
  page,
  totalPages,
  fetchBlogs,
}) => {
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <button
        onClick={() => onNavigate("main")}
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          marginBottom: "24px",
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: 700 }}>
          All Blogs ({blogs.length})
        </h1>

        <p style={{ color: "#64748b" }}>
          {filteredBlogs.length} blogs match your search
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          position: "relative",
          marginBottom: "24px",
          background: "white",
          borderRadius: "12px",
          padding: "4px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Search
          size={20}
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
          }}
        />
        <input
          type="text"
          placeholder="Search blogs by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 20px 14px 48px",
            border: "none",
            outline: "none",
            borderRadius: "8px",
          }}
        />
      </div>

      {/* Blogs Grid */}
      {!loading ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "28px",
            }}
          >
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onDelete={onDelete}
                onNavigate={onNavigate}
              />
            ))}

            {filteredBlogs.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "60px 20px",
                }}
              >
                <h3>No blogs found</h3>
                <p>Try search or create new blog</p>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {blogs.length > 0 && (
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <button
                disabled={page === 1}
                onClick={() => fetchBlogs(page - 1)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: page === 1 ? "#eee" : "white",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                ◀ Previous
              </button>

              <span style={{ fontSize: "18px", fontWeight: 600 }}>
                Page {page || 1} of {totalPages || 1}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => fetchBlogs(page + 1)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: page === totalPages ? "#eee" : "white",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading blogs...
        </div>
      )}
    </div>
  );
};

const BlogCard = ({ blog, onDelete, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0,0,0,0.15)"
          : "0 4px 20px rgba(0,0,0,0.08)",
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        style={{
          height: "200px",
          background: `url(${blog.image_url}) center/cover`,
          position: "relative",
        }}
      >
        {blog.category && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#e07a5f",
            }}
          >
            {blog.category}
          </div>
        )}
      </div>

      <div style={{ padding: "24px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#1e293b",
            marginBottom: "10px",
            lineHeight: 1.4,
          }}
        >
          {blog.title}
        </h3>

        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
          {new Date(blog.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onNavigate("view", null, blog.slug)}
            style={{
              flex: 1,
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 12px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <Eye size={16} />
            View
          </button>

          <button
            onClick={() => onNavigate("edit", blog.id)}
            style={{
              flex: 1,
              background: "#f59e0b",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 12px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <Edit size={16} />
            Edit
          </button>

          <button
            onClick={() => onDelete(blog.id)}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 12px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s",
              width: "44px",
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
const BlogForm = ({ onNavigate, onSubmit, blogId, title }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    content: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 CHANGED: EDIT MODE पर data load होगा
  useEffect(() => {
    if (blogId) {
      loadBlogData();
    }
  }, [blogId]);

  // 🔥 CHANGED: Backend से blog data लाने वाला function
  const loadBlogData = async () => {
    try {
      const res = await getData(`blogs/${blogId}`);

      if (res?.blog) {
        const blog = res.blog;

        setFormData({
          title: blog.title || "",
          slug: blog.slug || "",
          category: blog.category || "",
          content: blog.content || "",
        });

        setImagePreview(blog.image_url || null); // पुरानी image दिखेगी
      }
    } catch (err) {
      console.log("Error loading blog:", err);
      toastError("Failed to load blog data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && { slug: generateSlug(value) }),
    }));
  };

  // Image preview + store
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Submit handler (Both create & update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toastError("Title and content are required!");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title.trim());
      fd.append("content", formData.content.trim());
      fd.append("slug", formData.slug);
      fd.append("category", formData.category.trim());

      if (imageFile) {
        fd.append("image", imageFile); // New image
      }

      // Debug Log
      console.log("FormData being sent:");
      for (let [key, value] of fd.entries()) {
        console.log(key, value);
      }

      await onSubmit(blogId, fd);
    } catch (err) {
      console.error("Submit error:", err);
      toastError("Failed to submit blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "0 auto" }}>
      <button
        onClick={() => onNavigate("main")}
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          marginBottom: "32px",
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "48px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "32px",
          }}
        >
          {title}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              Blog Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter your blog title..."
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>

          {/* Slug */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              Slug
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="Auto-generated from title"
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g. Technology, Programming"
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>

          {/* Image */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              Featured Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "2px dashed #cbd5e1",
                background: "#f8fafc",
              }}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  marginTop: "16px",
                  width: "100%",
                  maxHeight: "300px",
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />
            )}
          </div>

          {/* Content */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              Content *
            </label>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              placeholder="Write blog content..."
              style={{
                width: "100%",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                lineHeight: 1.6,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #e07a5f 0%, #e07a5f 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "18px 40px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            <Save size={20} />
            {loading
              ? "Processing..."
              : blogId
              ? "Update Blog"
              : "Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

const BlogView = ({ onNavigate, slug }) => {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await getData(`/blogs/single/${slug}`);
      setBlog(res.blog);
    } catch (err) {
      console.log(err);
      toastError("Failed to load blog");
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div style={{ overflow: "hidden" }}>
      {/* BACK BUTTON */}
      <button
        onClick={() => onNavigate("list")}
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          marginBottom: "24px",
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={20} /> Back to Blogs
      </button>

      {/* HERO SECTION */}
      <div
        style={{
          height: "400px",
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${blog.image_url}) center/cover`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        <div>
          {blog.category && (
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "8px 20px",
                borderRadius: "30px",
                display: "inline-block",
                marginBottom: "24px",
                fontSize: "14px",
                backdropFilter: "blur(10px)",
              }}
            >
              {blog.category}
            </div>
          )}

          <h1
            style={{
              fontSize: "48px",
              fontWeight: 700,
              marginBottom: "20px",
              maxWidth: 900,
            }}
          >
            {blog.title}
          </h1>

          <p style={{ fontSize: "18px", opacity: 0.95 }}>
            Published on{" "}
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div
        style={{
          // maxWidth: 900,
          margin: "-80px auto 0",
          padding: "0 40px 60px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "80px 60px 60px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
            marginBottom: "40px",
          }}
        >
          <div
            style={{ fontSize: "18px", lineHeight: 1.8, color: "#374151" }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button
            onClick={() => onNavigate("edit", blog.id)}
            style={{
              background: "#f59e0b",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "14px 28px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            <Edit size={18} />
            Edit Blog
          </button>

          <button
            onClick={() => onNavigate("list")}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px 28px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 500,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <ArrowLeft size={18} />
            Back to Blogs
          </button>
        </div>
      </div>
    </div>
  );
};

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default BlogManager;
