import React from "react";

const DashboardCards = ({ cardData }) => {
  return (
    <div className="row mt-3 gy-3">
      {cardData.map((card, index) => (
        <div className="col-xl-3 col-lg-6 col-md-6" key={index}>
          <div
            className={`dashboard-card ${card.cardColor}`}
            style={{ minHeight: "110px" }}
          >
            <div className="d-flex align-items-center justify-content-between">
              {/* Icon Circle */}
              <div
                className={`dashboard-img-circle ${card.circleColor} d-flex align-items-center justify-content-center`}
                style={{ borderRadius: "12px", width: "52px", height: "52px" }}
              >
                <img
                  src={card.imgSrc}
                  alt={card.label}
                  style={{
                    width: "26px",
                    height: "26px",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Stats */}
              <div className="text-end">
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "rgba(71, 85, 105, 0.75)",
                    marginBottom: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 0,
                    lineHeight: 1.1,
                  }}
                >
                  {card.count}
                </p>
              </div>
            </div>

            {/* Bottom trend indicator */}
            <div
              className="d-flex align-items-center mt-3"
              style={{
                borderTop: "1px solid rgba(0,0,0,0.06)",
                paddingTop: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#10b981",
                }}
              >
                ● Active
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
