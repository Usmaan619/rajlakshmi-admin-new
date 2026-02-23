import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import FeedbackCard from "../../Common/feedbackCard/feedbackcard";
import Navbar from "../../Common/Navbar/navbar";
import { getData } from "../../Common/APIs/api";
import noDataImg from "../../Assets/Images/home-img/flat-design-no-data-illustration.png";

const Feedback = () => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingsBreakdown, setRatingsBreakdown] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getFeedbacksAPI();
  }, []);

  const getFeedbacksAPI = async () => {
    const endpoint = "/allfeedback";
    try {
      const response = await getData(endpoint);
      const data = response?.data;
      setAverageRating(data?.averageRating || 0);
      setTotalReviews(data?.totalReviews || 0);
      setRatingsBreakdown(
        data?.ratingsBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      );
      setReviews(response?.reviews || []);
    } catch (error) {}
  };

  const handleFeedbackDelete = (id) => {
    setReviews((prev) => prev.filter((review) => review._id !== id));
    getFeedbacksAPI();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <Navbar />
        <div style={{ padding: "24px 28px" }}>
          <div className="mb-4">
            <h1 className="page-title">Feedback & Reviews</h1>
            <p className="page-subtitle">
              Monitor customer feedback and ratings
            </p>
          </div>
          {reviews?.length === 0 ? (
            <div className="text-center d-flex flex-column align-items-center my-5">
              <img
                src={noDataImg}
                alt="No Data"
                className="no-data-img mb-3"
                style={{ maxWidth: "200px", opacity: 0.6 }}
              />
              <h5 style={{ color: "#64748b" }}>No Feedback Found</h5>
            </div>
          ) : (
            <FeedbackCard data={reviews} onDelete={handleFeedbackDelete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
