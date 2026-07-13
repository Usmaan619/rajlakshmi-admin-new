import React from "react";

const InstaReelEmbed = ({ reelId = "DRluM3xAU0L" }) => {
  const src = `https://www.instagram.com/reel/${reelId}/embed`;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 400 }}>
      <iframe
        src={src}
        style={{
          border: "none",
          width: "100%",
          height: "600px", // apni design ke hisaab se fix karo
        }}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default InstaReelEmbed;
