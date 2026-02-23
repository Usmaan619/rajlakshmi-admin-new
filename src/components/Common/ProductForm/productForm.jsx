import React, { useState } from "react";
import "./product.css";
import { NavLink, useLocation } from "react-router-dom";

const ProductForm = () => {
  const [images, setImages] = useState([]);
  const location = useLocation();
  const isRajlaxmi = location.pathname.startsWith('/rajlaxmi');

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const categories = isRajlaxmi
    ? ["Ghee", "Flours", "Oils", "Rice & Wheat", "Pulses", "Seeds", "Spices", "Dry Fruits"]
    : ["Ghee"];

  return (
    <div className="container-fluid px-0 min-vh-100">
      <div className="row g-0">
        <div className="col-12 px-2 px-sm-3 py-3">
          <NavLink to={isRajlaxmi ? "/rajlaxmi/product" : "/product"}>
            <button className="btn btn-link text-dark mb-3 px-0">← Back</button>
          </NavLink>

          <div className="card w-100 shadow-sm rounded-3 no-mobile-margin">
            <div className="card-header bg-light-green text-dark-green fs-5">
              Product Information
            </div>

            <form className="card-body row g-4">
              {/* LEFT COLUMN */}
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">Product Name</label>
                  <input type="text" id="productName" className="form-control" />
                </div>

                <div className="mb-3">
                  <label htmlFor="productDesc" className="form-label">Product Description</label>
                  <input type="text" id="productDesc" className="form-control" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Image</label>
                  {images.length === 0 ? (
                    <div className="upload-box text-center">
                      <label className="btn btn-upload mb-2">
                        Add Files
                        <input type="file" multiple hidden onChange={handleImageUpload} />
                      </label>
                      <div className="text-muted small">Or drag and drop files</div>
                    </div>
                  ) : (
                    <div className="upload-split d-flex gap-3 flex-wrap">
                      <div className="upload-left text-center">
                        <label className="btn btn-upload mb-2">
                          Add Files
                          <input type="file" multiple hidden onChange={handleImageUpload} />
                        </label>
                        <div className="text-muted small">Or drag and drop files</div>
                      </div>
                      <div className="upload-right d-flex flex-wrap gap-2">
                        {images.map((src, i) => (
                          <div key={i} className="image-box">
                            <img src={src} alt={`preview-${i}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN - CATEGORIES */}
              <div className="col-md-4">
                <label className="form-label">Product Categories</label>
                <div className="category-box">
                  {categories.map((item, idx) => (
                    <div className="form-check" key={idx}>
                      <input className="form-check-input" type="checkbox" id={`cat-${idx}`} />
                      <label className="form-check-label" htmlFor={`cat-${idx}`}>{item}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* INPUT FIELDS */}
              <div className="col-md-4">
                <label htmlFor="benefits" className="form-label">Product Benefits</label>
                <input type="text" id="benefits" className="form-control" />
              </div>

              <div className="col-md-4">
                <label htmlFor="price" className="form-label">Product Price</label>
                <input type="text" id="price" className="form-control" />
              </div>

              <div className="col-md-4">
                <label htmlFor="discountPrice" className="form-label">Discount Price</label>
                <input type="text" id="discountPrice" className="form-control" />
              </div>

              <div className="col-md-4">
                <label htmlFor="tax" className="form-label">Tax</label>
                <input type="text" id="tax" className="form-control" />
              </div>

              <div className="col-md-4">
                <label htmlFor="weight" className="form-label">Product Weight</label>
                <input type="text" id="weight" className="form-control" />
              </div>

              <div className="col-md-4">
                <label htmlFor="dimensions" className="form-label">Dimensions</label>
                <input type="text" id="dimensions" className="form-control" />
              </div>

              <div className="col-md-4">
                <label htmlFor="shipping" className="form-label">Free Shipping?</label>
                <input type="text" id="shipping" className="form-control" />
              </div>

              {/* BUTTONS */}
              <div className="d-flex justify-content-end gap-2 mt-3 flex-wrap w-100">
                <button type="button" className="btn btn-outline-save">Cancel</button>
                <button type="submit" className="btn btn-save">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
