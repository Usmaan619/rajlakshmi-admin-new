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
      const res = await getData(`admin/blogs?page=${pageNo}&limit=${limit}`);

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
      const res = await postFormData("admin/blogs/create", blogData);
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
      await postFormData(`admin/blogs/update/${id}`, blogData);
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
      await deleteData("admin/blogs", id);

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
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>{renderCurrentView()}</div>
      </div>
    </div>
  );
};

// ==================== BlogMain (4 Cards) ====================
const BlogMain = ({ onNavigate }) => {
  return (
    <div>
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="page-title">Blog Manager</h1>
          <p className="page-subtitle">
            Create, manage and publish your blog posts
          </p>
        </div>
        <button
          onClick={() => onNavigate("create")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #e07a5f, #c96745)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "11px 22px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(224, 122, 95, 0.35)",
          }}
        >
          <Plus size={18} /> New Blog
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
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
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase()),
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
        display: "flex",
        flexDirection: "column",
        height: "100%",
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
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {blog.category}
          </div>
        )}
      </div>

      <div
        style={{
          padding: "24px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <span>{blog.author || "Admin"}</span>
          <span>•</span>
          <span>{blog.read_time || "5 min read"}</span>
        </div>

        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "12px",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            height: "50px",
          }}
        >
          {blog.title}
        </h3>

        {blog.description && (
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              marginBottom: "20px",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              flex: 1,
            }}
          >
            {blog.description}
          </p>
        )}

        <div style={{ marginTop: "auto" }}>
          <div
            style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "16px" }}
          >
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>

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
    </div>
  );
};
const BlogForm = ({ onNavigate, onSubmit, blogId, title }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    description: "",
    author: "Rajlakshmi Javiks",
    read_time: "5 min read",
    content: {
      intro: "",
      sections: [{ title: "", text: "", benefits: [""] }],
      keyTakeaways: [""],
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blogId) {
      loadBlogData();
    }
  }, [blogId]);

  const loadBlogData = async () => {
    try {
      const res = await getData(`admin/blogs/${blogId}`);

      if (res?.blog) {
        const blog = res.blog;

        // Ensure structured content exists
        let structuredContent = blog.content;
        if (typeof structuredContent === "string") {
          try {
            structuredContent = JSON.parse(structuredContent);
          } catch (e) {
            structuredContent = {
              intro: blog.content, // Fallback for old simple string content
              sections: [],
              keyTakeaways: [],
            };
          }
        }

        setFormData({
          title: blog.title || "",
          slug: blog.slug || "",
          category: blog.category || "",
          description: blog.description || "",
          author: blog.author || "Rajlakshmi Javiks",
          read_time: blog.read_time || "5 min read",
          content: {
            intro: structuredContent?.intro || "",
            sections: structuredContent?.sections || [
              { title: "", text: "", benefits: [""] },
            ],
            keyTakeaways: structuredContent?.keyTakeaways || [""],
          },
        });

        setImagePreview(blog.image_url || null);
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

  const handleContentChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value,
      },
    }));
  };

  // Section Handlers
  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.content.sections];
    updatedSections[index][field] = value;
    handleContentChange("sections", updatedSections);
  };

  const addSection = () => {
    handleContentChange("sections", [
      ...formData.content.sections,
      { title: "", text: "", benefits: [""] },
    ]);
  };

  const removeSection = (index) => {
    const updatedSections = formData.content.sections.filter(
      (_, i) => i !== index,
    );
    handleContentChange("sections", updatedSections);
  };

  // Benefit Handlers
  const handleBenefitChange = (sIndex, bIndex, value) => {
    const updatedSections = [...formData.content.sections];
    updatedSections[sIndex].benefits[bIndex] = value;
    handleContentChange("sections", updatedSections);
  };

  const addBenefit = (sIndex) => {
    const updatedSections = [...formData.content.sections];
    updatedSections[sIndex].benefits.push("");
    handleContentChange("sections", updatedSections);
  };

  const removeBenefit = (sIndex, bIndex) => {
    const updatedSections = [...formData.content.sections];
    updatedSections[sIndex].benefits = updatedSections[sIndex].benefits.filter(
      (_, i) => i !== bIndex,
    );
    handleContentChange("sections", updatedSections);
  };

  // Takeaway Handlers
  const handleTakeawayChange = (index, value) => {
    const updatedTakeaways = [...formData.content.keyTakeaways];
    updatedTakeaways[index] = value;
    handleContentChange("keyTakeaways", updatedTakeaways);
  };

  const addTakeaway = () => {
    handleContentChange("keyTakeaways", [...formData.content.keyTakeaways, ""]);
  };

  const removeTakeaway = (index) => {
    const updatedTakeaways = formData.content.keyTakeaways.filter(
      (_, i) => i !== index,
    );
    handleContentChange("keyTakeaways", updatedTakeaways);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content.intro) {
      toastError("Title and Intro are required!");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title.trim());
      fd.append("content", JSON.stringify(formData.content)); // SEND AS JSON STRING
      fd.append("slug", formData.slug);
      fd.append("category", formData.category.trim());
      fd.append("description", formData.description.trim());
      fd.append("author", formData.author.trim());
      fd.append("read_time", formData.read_time.trim());

      if (imageFile) {
        fd.append("image", imageFile);
      }

      await onSubmit(blogId, fd);
    } catch (err) {
      console.error("Submit error:", err);
      toastError("Failed to submit blog");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "15px",
    fontWeight: 600,
    marginBottom: "10px",
    color: "#1e293b",
  };

  const cardStyle = {
    background: "#f8fafc",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    marginBottom: "24px",
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
          {/* Basic Info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label style={labelStyle}>Blog Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="Auto-generated from title"
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label style={labelStyle}>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g. Health Benefits"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Read Time</label>
              <input
                type="text"
                name="read_time"
                value={formData.read_time}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Short Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Short summary for listing page..."
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={labelStyle}>Featured Image</label>
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

          {/* Structured Content Sections */}
          <div
            style={{
              marginTop: "40px",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "32px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "24px",
                color: "#1e293b",
              }}
            >
              Blog Content Structure
            </h2>

            {/* Intro */}
            <div style={{ marginBottom: "32px" }}>
              <label style={labelStyle}>Intro Text *</label>
              <textarea
                value={formData.content.intro}
                onChange={(e) => handleContentChange("intro", e.target.value)}
                rows={4}
                placeholder="The opening paragraph of your blog..."
                style={inputStyle}
              />
            </div>

            {/* Sections */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  Content Sections
                </label>
                <button
                  type="button"
                  onClick={addSection}
                  style={{
                    marginLeft: "auto",
                    padding: "8px 16px",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Plus size={16} /> Add Section
                </button>
              </div>

              {formData.content.sections.map((section, sIndex) => (
                <div key={sIndex} style={cardStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "between",
                      marginBottom: "16px",
                    }}
                  >
                    <h4 style={{ margin: 0, color: "#475569" }}>
                      Section {sIndex + 1}
                    </h4>
                    {formData.content.sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(sIndex)}
                        style={{
                          marginLeft: "auto",
                          color: "#ef4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <input
                      type="text"
                      placeholder="Section Title"
                      value={section.title}
                      onChange={(e) =>
                        handleSectionChange(sIndex, "title", e.target.value)
                      }
                      style={{ ...inputStyle, padding: "12px 16px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <textarea
                      placeholder="Section Text"
                      value={section.text}
                      onChange={(e) =>
                        handleSectionChange(sIndex, "text", e.target.value)
                      }
                      rows={3}
                      style={{ ...inputStyle, padding: "12px 16px" }}
                    />
                  </div>

                  {/* Benefits */}
                  <div>
                    <label
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#64748b",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    >
                      Bullet Points / Benefits
                    </label>
                    {section.benefits.map((benefit, bIndex) => (
                      <div
                        key={bIndex}
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) =>
                            handleBenefitChange(sIndex, bIndex, e.target.value)
                          }
                          placeholder="Add benefit..."
                          style={{ ...inputStyle, padding: "10px 14px" }}
                        />
                        <button
                          type="button"
                          onClick={() => removeBenefit(sIndex, bIndex)}
                          style={{
                            color: "#94a3b8",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addBenefit(sIndex)}
                      style={{
                        padding: "6px 12px",
                        background: "#f1f5f9",
                        color: "#475569",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      + Add Point
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Takeaways */}
            <div style={{ marginBottom: "40px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  Key Takeaways
                </label>
                <button
                  type="button"
                  onClick={addTakeaway}
                  style={{
                    marginLeft: "auto",
                    padding: "8px 16px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  + Add Takeaway
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                {formData.content.keyTakeaways.map((takeaway, tIndex) => (
                  <div
                    key={tIndex}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      value={takeaway}
                      onChange={(e) =>
                        handleTakeawayChange(tIndex, e.target.value)
                      }
                      placeholder="Key takeaway point..."
                      style={{ ...inputStyle, padding: "12px 16px" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeTakeaway(tIndex)}
                      style={{
                        color: "#ef4444",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #e07a5f 0%, #c96745 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "18px 40px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
              boxShadow: "0 10px 25px rgba(224, 122, 95, 0.3)",
            }}
          >
            <Save size={22} />
            {loading
              ? "Publishing..."
              : blogId
                ? "Update published blog"
                : "Publish Blog Now"}
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
      const res = await getData(`admin/blogs/single/${slug}`);

      // Ensure content is parsed
      let content = res.blog?.content;
      if (typeof content === "string") {
        try {
          content = JSON.parse(content);
        } catch (e) {
          content = { intro: content, sections: [], keyTakeaways: [] };
        }
      }

      setBlog({ ...res.blog, content });
    } catch (err) {
      console.log(err);
      toastError("Failed to load blog");
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div style={{ overflow: "hidden" }}>
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

      {/* HERO */}
      <div
        style={{
          height: "450px",
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${blog.image_url}) center/cover`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          padding: "0 40px",
          borderRadius: "24px",
          marginBottom: "40px",
        }}
      >
        <div>
          {blog.category && (
            <div
              style={{
                background: "#e07a5f",
                padding: "8px 24px",
                borderRadius: "30px",
                display: "inline-block",
                marginBottom: "24px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {blog.category}
            </div>
          )}

          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              marginBottom: "24px",
              maxWidth: 900,
              lineHeight: 1.1,
            }}
          >
            {blog.title}
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              fontSize: "16px",
              opacity: 0.9,
              fontWeight: 500,
            }}
          >
            <span>{blog.author}</span>
            <span>•</span>
            <span>{blog.read_time}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: "50px" }}>
          <p
            style={{
              fontSize: "22px",
              lineHeight: 1.7,
              color: "#334155",
              fontWeight: 500,
              marginBottom: "40px",
            }}
          >
            {blog.content?.intro}
          </p>

          {/* Dynamic Sections */}
          {blog.content?.sections?.map((section, idx) => (
            <div key={idx} style={{ marginBottom: "48px" }}>
              {section.title && (
                <h2
                  style={{
                    fontSize: "30px",
                    fontWeight: 700,
                    marginBottom: "20px",
                    color: "#1e293b",
                  }}
                >
                  {section.title}
                </h2>
              )}
              {section.text && (
                <p
                  style={{
                    fontSize: "18px",
                    lineHeight: 1.8,
                    color: "#475569",
                    marginBottom: "24px",
                  }}
                >
                  {section.text}
                </p>
              )}

              {section.benefits?.length > 0 && section.benefits[0] !== "" && (
                <ul
                  style={{
                    paddingLeft: "24px",
                    fontSize: "18px",
                    lineHeight: 2,
                    color: "#475569",
                  }}
                >
                  {section.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} style={{ marginBottom: "12px" }}>
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Key Takeaways Card */}
          {blog.content?.keyTakeaways?.length > 0 &&
            blog.content?.keyTakeaways[0] !== "" && (
              <div
                style={{
                  background: "#f8fafc",
                  borderLeft: "6px solid #e07a5f",
                  padding: "40px",
                  borderRadius: "16px",
                  marginTop: "60px",
                }}
              >
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    marginBottom: "20px",
                    color: "#1e293b",
                  }}
                >
                  Key Takeaways
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  {blog.content.keyTakeaways.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "start",
                        gap: "12px",
                        fontSize: "17px",
                        color: "#475569",
                      }}
                    >
                      <span style={{ color: "#e07a5f", fontWeight: "bold" }}>
                        ✓
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            paddingBottom: "60px",
          }}
        >
          <button
            onClick={() => onNavigate("edit", blog.id)}
            style={{
              padding: "14px 32px",
              background: "#e07a5f",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Edit Post
          </button>
          <button
            onClick={() => onNavigate("list")}
            style={{
              padding: "14px 32px",
              background: "#f1f5f9",
              color: "#475569",
              border: "none",
              borderRadius: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Back to List
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
