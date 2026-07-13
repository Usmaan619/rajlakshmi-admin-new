import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import {
  getData,
  postData,
  deleteDataNew,
} from "../../Common/APIs/api";
import { toastSuccess, toastError } from "../../../Services/toast.service";

// Extract ID from instagram link
const extractReelId = (value) => {
  if (!value) return "";
  const match = value.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : value;
};

// Instagram Embed
const InstaReelEmbed = ({ reelId = "" }) => {
  if (!reelId) return null;
  const src = `https://www.instagram.com/reel/${reelId}/embed`;
  return (
    <iframe
      src={src}
      title={`Instagram Reel ${reelId}`}
      style={{ width: "100%", height: 600, border: "none" }}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
};

const ReelUploader = () => {
  const [reelId, setReelId] = useState("");
  const [reels, setReels] = useState([]);
  const [view, setView] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // load data
  const loadReels = async () => {
    const res = await getData("admin/reels/all"); // <-- IMPORTANT
    if (res.success) {
      setReels(res.reels);
    }
  };

  // save / update
  const saveReel = async () => {
    const pureId = extractReelId(reelId?.trim());

    if (!pureId) return toastError("Valid Reel ID required");

    const payload = { reel_id: pureId }; // always send correct key

    try {
      let res;
      if (editItem) {
        res = await postData(`admin/reels/${editItem}`, payload);
      } else {
        res = await postData("admin/reels", payload);
      }



      if (res && res?.data?.success) {
        toastSuccess(editItem ? "Updated" : "Added");
        setReelId("");
        setEditItem(null);
        await loadReels();
      } else {
        toastError(res?.message || "Failed saving reel!");
      }
    } catch (e) {
      console.error(e);
      toastError("Request Failed!");
    }
  };

  // delete
  const deleteReel = async (id) => {
    if (!window.confirm("Delete?")) return;
    const res = await deleteDataNew(`admin/reels-delete/${id}`);
    if (res.success) {
      toastSuccess("Deleted");
      await loadReels();
    } else toastError("Failed");
  };

  useEffect(() => {
    loadReels();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>
          <div className="mb-4">
            <h1 className="page-title">Instagram Reels</h1>
            <p className="page-subtitle">
              Paste Instagram link or reel ID to manage reels
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
                value={reelId}
                placeholder="Reel ID or Instagram Link"
                onChange={(e) => setReelId(extractReelId(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && saveReel()}
              />
              <button
                className="btn px-4"
                style={{
                  background: "linear-gradient(135deg, #e07a5f, #c96745)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "13px",
                  padding: "9px 18px",
                }}
                onClick={saveReel}
              >
                {editItem ? "Update Reel" : "Add Reel"}
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
                    setReelId("");
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
                Saved Reels ({reels?.length || 0})
              </h6>
            </div>

            <div style={{ padding: "16px" }}>
              {reels?.length === 0 && (
                <div
                  className="text-center py-4"
                  style={{ color: "#94a3b8", fontSize: "13px" }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                    🎬
                  </div>
                  No reels added yet
                </div>
              )}
              {reels?.map((r) => (
                <div
                  key={r.id}
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
                    }}
                  >
                    🎥 {r.reel_id}
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
                      onClick={() => setView(r.reel_id)}
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
                      onClick={() => deleteReel(r.id)}
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
                          `https://www.instagram.com/reel/${r.reel_id}/`,
                        );
                        toastSuccess("Copied!");
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
                maxWidth: "600px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6
                  style={{ fontWeight: 700, color: "#0f172a", marginBottom: 0 }}
                >
                  Reel Preview
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
              <InstaReelEmbed reelId={view} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelUploader;
