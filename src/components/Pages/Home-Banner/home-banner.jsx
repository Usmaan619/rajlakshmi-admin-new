import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import { getData, postFormData } from "../../Common/APIs/api";
import { toastSuccess, toastError } from "../../../Services/toast.service";
import "./BannerManager.css";

const BannerManager = () => {
  const [banners, setBanners] = useState({
    banner1: null,
    banner2: null,
    banner3: null,
    banner4: null,
  });
  const [uploading, setUploading] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getData("admin/home-banners");
      if (res) {
        setBanners({
          banner1: res.banner1 || null,
          banner2: res.banner2 || null,
          banner3: res.banner3 || null,
          banner4: res.banner4 || null,
        });
      }
    } catch (err) {
      console.error("Failed to fetch banners:", err);
      toastError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  }, []);

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toastError("Please select JPG, PNG, or WebP images only");
      return false;
    }

    if (file.size > maxSize) {
      toastError("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const updateBanner = async (slot, file) => {
    if (!file || !validateFile(file)) return;

    setUploading(slot);

    try {
      const formData = new FormData();
      formData.append("slots", slot);
      formData.append("banner", file);

      const res = await postFormData("admin/home-banners-images", formData);

      if (res?.data?.updated || res?.data?.newUrl) {
        toastSuccess(`Banner ${slot} updated successfully!`);
        await fetchBanners();
      } else {
        toastError("Failed to update banner");
      }
    } catch (err) {
      console.log("err", err);
      console.error(`Banner ${slot} update failed:`, err);
      const errorMsg = err?.message || "Upload failed. Please try again.";
      toastError(errorMsg);
    } finally {
      setUploading(null);
    }
  };

  const getUploadStatus = (slot) => {
    if (loading) return "loading";
    if (uploading === slot) return "uploading";
    return "idle";
  };

  if (loading) {
    return (
      <div className="container-fluid px-4 gauswarn-bg-color min-vh-100">
        <Navbar />
        <div className="row">
          <div className="col-lg-2">
            <Sidebar />
          </div>
          <div className="col-lg-10 px-lg-5 py-4">
            <div className="banner-loading">
              <div className="banner-spinner"></div>
              <p className="banner-loading-text">Loading banners...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 gauswarn-bg-color min-vh-100">
      <Navbar />
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>

        <div className="col-lg-10 px-lg-5 py-4">
          {/* Page Header */}
          <div className="banner-header">
            <h1 className="banner-title">Homepage Banners</h1>
            <p className="banner-subtitle">
              Manage your website's promotional banners (4 slots)
            </p>
          </div>

          {/* Banner Grid */}
          <div className="banner-grid">
            {[1, 2, 3, 4].map((slot) => {
              const status = getUploadStatus(slot);
              const hasBanner = !!banners[`banner${slot}`];

              return (
                <div key={slot} className="banner-card">
                  <div className="banner-card-header">
                    <h3 className="banner-card-title">Banner {slot}</h3>
                    {hasBanner && (
                      <span className="banner-card-badge">Active</span>
                    )}
                  </div>

                  <div className="banner-card-body">
                    {hasBanner ? (
                      <div className="banner-image-wrapper">
                        <img
                          src={banners[`banner${slot}`]}
                          className="banner-image"
                        />
                        <div className="banner-image-overlay"></div>
                      </div>
                    ) : (
                      <div className="banner-placeholder">
                        <p>No banner set</p>
                      </div>
                    )}

                    <div className="banner-upload">
                      <input
                        type="file"
                        id={`banner-${slot}`}
                        className="banner-file-input"
                        onChange={(e) => updateBanner(slot, e.target.files[0])}
                      />

                      <label
                        htmlFor={`banner-${slot}`}
                        className="banner-upload-btn"
                      >
                        {status === "uploading"
                          ? "Uploading..."
                          : hasBanner
                            ? "Replace Banner"
                            : "Upload Banner"}
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guidelines */}
          <div className="banner-guidelines-card">
            <h3 className="banner-guidelines-title">Banner Specifications</h3>

            <div className="banner-guidelines-grid">
              <div>1441×580px</div>
              <div>JPG, PNG, WebP</div>
              <div>Landscape ratio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerManager;
