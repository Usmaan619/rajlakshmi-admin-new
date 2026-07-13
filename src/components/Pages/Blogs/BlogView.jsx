import React, { useEffect, useState } from "react";
import { getData } from "../../Common/APIs/api";
import {
  Clock,
  ArrowLeft,
  Tag,
  Calendar,
  User,
  Share2,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import LogoImg from "../../Assets/Images/Logo/mainlogo.png";
import UserIcon from "../../Assets/Images/navbar/User-60.svg";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

const readTime = (html = "") => {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const formatDate = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/* ─── Components ───────────────────────────────────────────────────────────── */

const CategoryBadge = ({ category }) => (
  <span
    style={{
      display: "inline-block",
      background: "#f0fff0",
      color: "#01722C",
      fontSize: "12px",
      fontWeight: 700,
      padding: "4px 14px",
      borderRadius: "full",
      border: "1px solid #dcfce7",
      textTransform: "uppercase",
      letterSpacing: "0.025em",
    }}
    className="rounded-full"
  >
    {category}
  </span>
);

const BlogView = ({ slug: propSlug, onNavigate }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    if (propSlug) loadBlog();
  }, [propSlug]);

  const loadBlog = async () => {
    setLoading(true);
    try {
      const res = await getData(`admin/blogs/single/${propSlug}`);
      if (res?.blog) {
        setBlog(res.blog);
        loadRelated(res.blog.category, res.blog.id);
      }
    } catch (err) {
      console.error("Blog load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelated = async (category, currentId) => {
    try {
      const res = await getData(`admin/blogs?limit=6`);
      if (res?.blogs) {
        setRelatedBlogs(res.blogs.filter((b) => b.id !== currentId));
      }
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
        <div className="spinner-border text-success" role="status" />
        <p className="text-muted">Loading article details...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-5">
        <h3 className="text-danger">Blog Not Found</h3>
        <button
          className="btn btn-outline-secondary mt-3"
          onClick={() => onNavigate("list")}
        >
          Back to List
        </button>
      </div>
    );
  }

  const rt = blog.read_time || readTime(blog.content);
  const dt = formatDate(blog.created_at);

  return (
    <div
      className="blog-view-container"
      style={{ background: "#fff", minHeight: "100vh" }}
    >
      {/* Article Header Controls */}
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <button
          onClick={() => onNavigate("list")}
          className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2 text-muted hover-dark"
          style={{ fontWeight: 600, fontSize: "14px" }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <button
          className="btn btn-light rounded-pill d-flex align-items-center gap-2 px-3 border"
          style={{ fontSize: "13px", fontWeight: 600 }}
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          <Share2 size={14} /> Share Article
        </button>
      </div>

      <div className="row g-5">
        {/* Main Content */}
        <div className="col-lg-8">
          <header className="mb-4">
            <h1
              style={{
                fontSize: "40px",
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1.2,
                marginBottom: "20px",
              }}
            >
              {blog.title}
            </h1>

            <div
              className="d-flex flex-wrap align-items-center gap-3 text-muted"
              style={{ fontSize: "14px" }}
            >
              <span className="d-flex align-items-center gap-2">
                <span style={{ fontWeight: 600, color: "#374151" }}>
                  By {blog.author || "Rajlakshmi Javiks"}
                </span>
              </span>
              <span>•</span>
              <time>{dt}</time>
              <span>•</span>
              <span className="d-flex align-items-center gap-1">
                <Clock size={16} /> {rt}
              </span>
            </div>
          </header>

          {/* Banner Image */}
          <div
            className="mb-5 shadow-sm overflow-hidden"
            style={{ borderRadius: "20px" }}
          >
            <img
              src={blog.image_url}
              alt={blog.title}
              style={{ width: "100%", height: "450px", objectFit: "cover" }}
            />
          </div>

          {/* Article Content */}
          <div className="article-body">
            {blog.description && (
              <p
                className="lead fw-medium text-secondary mb-4"
                style={{
                  fontSize: "1.1rem",
                  borderLeft: "4px solid #01722C",
                  paddingLeft: "1.5rem",
                }}
              >
                {blog.description}
              </p>
            )}

            <div
              className="prose-content"
              style={{ fontSize: "17px", lineHeight: 1.8, color: "#374151" }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* CTA SECTION 1 */}
            <div
              className="my-5 p-4 rounded-4"
              style={{ background: "#F0FFF0", border: "1px solid #dcfce7" }}
            >
              <h3
                style={{
                  color: "#01722C",
                  fontWeight: 800,
                  marginBottom: "12px",
                }}
              >
                Experience Pure Organic Food with Rajlakshmi Javiks
              </h3>
              <p className="text-secondary mb-4">
                Discover our wide range of naturally grown and lab-tested
                organic food products, carefully sourced for quality and purity.
              </p>
              <div className="d-flex gap-3">
                <button
                  className="btn px-4 py-2 text-white rounded-3 shadow-sm"
                  style={{ background: "#01722C", fontWeight: 600 }}
                >
                  Shop Organic Products
                </button>
                <button
                  className="btn btn-outline-success px-4 py-2 rounded-3"
                  style={{ fontWeight: 600 }}
                >
                  Explore Categories
                </button>
              </div>
            </div>

            {/* AUTHOR BOX */}
            <div className="mt-5 p-4 border rounded-4 bg-white shadow-sm d-flex gap-4 align-items-center flex-wrap flex-md-nowrap">
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "4px solid #f0fff0",
                  padding: "4px",
                  background: "#fff",
                  flexShrink: 0,
                }}
              >
                <img
                  src={LogoImg}
                  alt="Author"
                  onError={(e) => {
                    e.target.src = UserIcon;
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div>
                <h4
                  style={{
                    color: "#1C7C3A",
                    fontWeight: 800,
                    marginBottom: "8px",
                  }}
                >
                  About the Author
                </h4>
                <p className="m-0 text-muted" style={{ lineHeight: 1.6 }}>
                  Rajlakshmi Javiks is an organic food brand committed to
                  promoting healthy living through clean, natural, and
                  sustainable food choices. Our mission is to connect farmers
                  directly with health-conscious consumers.
                </p>
              </div>
            </div>

            {/* CTA SECTION 2 */}
            <div
              className="mt-5 p-4 rounded-4 text-center text-md-start"
              style={{ background: "#F0FFF0", border: "1px solid #dcfce7" }}
            >
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h3
                    style={{
                      color: "#01722C",
                      fontWeight: 800,
                      marginBottom: "12px",
                    }}
                  >
                    Start Your Organic Journey Today
                  </h3>
                  <p className="text-secondary mb-3 mb-md-0">
                    Make healthier choices for you and your family with
                    Rajlakshmi Javiks’ pure and natural food products.
                  </p>
                </div>
                <div className="col-md-4 text-md-end">
                  <button
                    className="btn px-5 py-2 text-white rounded-3 w-100 w-md-auto"
                    style={{ background: "#01722C", fontWeight: 600 }}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: "100px", zIndex: 1 }}>
            {/* Help Box */}
            <div
              className="p-4 rounded-4 mb-4 text-white shadow-sm"
              style={{ background: "#01722C" }}
            >
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                Need Help? <HelpCircle size={20} />
              </h4>
              <p style={{ opacity: 0.9, fontSize: "14px", lineHeight: 1.6 }}>
                Can't find what you are looking for? We are here to help you.
                Contact us and we'll get back to you as soon as possible.
              </p>
              <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />
              <div className="mt-3 d-flex flex-column gap-2">
                <div className="fw-bold">☎ +91 745 0532 522</div>
                <div className="fw-bold">✉ contact@rajlakshmiijaviks.com</div>
              </div>
            </div>

            {/* Related Sidebar */}
            <div className="p-4 rounded-4 border bg-white shadow-sm">
              <h5
                className="fw-bold mb-4"
                style={{
                  fontSize: "14px",
                  letterSpacing: "1px",
                  color: "#6b7280",
                }}
              >
                RELATED ARTICLES
              </h5>
              <div className="d-flex flex-column gap-4">
                {relatedBlogs.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="d-flex gap-3 align-items-start group cursor-pointer"
                    onClick={() => onNavigate("view", null, item.slug)}
                  >
                    <div
                      className="overflow-hidden rounded-3 shadow-sm"
                      style={{ width: "80px", height: "80px", flexShrink: 0 }}
                    >
                      <img
                        src={item.image_url}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        className="transition-transform"
                      />
                    </div>
                    <div className="min-w-0">
                      <div
                        className="text-success fw-bold truncate-1 mb-1"
                        style={{ fontSize: "11px", textTransform: "uppercase" }}
                      >
                        {item.category || "General"}
                      </div>
                      <h6
                        className="fw-bold text-dark m-0 truncate-2 mb-1"
                        style={{ fontSize: "14px", lineHeight: 1.4 }}
                      >
                        {item.title}
                      </h6>
                      <div className="text-muted" style={{ fontSize: "11px" }}>
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-outline-success w-100 mt-4 py-2 fw-bold rounded-3"
                style={{ fontSize: "14px" }}
                onClick={() => onNavigate("list")}
              >
                View all blogs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="mt-5 pt-5 border-top pb-5">
        <h2 className="mb-4 fw-bold text-dark" style={{ fontSize: "28px" }}>
          More from our Blog
        </h2>
        <div className="row g-4 mt-2">
          {relatedBlogs.slice(0, 5).map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg">
              <div
                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden cursor-pointer blog-card-hover"
                onClick={() => onNavigate("view", null, item.slug)}
              >
                <div
                  className="card-img-top position-relative"
                  style={{ height: "180px" }}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span className="position-absolute top-0 start-0 m-3 badge bg-success px-3 py-2 rounded-pill shadow-sm">
                    {item.category || "Food Tips"}
                  </span>
                </div>
                <div className="card-body p-4">
                  <h5
                    className="card-title fw-bold text-dark mb-2 truncate-2"
                    style={{ fontSize: "18px", height: "54px" }}
                  >
                    {item.title}
                  </h5>
                  <p
                    className="card-text text-muted truncate-2 mb-3"
                    style={{ fontSize: "13px" }}
                  >
                    {item.description ||
                      "Learn more about our mission and organic products..."}
                  </p>
                  <div className="d-flex align-items-center justify-content-between">
                    <span
                      className="text-success fw-bold d-flex align-items-center gap-1"
                      style={{ fontSize: "13px" }}
                    >
                      Read more <ArrowRight size={14} />
                    </span>
                    <span className="text-muted" style={{ fontSize: "11px" }}>
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .truncate-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .blog-card-hover { transition: all 0.3s ease; }
        .blog-card-hover:hover { transform: translateY(-8px); box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important; }
        .prose-content h2 { color: #111827; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
        .prose-content p { margin-bottom: 1.5rem; }
        .prose-content ul { margin-bottom: 1.5rem; padding-left: 1.5rem; }
        .prose-content li { margin-bottom: 0.5rem; }
        .prose-content li::marker { color: #01722C; font-weight: bold; }
        .hover-dark:hover { color: #111827 !important; }
      `}</style>
    </div>
  );
};

export default BlogView;
