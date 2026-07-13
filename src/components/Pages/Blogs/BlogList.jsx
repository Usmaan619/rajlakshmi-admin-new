import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteData, getData } from "../../Common/APIs/api";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  const loadBlogs = async () => {
    try {
      const res = await getData("blogs");
      setBlogs(res.blogs);
    } catch (err) {
      toast.error("Error loading blogs");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await deleteData("blogs", id);
      toast.success("Deleted!");
      loadBlogs();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="container my-4">
      <h2>All Blogs</h2>

      <Link to="/blog/create" className="btn btn-primary mb-3">
        ➕ Create Blog
      </Link>

      <div className="row">
        {blogs.map((b) => (
          <div className="col-md-4 mb-3" key={b.id}>
            <div className="card">
              {b.image_url && <img src={b.image_url} className="card-img-top" />}

              <div className="card-body">
                <h5>{b.title}</h5>

                <Link to={`/blog/view/${b.slug}`} className="btn btn-sm btn-info me-2">
                  View
                </Link>

                <Link to={`/blog/edit/${b.id}`} className="btn btn-sm btn-warning me-2">
                  Edit
                </Link>

                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}>
                  Delete
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
