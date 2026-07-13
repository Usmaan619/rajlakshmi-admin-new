import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogEditor = ({ title, setTitle, content, setContent, category, setCategory }) => {
  return (
    <>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <ReactQuill
        value={content}
        onChange={setContent}
        theme="snow"
        style={{ height: 300 }}
      />

      <div style={{ marginBottom: 80 }} />
    </>
  );
};

export default BlogEditor;
