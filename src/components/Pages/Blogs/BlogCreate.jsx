import React, { useState } from "react";
import BlogEditor from "./BlogEditor";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { postFormData } from "../../Common/APIs/api";

const BlogCreate = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleCreate = async () => {
    if (!title || !content) return toast.error("Title & content required!");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("category", category);
    fd.append("content", content);
    if (image) fd.append("image", image);

    try {
      const res = await postFormData("/blogs", fd);
      toast.success("Blog Created!");

      navigate("/blog/list");
    } catch (err) {
      toast.error("Error creating blog");
    }
  };

  return (
    <div className="container my-4">
      <h2>Create Blog</h2>

      <BlogEditor
        title={title}
        setTitle={setTitle}
        category={category}
        setCategory={setCategory}
        content={content}
        setContent={setContent}
      />

      <input
        type="file"
        className="form-control mb-3"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button className="btn btn-primary" onClick={handleCreate}>
        Publish Blog
      </button>
    </div>
  );
};

export default BlogCreate;
