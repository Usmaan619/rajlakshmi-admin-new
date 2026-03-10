import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import {
  getData,
  postData,
  deleteDataNew,
} from "../../Common/APIs/api";
import { toastSuccess, toastError } from "../../../Services/toast.service";

// Extract ID from YouTube link
const extractYoutubeId = (value) => {
  if (!value) return "";
  // Check for shorts URL
  const shortsMatch = value.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]+)/);
  if (shortsMatch) return shortsMatch[1];
  
  // Check for youtu.be URL
  const youtuBeMatch = value.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  if (youtuBeMatch) return youtuBeMatch[1];

  // Check for standard watch URL
  const watchMatch = value.match(/youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/);
  if (watchMatch) return watchMatch[1];

  return value; // assume it's already an ID
};

// YouTube Short Embed
const YoutubeShortEmbed = ({ shortId = "" }) => {
  if (!shortId) return null;
  const src = `https://www.youtube.com/embed/${shortId}`;
  return (
    <div style={{ position: "relative", paddingBottom: "177.77%", height: 0, overflow: "hidden", borderRadius: "12px", background: "#000" }}>
      <iframe
        src={src}
        title={`YouTube Short ${shortId}`}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const YoutubeShortsUploader = () => {
  const [shortUrl, setShortUrl] = useState("");
  const [shorts, setShorts] = useState([]);
  const [view, setView] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // load data
  const loadShorts = async () => {
    const res = await getData("admin/shorts/all");
    if (res.success) {
      setShorts(res.shorts || []);
    }
  };

  // save / update
  const saveShort = async () => {
    const pureId = extractYoutubeId(shortUrl?.trim());

    if (!pureId) return toastError("Valid YouTube ID or Link required");

    const payload = { short_id: pureId };

    try {
      let res;
      if (editItem) {
        res = await postData(`admin/shorts/${editItem}`, payload);
      } else {
        res = await postData("admin/shorts", payload);
      }

      if (res && (res?.data?.success || res?.success)) {
        toastSuccess(editItem ? "Updated Successfully" : "Added Successfully");
        setShortUrl("");
        setEditItem(null);
        await loadShorts();
      } else {
        toastError(res?.message || "Failed saving YouTube short!");
      }
    } catch (e) {
      console.error(e);
      toastError("Request Failed!");
    }
  };

  // delete
  const deleteShort = async (id) => {
    if (!window.confirm("Are you sure you want to delete this YouTube Short?")) return;
    const res = await deleteDataNew(`admin/shorts-delete/${id}`);
    if (res.success) {
      toastSuccess("Deleted successfully");
      await loadShorts();
    } else toastError("Failed to delete");
  };

  useEffect(() => {
    loadShorts();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>
          <div className="mb-4">
            <h1 className="page-title">YouTube Shorts</h1>
            <p className="page-subtitle">
              Paste YouTube link or Shorts ID to manage YouTube Shorts
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <input
                className="form-control"
                style={{ maxWidth: "400px", flex: 1 }}
                value={shortUrl}
                placeholder="YouTube Link or Shorts ID"
                onChange={(e) => setShortUrl(extractYoutubeId(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && saveShort()}
              />
              <button
                className="btn px-4"
                style={{
                  background: "linear-gradient(135deg, #FF0000, #CC0000)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "13px",
                  padding: "9px 18px",
                }}
                onClick={saveShort}
              >
                {editItem ? "Update Short" : "Add Short"}
              </button>
              {editItem && (
                <button
                  className="btn px-4"
                  style={{
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "13px",
                    padding: "9px 18px",
                  }}
                  onClick={() => {
                    setEditItem(null);
                    setShortUrl("");
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
              }}
            >
              <h6
                style={{
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#0f172a",
                  marginBottom: 0,
                }}
              >
                Saved YouTube Shorts ({shorts?.length || 0})
              </h6>
            </div>

            <div style={{ padding: "16px" }}>
              {shorts?.length === 0 && (
                <div
                  className="text-center py-4"
                  style={{ color: "#94a3b8", fontSize: "13px" }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                    🎥
                  </div>
                  No YouTube Shorts added yet
                </div>
              )}
              {shorts?.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: "14px 16px",
                    marginBottom: "8px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      color: "#334155",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <span style={{ color: "#FF0000" }}>▶</span> {s.short_id}
                  </span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm"
                      style={{
                        background: "rgba(5, 150, 105, 0.1)",
                        color: "#059669",
                        border: "1px solid rgba(5, 150, 105, 0.2)",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "12px",
                      }}
                      onClick={() => setView(s.short_id)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#dc2626",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "12px",
                      }}
                      onClick={() => deleteShort(s.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: "rgba(15, 23, 42, 0.08)",
                        color: "#334155",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "12px",
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://www.youtube.com/shorts/${s.short_id}`,
                        );
                        toastSuccess("Copied Link!");
                      }}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View Modal */}
        {view && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.75)",
              backdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              zIndex: 9999,
            }}
            onClick={() => setView(null)}
          >
            <div
              style={{
                background: "white",
                padding: 24,
                borderRadius: "16px",
                width: "90%",
                maxWidth: "400px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6
                  style={{ fontWeight: 700, color: "#0f172a", marginBottom: 0 }}
                >
                  YouTube Short Preview
                </h6>
                <button
                  className="btn btn-sm"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#dc2626",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                  }}
                  onClick={() => setView(null)}
                >
                  ✕ Close
                </button>
              </div>
              <YoutubeShortEmbed shortId={view} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeShortsUploader;
