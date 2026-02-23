// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../Common/Navbar/navbar";
// import Sidebar from "../../Common/SideBar/sidebar";

// const BlogMain = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="container-fluid px-4 gauswarn-bg-color min-vh-100">
//       <Navbar />

//       <div className="row">
//         <div className="col-lg-2">
//           <Sidebar />
//         </div>

//         <h1 className="mb-4 text-center">📚 Blog Manager</h1>

//         <div className="col-lg-10 px-lg-5 py-4">
//           <div
//             className="d-flex flex-column gap-3"
//             style={{ maxWidth: 400, margin: "0 auto" }}
//           >
//             <button
//               className="btn btn-primary"
//               onClick={() => navigate("/blog/create")}
//             >
//               ➕ Create Blog
//             </button>

//             <button
//               className="btn btn-success"
//               onClick={() => navigate("/blog/list")}
//             >
//               📄 View All Blogs
//             </button>

//             <button
//               className="btn btn-warning"
//               onClick={() => navigate("/blog/list")}
//             >
//               ✏️ Edit Blog
//             </button>

//             <button
//               className="btn btn-danger"
//               onClick={() => navigate("/blog/list")}
//             >
//               ❌ Delete Blog
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogMain;

import React, { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Save,
  Upload,
} from "lucide-react";

// Mock API functions for demo
const mockAPI = {
  blogs: [
    {
      id: 1,
      title: "Getting Started with React",
      category: "Technology",
      content:
        "<p>React is a powerful JavaScript library for building user interfaces...</p>",
      image_url:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      slug: "getting-started-react",
      created_at: "2024-01-15",
    },
    {
      id: 2,
      title: "Web Design Trends 2024",
      category: "Design",
      content: "<p>Explore the latest trends in web design for 2024...</p>",
      image_url:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
      slug: "web-design-trends-2024",
      created_at: "2024-01-10",
    },
    {
      id: 3,
      title: "Understanding JavaScript Closures",
      category: "Programming",
      content: "<p>Closures are a fundamental concept in JavaScript...</p>",
      image_url:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
      slug: "javascript-closures",
      created_at: "2024-01-05",
    },
  ],
};

// BlogMain Component
const BlogMain = ({ onNavigate }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "white",
              marginBottom: 10,
            }}
          >
            📚 Blog Manager
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.9)" }}>
            Manage your blog posts with ease
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 30,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <ActionCard
            icon={<Plus size={32} />}
            title="Create Blog"
            description="Write and publish new blog posts"
            color="#10b981"
            onClick={() => onNavigate("create")}
          />

          <ActionCard
            icon={<FileText size={32} />}
            title="View Blogs"
            description="Browse all published blogs"
            color="#3b82f6"
            onClick={() => onNavigate("list")}
          />

          <ActionCard
            icon={<Edit size={32} />}
            title="Edit Blog"
            description="Update existing blog posts"
            color="#f59e0b"
            onClick={() => onNavigate("list")}
          />

          <ActionCard
            icon={<Trash2 size={32} />}
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
        borderRadius: 16,
        padding: 30,
        cursor: "pointer",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(0,0,0,0.2)"
          : "0 4px 6px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          color: color,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 8,
          color: "#1f2937",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  );
};

export default BlogMain;
