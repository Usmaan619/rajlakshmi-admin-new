import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getData } from "../../Common/APIs/api";

const BlogView = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  const loadBlog = async () => {
    const res = await getData(`blogs/${slug}`);
    setBlog(res.blog);
  };

  useEffect(() => {
    loadBlog();
  }, []);

  if (!blog) return <h2>Loading...</h2>;

  return (
    <div className="container my-4">
      <h1>{blog.title}</h1>
      <p className="text-muted">{blog.category}</p>

      {blog.image_url && (
        <img src={blog.image_url} className="img-fluid mb-3" />
      )}

      <div dangerouslySetInnerHTML={{ __html: blog.content }} />

      <Link to="/blog/list" className="btn btn-secondary mt-4">
        Back
      </Link>
    </div>
  );
};

export default BlogView;
