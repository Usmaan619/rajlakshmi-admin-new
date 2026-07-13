import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

/* ── helper: create a cropped image from a canvas ──────────────────────── */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Crop the image and optionally resize to a target output size.
 * @param {string} imageSrc
 * @param {{ x, y, width, height }} pixelCrop
 * @param {number} rotation
 * @param {{ width: number, height: number } | null} outputSize – if set, resize canvas to these exact px
 */
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, outputSize = null) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // First draw cropped area at original size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  // If outputSize specified, resize to exact dimensions
  if (outputSize) {
    const resizeCanvas = document.createElement("canvas");
    resizeCanvas.width = outputSize.width;
    resizeCanvas.height = outputSize.height;
    const resizeCtx = resizeCanvas.getContext("2d");
    resizeCtx.imageSmoothingEnabled = true;
    resizeCtx.imageSmoothingQuality = "high";
    resizeCtx.drawImage(canvas, 0, 0, outputSize.width, outputSize.height);

    return new Promise((resolve) => {
      resizeCanvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.92
      );
    });
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.92
    );
  });
}

/* ── Output Size Presets (matching frontend card & detail page) ─────────── */
const OUTPUT_SIZES = [
  { label: "Portrait (900×1600)", value: { width: 900, height: 1600 }, icon: "bi-phone" },
  { label: "Card (265×265)", value: { width: 265, height: 265 }, icon: "bi-card-image" },
  { label: "Detail (600×600)", value: { width: 600, height: 600 }, icon: "bi-image" },
  { label: "Original Size", value: null, icon: "bi-arrows-fullscreen" },
];

/* ── Aspect Ratio presets ──────────────────────────────────────────────── */
const ASPECT_RATIOS = [
  { label: "9:16", value: 9 / 16 },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "16:9", value: 16 / 9 },
  { label: "Free", value: null },
];

/* ══════════════════════════════════════════════════════════════════════════
   ImageCropperModal
   ─────────────────
   Props:
     imageSrc      – object URL or data URL of the image to crop
     onCropDone    – (croppedBlob) => void   called when user clicks "Apply"
     onClose       – () => void              called when user closes the modal
     fileName      – original file name (for naming the output blob)
   ══════════════════════════════════════════════════════════════════════════ */
const ImageCropperModal = ({ imageSrc, onCropDone, onClose, fileName }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspect, setAspect] = useState(9 / 16); // default 9:16 portrait
  const [processing, setProcessing] = useState(false);
  const [outputSize, setOutputSize] = useState(OUTPUT_SIZES[0].value); // default Portrait 900×1600

  const onCropComplete = useCallback((_croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        outputSize
      );
      // Convert blob to File so FormData can use original name
      const ext = fileName?.split(".").pop() || "jpg";
      const croppedFile = new File(
        [croppedBlob],
        fileName || `cropped.${ext}`,
        { type: croppedBlob.type }
      );
      onCropDone(croppedFile);
    } catch (e) {
      console.error("Crop error:", e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !processing) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
          animation: "cropperSlideIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <i
              className="bi bi-crop"
              style={{ fontSize: 20, color: "#fff" }}
            ></i>
            <div>
              <h6
                style={{
                  margin: 0,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                Crop & Resize Image
              </h6>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                Adjust crop area, then select output size
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
            disabled={processing}
            style={{ fontSize: 10 }}
          />
        </div>

        {/* ── Crop Area ──────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 380,
            background: "#1a1a2e",
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect || undefined}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            cropShape="rect"
            showGrid={true}
            style={{
              containerStyle: { borderRadius: 0 },
              cropAreaStyle: {
                border: "2px solid #667eea",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
              },
            }}
          />
        </div>

        {/* ── Controls ───────────────────────────────────────────────────── */}
        <div style={{ padding: "20px 24px", background: "#fafbff" }}>

          {/* Output Size Presets */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
                display: "block",
              }}
            >
              <i className="bi bi-bounding-box me-1"></i> Output Size
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {OUTPUT_SIZES.map((os) => {
                const isActive =
                  outputSize === os.value ||
                  (outputSize &&
                    os.value &&
                    outputSize.width === os.value.width &&
                    outputSize.height === os.value.height);
                return (
                  <button
                    key={os.label}
                    type="button"
                    onClick={() => setOutputSize(os.value)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 10,
                      border: isActive
                        ? "2px solid #059669"
                        : "1.5px solid #e2e8f0",
                      background: isActive
                        ? "linear-gradient(135deg, #059669, #10b981)"
                        : "#fff",
                      color: isActive ? "#fff" : "#475569",
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <i className={`bi ${os.icon}`} style={{ fontSize: 13 }}></i>
                    {os.label}
                  </button>
                );
              })}
            </div>
            {outputSize && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 11,
                  color: "#059669",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <i className="bi bi-check-circle-fill"></i>
                Output will be resized to {outputSize.width}×{outputSize.height}px
              </div>
            )}
          </div>

          {/* Aspect Ratio */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
                display: "block",
              }}
            >
              <i className="bi bi-aspect-ratio me-1"></i> Aspect Ratio
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.label}
                  type="button"
                  onClick={() => setAspect(ar.value)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 20,
                    border:
                      aspect === ar.value
                        ? "2px solid #667eea"
                        : "1.5px solid #e2e8f0",
                    background:
                      aspect === ar.value
                        ? "linear-gradient(135deg, #667eea, #764ba2)"
                        : "#fff",
                    color: aspect === ar.value ? "#fff" : "#475569",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom */}
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <i className="bi bi-zoom-in me-1"></i> Zoom
              </label>
              <span
                style={{
                  fontSize: 11,
                  color: "#667eea",
                  fontWeight: 700,
                  background: "#eef0ff",
                  padding: "2px 10px",
                  borderRadius: 12,
                }}
              >
                {zoom.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#667eea",
                height: 6,
              }}
            />
          </div>

          {/* Rotation */}
          <div style={{ marginBottom: 6 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <i className="bi bi-arrow-repeat me-1"></i> Rotation
              </label>
              <span
                style={{
                  fontSize: 11,
                  color: "#667eea",
                  fontWeight: 700,
                  background: "#eef0ff",
                  padding: "2px 10px",
                  borderRadius: 12,
                }}
              >
                {rotation}°
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#764ba2",
                height: 6,
              }}
            />
          </div>
        </div>

        {/* ── Footer Buttons ─────────────────────────────────────────────── */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #e8ecf4",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setCrop({ x: 0, y: 0 });
              setZoom(1);
              setRotation(0);
              setAspect(9 / 16);
              setOutputSize(OUTPUT_SIZES[0].value);
            }}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "1.5px solid #e2e8f0",
              background: "#fff",
              color: "#64748b",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              style={{
                padding: "8px 24px",
                borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                background: "#fff",
                color: "#64748b",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={processing}
              style={{
                padding: "8px 28px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
                transition: "all 0.2s ease",
              }}
            >
              {processing ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle"></i> Apply Crop
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Animation keyframes ────────────────────────────────────────── */}
      <style>{`
        @keyframes cropperSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ImageCropperModal;
