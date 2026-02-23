
import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import { toastSuccess, toastError } from "../../../Services/toast.service";
import {
  deleteData,
  deleteDataReel,
  getData,
  postFormData,
} from "../../Common/APIs/api";

const MAX_VIDEO_SIZE = 150 * 1024 * 1024;
const MAX_THUMB_SIZE = 115 * 1024 * 1024;
const MAX_VIDEO_DURATION = 60;

const uid = () => Math.random().toString(36).substring(2, 10);

const chunkIntoSections = (array, chunkCount = 4) => {
  const perSection = Math.ceil(array.length / chunkCount);
  const result = [];
  for (let i = 0; i < chunkCount; i++) {
    result.push(array.slice(i * perSection, (i + 1) * perSection));
  }
  return result;
};

const makeEmptySection = () => ({
  reels: [],
  previews: [],
  titles: [],
  descriptions: [],
  thumbs: [],
  loading: false,
  progress: 0,
  uploaded: false,
});

const ReelUploader = () => {
  const [sections, setSections] = useState(
    new Array(4).fill(0).map(() => makeEmptySection())
  );
  const playAllRef = useRef(null);
  const [playQueue, setPlayQueue] = useState([]);
  const [playIndex, setPlayIndex] = useState(0);
  const [allReels, setAllReels] = useState([]);

  useEffect(() => {
    loadAllReels();
  }, []);

  const getVideoDuration = (file) =>
    new Promise((resolve) => {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => resolve(v.duration);
      v.onerror = () => resolve(999);
      v.src = URL.createObjectURL(file);
    });

  const extractTitle = (filename) =>
    filename.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

  const mapServerReelToLocal = (r) => ({
    tempId: uid(),
    id: r.id,
    server: true,
    name: r.title || "video.mp4",
    video_url: r.video_url,
    thumb_url: r.thumb_url,
    title: r.title || "",
    description: r.description || "",
    created_at: r.created_at,
  });

  const loadAllReels = async () => {
    try {
      const response = await getData("reels/all");
      const { success, reels } = response || {};

      if (success && Array.isArray(reels) && reels.length > 0) {
        setAllReels(reels);
        const localReels = reels.map(mapServerReelToLocal);
        const distributed = chunkIntoSections(localReels, 4);
        const updatedSections = new Array(4).fill(0).map((_, secIndex) => {
          const group = distributed[secIndex] || [];
          if (group.length > 0) {
            return {
              ...makeEmptySection(),
              reels: group,
              previews: group.map((r) => r.video_url || ""),
              titles: group.map((r) => r.title || ""),
              descriptions: group.map((r) => r.description || ""),
              uploaded: true,
            };
          }
          return makeEmptySection();
        });
        setSections(updatedSections);
        toastSuccess(`Loaded ${reels.length} reels`);
      }
    } catch (err) {
      toastError(`Error: ${err.message || "Failed to load reels"}`);
    }
  };

  const openPlayAllModal = (previews) => {
    if (!previews || previews.length === 0) return;
    setPlayQueue(previews);
    setPlayIndex(0);
    const video = playAllRef.current;
    if (video) {
      video.src = previews[0];
      video.play().catch(() => {});
    }
    const el = document.getElementById("playAllModal");
    if (el) el.style.display = "flex";
  };

  const closePlayAllModal = () => {
    const video = playAllRef.current;
    if (video) {
      video.pause();
      video.src = "";
    }
    const el = document.getElementById("playAllModal");
    if (el) el.style.display = "none";
  };

  const nextPlay = () => {
    if (playIndex + 1 >= playQueue.length) {
      closePlayAllModal();
      return;
    }
    const next = playIndex + 1;
    setPlayIndex(next);
    const video = playAllRef.current;
    if (video) {
      video.src = playQueue[next];
      video.play().catch(() => {});
    }
  };

  const processReels = async (secIndex, filesList) => {
    const updated = [...sections];
    const validReels = [];
    const previews = [];
    const titles = [];
    const descriptions = [];

    for (let file of filesList) {
      if (!file.type.startsWith("video/")) {
        toastError(`Invalid video: ${file.name}`);
        continue;
      }
      if (file.size > MAX_VIDEO_SIZE) {
        toastError(
          `Max ${Math.round(MAX_VIDEO_SIZE / (1024 * 1024))}MB allowed: ${
            file.name
          }`
        );
        continue;
      }

      const duration = await getVideoDuration(file);
      if (duration > MAX_VIDEO_DURATION) {
        toastError(`Max ${MAX_VIDEO_DURATION} seconds: ${file.name}`);
        continue;
      }

      const tempId = uid();
      validReels.push({
        tempId,
        server: false,
        file,
        name: file.name,
        title: extractTitle(file.name),
        description: "",
        video_url: URL.createObjectURL(file),
      });

      previews.push(URL.createObjectURL(file));
      titles.push(extractTitle(file.name));
      descriptions.push("");
    }

    updated[secIndex].reels = validReels;
    updated[secIndex].previews = previews;
    updated[secIndex].titles = titles;
    updated[secIndex].descriptions = descriptions;
    updated[secIndex].uploaded = false;
    updated[secIndex].thumbs = [];

    setSections(updated);
  };

  const handleReelsSelection = (secIndex, e) =>
    processReels(secIndex, Array.from(e.target.files));

  const handleDropZone = (secIndex, files) =>
    processReels(secIndex, Array.from(files));

  const handleThumbSelection = (index, e) => {
    const updated = [...sections];
    const files = Array.from(e.target.files);

    updated[index].thumbs = files.filter((f) => {
      if (!f.type.startsWith("image/")) {
        toastError("Only images allowed");
        return false;
      }
      if (f.size > MAX_THUMB_SIZE) {
        toastError(
          `Max ${Math.round(MAX_THUMB_SIZE / (1024 * 1024))}MB allowed`
        );
        return false;
      }
      return true;
    });

    setSections(updated);
  };

  const handleTitleChange = (sec, reelIndex, value) => {
    const updated = [...sections];
    updated[sec].titles[reelIndex] = value;
    if (updated[sec].reels[reelIndex]) {
      updated[sec].reels[reelIndex].title = value;
    }
    setSections(updated);
  };

  const handleDescriptionChange = (sec, reelIndex, value) => {
    const updated = [...sections];
    updated[sec].descriptions[reelIndex] = value;
    if (updated[sec].reels[reelIndex]) {
      updated[sec].reels[reelIndex].description = value;
    }
    setSections(updated);
  };

  const handleDragEnd = (secIndex, result) => {
    if (!result.destination) return;

    const updated = [...sections];
    const sec = updated[secIndex];

    const reels = Array.from(sec.reels);
    const previews = Array.from(sec.previews);
    const titles = Array.from(sec.titles);
    const descriptions = Array.from(sec.descriptions);

    const [r] = reels.splice(result.source.index, 1);
    const [p] = previews.splice(result.source.index, 1);
    const [t] = titles.splice(result.source.index, 1);
    const [d] = descriptions.splice(result.source.index, 1);

    reels.splice(result.destination.index, 0, r);
    previews.splice(result.destination.index, 0, p);
    titles.splice(result.destination.index, 0, t);
    descriptions.splice(result.destination.index, 0, d);

    sec.reels = reels;
    sec.previews = previews;
    sec.titles = titles;
    sec.descriptions = descriptions;

    setSections(updated);
  };

  const handleReplaceReel = async (secIndex, reelIndex, file) => {
    if (!file) return;

    const duration = await getVideoDuration(file);
    if (duration > MAX_VIDEO_DURATION) {
      return toastError(`Max ${MAX_VIDEO_DURATION} seconds allowed`);
    }

    const updated = [...sections];
    const target = updated[secIndex].reels[reelIndex];

    updated[secIndex].reels[reelIndex] = {
      ...target,
      server: false,
      file,
      video_url: URL.createObjectURL(file),
    };

    updated[secIndex].previews[reelIndex] = URL.createObjectURL(file);
    updated[secIndex].titles[reelIndex] = target.title;
    updated[secIndex].descriptions[reelIndex] = target.description;

    setSections(updated);
  };

  const handleReelUpload = async (secIndex) => {
    const section = sections[secIndex];

    if (!section || section.reels.length === 0)
      return toastError("Add at least 1 reel");

    const fd = new FormData();

    section.reels.forEach((item, index) => {
      if (!item.server && item.file) {
        fd.append("reels", item.file);
        fd.append("types", "file");
        fd.append("ids", item.tempId || "");
      } else {
        fd.append("reels", "");
        fd.append("types", "server");
        fd.append("ids", item.id);
      }

      fd.append("titles", item.title || "");
      fd.append("descriptions", item.description || "");
      fd.append("order", index.toString());
    });

    section.thumbs.forEach((f) => fd.append("thumbs", f));

    try {
      const updated = [...sections];
      updated[secIndex].loading = true;
      updated[secIndex].progress = 0;
      setSections(updated);

      const res = await postFormData("/upload-multiple-reels", fd, (evt) => {
        if (evt.total) {
          const progress = Math.round((evt.loaded / evt.total) * 100);
          const clone = [...sections];
          clone[secIndex].progress = progress;
          setSections(clone);
        }
      });

      if (res?.data?.success) {
        toastSuccess("Reels Uploaded Successfully!");
        setTimeout(() => loadAllReels(), 500);
        updated[secIndex].loading = false;
        updated[secIndex].uploaded = true;
        updated[secIndex].progress = 100;
        setSections(updated);
      } else {
        toastError(res?.data?.message || "Upload failed");
      }
    } catch (err) {
      toastError("Upload failed");
      const updated = [...sections];
      updated[secIndex].loading = false;
      updated[secIndex].progress = 0;
      setSections(updated);
    }
  };

  const handleDeleteReel = async (idOrTempId, serverFlag = false) => {
    if (!window.confirm("Delete this reel?")) return;

    try {
      if (serverFlag) {
        const res = await deleteDataReel(`reels/${idOrTempId}`);
        if (res && res.success) {
          toastSuccess("Deleted Successfully!");
          loadAllReels();
        } else {
          toastError("Delete failed");
        }
      } else {
        const updated = sections.map((sec) => {
          const newReels = sec.reels.filter((r) => r.tempId !== idOrTempId);
          const newPreviews = sec.previews.filter(
            (_, idx) => sec.reels[idx] && sec.reels[idx].tempId !== idOrTempId
          );
          const newTitles = sec.titles.filter(
            (_, idx) => sec.reels[idx] && sec.reels[idx].tempId !== idOrTempId
          );
          const newDescs = sec.descriptions.filter(
            (_, idx) => sec.reels[idx] && sec.reels[idx].tempId !== idOrTempId
          );

          return {
            ...sec,
            reels: newReels,
            previews: newPreviews,
            titles: newTitles,
            descriptions: newDescs,
          };
        });
        setSections(updated);
        toastSuccess("Removed local reel");
      }
    } catch (err) {
      toastError("Delete failed");
    }
  };

  return (
    <div
      className="container-fluid px-0 min-vh-100"
    >
      <Navbar />

      <div className="row g-0">
        <div className="col-lg-2 d-none d-lg-block">
          <Sidebar />
        </div>

        <div className="col-12 col-lg-10" style={{ padding: "2rem 1rem" }}>
          {/* Header - Fixed spacing */}
          <div style={{ maxWidth: "1400px", margin: "0 auto 2rem" }}>
            <div className="mb-3"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                // backgroundColor: "white",
                padding: "1.5rem 1.5rem",
                borderRadius: "12px",
                // boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    // background: "linear-gradient(135deg, #000, #000)",
                    // WebkitBackgroundClip: "text",
                    // WebkitTextFillColor: "transparent",
                    color:"#000",
                    fontWeight: "800",
                  }}
                >
                   Reel Uploader
                </h1>
                <p
                  style={{
                    margin: "0.5rem 0 0 0",
                    color: "#666",
                    fontSize: "0.9rem",
                  }}
                >
                  Upload and manage your videos
                </p>
              </div>
              <button
                onClick={loadAllReels}
                style={{
                  background: "linear-gradient(135deg, #e07a5f, #e07a5f)",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.transform = "translateY(-2px)")
                }
                onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
              >
                Refresh ({allReels.length})
              </button>
            </div>

            {/* Sections Grid - Responsive */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "1.5rem",
                "@media (max-width: 768px)": {
                  gridTemplateColumns: "1fr",
                },
              }}
            >
              {sections.map((section, secIndex) => (
                <div
                  key={secIndex}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "400px",
                  }}
                >
                  {/* Section Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1.5rem",
                      paddingBottom: "1rem",
                      borderBottom: "1px solid #e0e0e0",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1rem",
                          fontWeight: "700",
                          color: "#2d3748",
                        }}
                      >
                        Section {secIndex + 1}
                      </h3>
                      <span style={{ fontSize: "0.85rem", color: "#718096" }}>
                        {section.reels.length} video
                        {section.reels.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {section.reels.length > 1 && (
                      <button
                        onClick={() => openPlayAllModal(section.previews)}
                        style={{
                          background:
                            "linear-gradient(135deg, #48bb78, #38a169)",
                          color: "white",
                          border: "none",
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          transition: "all 0.3s ease",
                          whiteSpace: "nowrap",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.transform = "scale(1)")
                        }
                      >
                        ▶️ Play All
                      </button>
                    )}
                  </div>

                  {/* Empty State - Drop Zone */}
                  {section.reels.length === 0 && (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDropZone(secIndex, e.dataTransfer.files);
                      }}
                      onClick={() =>
                        document.getElementById(`fileInput-${secIndex}`).click()
                      }
                      style={{
                        border: "2px dashed #cbd5e0",
                        borderRadius: "8px",
                        padding: "2rem 1rem",
                        textAlign: "center",
                        cursor: "pointer",
                        background:
                          "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
                        transition: "all 0.3s ease",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "#e07a5f";
                        e.currentTarget.style.background =
                          "linear-gradient(135deg, #ebf4ff 0%, #e6fffa 100%)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "#cbd5e0";
                        e.currentTarget.style.background =
                          "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)";
                      }}
                    >
                      <div
                        style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}
                      >
                        ☁️
                      </div>
                      <h4
                        style={{
                          margin: "0 0 0.25rem 0",
                          fontSize: "1rem",
                          fontWeight: "600",
                          color: "#2d3748",
                        }}
                      >
                        Drop videos
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.8rem",
                          color: "#718096",
                        }}
                      >
                        Max 150MB, 60s
                      </p>
                    </div>
                  )}

                  <input
                    id={`fileInput-${secIndex}`}
                    type="file"
                    multiple
                    accept="video/*"
                    hidden
                    onChange={(e) => handleReelsSelection(secIndex, e)}
                  />

                  {/* Thumbnail Upload */}
                  {section.reels.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          color: "#4a5568",
                          marginBottom: "0.5rem",
                        }}
                      >
                         Thumbnails
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleThumbSelection(secIndex, e)}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  )}

                  {/* Video Grid */}
                  {/* Video Grid */}
                  {section.previews.length > 0 && (
                    <DragDropContext
                      onDragEnd={(r) => handleDragEnd(secIndex, r)}
                    >
                      <Droppable droppableId={`drop-${secIndex}`}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "1rem",
                              flex: 1,
                            }}
                          >
                            {section.reels.map((reel, reelIndex) => {
                              const previewUrl =
                                reel.video_url ||
                                section.previews[reelIndex] ||
                                "";
                              const title =
                                reel.title || section.titles[reelIndex] || "";
                              const description =
                                reel.description ||
                                section.descriptions[reelIndex] ||
                                "";
                              const uniqueId = reel.id
                                ? `db-${reel.id}`
                                : `temp-${reel.tempId}`;

                              return (
                                <Draggable
                                  key={uniqueId}
                                  draggableId={uniqueId}
                                  index={reelIndex}
                                >
                                  {(drag, snapshot) => (
                                    <div
                                      ref={drag.innerRef}
                                      {...drag.draggableProps}
                                      {...drag.dragHandleProps}
                                      style={{
                                        backgroundColor: snapshot.isDragging
                                          ? "#f3e8ff"
                                          : "white",
                                        border: snapshot.isDragging
                                          ? "2px solid #e07a5f"
                                          : "1px solid #e0e0e0",
                                        borderRadius: "10px",
                                        padding: "1rem",
                                        boxShadow: snapshot.isDragging
                                          ? "0 8px 24px rgba(102, 126, 234, 0.3)"
                                          : "0 2px 8px rgba(0,0,0,0.08)",
                                        transition: "all 0.2s ease",
                                        ...drag.draggableProps.style,
                                      }}
                                    >
                                      {/* Video Preview Container - 450px height */}
                                      <div
                                        style={{
                                          position: "relative",
                                          width: "100%",
                                          marginBottom: "1rem",
                                          borderRadius: "8px",
                                          overflow: "hidden",
                                          backgroundColor: "#000",
                                        }}
                                      >
                                        <video
                                          src={previewUrl}
                                          controls
                                          controlsList="nodownload"
                                          style={{
                                            width: "100%",
                                            height: "450px",
                                            objectFit: "contain",
                                            display: "block",
                                          }}
                                        />
                                        <div
                                          style={{
                                            position: "absolute",
                                            top: "12px",
                                            right: "12px",
                                            background: "rgba(0,0,0,0.8)",
                                            color: "white",
                                            padding: "6px 12px",
                                            borderRadius: "6px",
                                            fontSize: "0.85rem",
                                            fontWeight: "700",
                                            zIndex: 10,
                                          }}
                                        >
                                          #{reelIndex + 1}
                                        </div>
                                      </div>

                                      {/* Content Section */}
                                      <div>
                                        {/* Title Input */}
                                        <input
                                          value={title}
                                          onChange={(e) =>
                                            handleTitleChange(
                                              secIndex,
                                              reelIndex,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Video title"
                                          style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "6px",
                                            fontSize: "0.95rem",
                                            fontWeight: "600",
                                            marginBottom: "0.75rem",
                                            boxSizing: "border-box",
                                            transition: "all 0.2s ease",
                                          }}
                                          onFocus={(e) =>
                                            (e.target.style.borderColor =
                                              "#e07a5f")
                                          }
                                          onBlur={(e) =>
                                            (e.target.style.borderColor =
                                              "#e2e8f0")
                                          }
                                        />

                                        {/* Description Input */}
                                        <textarea
                                          value={description}
                                          onChange={(e) =>
                                            handleDescriptionChange(
                                              secIndex,
                                              reelIndex,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Video description"
                                          rows="2"
                                          style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "6px",
                                            fontSize: "0.9rem",
                                            resize: "vertical",
                                            marginBottom: "1rem",
                                            boxSizing: "border-box",
                                            fontFamily: "inherit",
                                            transition: "all 0.2s ease",
                                          }}
                                          onFocus={(e) =>
                                            (e.target.style.borderColor =
                                              "#e07a5f")
                                          }
                                          onBlur={(e) =>
                                            (e.target.style.borderColor =
                                              "#e2e8f0")
                                          }
                                        />

                                        {/* Actions Row */}
                                        <div
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "0.75rem",
                                          }}
                                        >
                                          {/* Replace Button */}
                                          <label
                                            style={{
                                              textAlign: "center",
                                              padding: "0.75rem",
                                              background:
                                                "linear-gradient(135deg, #f0f4ff, #f5f0ff)",
                                              border: "2px solid #e2e8f0",
                                              borderRadius: "6px",
                                              fontSize: "0.9rem",
                                              fontWeight: "600",
                                              color: "#4a5568",
                                              cursor: "pointer",
                                              transition: "all 0.2s ease",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              gap: "0.5rem",
                                            }}
                                            onMouseOver={(e) => {
                                              e.target.style.borderColor =
                                                "#e07a5f";
                                              e.target.style.background =
                                                "linear-gradient(135deg, #ebf4ff, #e6fffa)";
                                            }}
                                            onMouseOut={(e) => {
                                              e.target.style.borderColor =
                                                "#e2e8f0";
                                              e.target.style.background =
                                                "linear-gradient(135deg, #f0f4ff, #f5f0ff)";
                                            }}
                                          >
                                            🔄 Replace
                                            <input
                                              type="file"
                                              accept="video/*"
                                              hidden
                                              onChange={(e) =>
                                                handleReplaceReel(
                                                  secIndex,
                                                  reelIndex,
                                                  e.target.files[0]
                                                )
                                              }
                                            />
                                          </label>

                                          {/* Delete Button */}
                                          <button
                                            onClick={() =>
                                              handleDeleteReel(
                                                reel.server && reel.id
                                                  ? reel.id
                                                  : reel.tempId,
                                                reel.server
                                              )
                                            }
                                            style={{
                                              padding: "0.75rem",
                                              background:
                                                "linear-gradient(135deg, #fed7d7, #fecaca)",
                                              border: "2px solid #fc8181",
                                              borderRadius: "6px",
                                              fontSize: "0.9rem",
                                              fontWeight: "600",
                                              color: "#c53030",
                                              cursor: "pointer",
                                              transition: "all 0.2s ease",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              gap: "0.5rem",
                                            }}
                                            onMouseOver={(e) => {
                                              e.target.style.background =
                                                "linear-gradient(135deg, #fc8181, #f56565)";
                                              e.target.style.borderColor =
                                                "#e53e3e";
                                            }}
                                            onMouseOut={(e) => {
                                              e.target.style.background =
                                                "linear-gradient(135deg, #fed7d7, #fecaca)";
                                              e.target.style.borderColor =
                                                "#fc8181";
                                            }}
                                          >
                                            🗑️ Delete
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}

                  {/* Upload Button */}
                  {section.reels.length > 0 && !section.uploaded && (
                    <button
                      onClick={() => handleReelUpload(secIndex)}
                      disabled={section.loading}
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        background: section.loading
                          ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                          : "linear-gradient(135deg, #e07a5f, #e07a5f)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        cursor: section.loading ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        width: "100%",
                      }}
                      onMouseOver={(e) =>
                        !section.loading &&
                        (e.target.style.transform = "translateY(-1px)")
                      }
                      onMouseOut={(e) =>
                        !section.loading &&
                        (e.target.style.transform = "translateY(0)")
                      }
                    >
                      {section.loading
                        ? `⏳ ${section.progress}%`
                        : `🚀 Upload`}
                    </button>
                  )}

                  {/* Success Badge */}
                  {section.uploaded && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        background: "linear-gradient(135deg, #d4fc79, #96e6a1)",
                        borderRadius: "8px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#22543d",
                        fontSize: "0.9rem",
                      }}
                    >
                       Success!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Play All Modal - Fixed positioning */}
          <div
            id="playAllModal"
            style={{
              display: "none",
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.95)",
              zIndex: 9999,
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
              backdropFilter: "blur(5px)",
            }}
            onClick={(e) =>
              e.target.id === "playAllModal" && closePlayAllModal()
            }
          >
            <div
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  gap: "1rem",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontWeight: "700",
                    color: "#2d3748",
                    fontSize: "0.95rem",
                  }}
                >
                  ▶️ {playIndex + 1} of {playQueue.length}
                </h3>
                <button
                  onClick={closePlayAllModal}
                  style={{
                    background: "#f7fafc",
                    border: "1px solid #e2e8f0",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  ✕ Close
                </button>
              </div>
              <video
                ref={playAllRef}
                controls
                autoPlay
                onEnded={nextPlay}
                style={{
                  width: "100%",
                  height: "300px",
                  borderRadius: "8px",
                  objectFit: "contain",
                  background: "#000",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .col-lg-2 { display: none !important; }
          .col-lg-10 { padding: 1rem 0.5rem !important; }
        }

        @media (max-width: 480px) {
          h1 { font-size: 1.2rem !important; }
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReelUploader;
