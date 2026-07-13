import React, { useEffect, useState } from "react";
import BlogEditor from "./BlogEditor";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getData, postFormData } from "../../Common/APIs/api";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [image, setImage] = useState(null);

  const loadBlog = async () => {
    const res = await getData("blogs");
    const found = res.blogs.find((x) => x.id == id);
    setBlog(found);
  };

  useEffect(() => {
    loadBlog();
  }, []);

  if (!blog) return <h2>Loading...</h2>;

  const updateBlog = async () => {
    const fd = new FormData();
    fd.append("title", blog.title);
    fd.append("category", blog.category);
    fd.append("content", blog.content);
    if (image) fd.append("image", image);

    try {
      await postFormData(`/blogs/${id}`, fd);
      toast.success("Updated!");
      navigate("/blog/list");
    } catch (err) {
      toast.error("Error updating");
    }
  };

  return (
    <div className="container my-4">
      <h2>Edit Blog</h2>

      <BlogEditor
        title={blog.title}
        setTitle={(v) => setBlog({ ...blog, title: v })}
        category={blog.category}
        setCategory={(v) => setBlog({ ...blog, category: v })}
        content={blog.content}
        setContent={(v) => setBlog({ ...blog, content: v })}
      />

      <img src={blog.image_url} className="img-fluid mb-3" />

      <input
        type="file"
        className="form-control mb-3"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button className="btn btn-primary" onClick={updateBlog}>
        Update Blog
      </button>
    </div>
  );
};

export default BlogEdit;
