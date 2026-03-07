import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getData, postData } from "../Common/APIs/api";
import {
  toastError,
  toastInfo,
  toastSuccess,
} from "../../Services/toast.service";

const INITIAL_OFFERS = {
  offer_text1: "",
  offer_text2: "",
  offer_text3: "",
  offer_text4: "",
};

const OfferTable = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editOffers, setEditOffers] = useState(INITIAL_OFFERS);

  const location = useLocation();
  const isRajlaxmi = useMemo(
    () => location.pathname.startsWith("/rajlaxmi"),
    [location.pathname]
  );

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getData("admin/getAllOffer");

      if (!response?.success) {
        toastError("Failed to load offers."); // [web:14][web:7]
        return;
      }

      const dataArray = Array.isArray(response.data) ? response.data : [];

      setOffers(dataArray);

      setEditOffers({
        offer_text1: dataArray[0] || "",
        offer_text2: dataArray[1] || "",
        offer_text3: dataArray[2] || "",
        offer_text4: dataArray[3] || "",
      });
    } catch (error) {
      console.error("Fetch offers error:", error);
      toastError("Unable to fetch offers. Please try again."); // [web:7][web:14]
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleUpdateOffers = async () => {
    try {
      const payload = {
        ...editOffers,
        source: isRajlaxmi ? "rajlaxmi" : "default",
      };

      const response = await postData("admin/updateOffer", payload);

      if (response?.success) {
        toastSuccess("Offers updated successfully!"); // [web:6][web:9]
        setEditMode(false);
        fetchOffers();
      } else {
        toastError(response?.message || "Failed to update offers."); // [web:7]
      }
    } catch (error) {
      console.error("Update offers error:", error);
      toastError("Something went wrong while updating offers."); // [web:7]
    }
  };

  const handleEditClick = () => {
    setEditMode((prev) => {
      const next = !prev;
      if (next) {
        toastInfo("Edit mode enabled. Update offers and click Save."); // [web:9][web:12]
      }
      return next;
    });
  };

  const handleChange = (field, value) => {
    setEditOffers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const visibleOffers = useMemo(() => offers.slice(0, 4), [offers]); // [web:1][web:3]

  const emptyRowsCount = Math.max(0, 4 - visibleOffers.length); // [web:5]

  if (loading) {
    return (
      <div className="recent-table bg-white d-flex flex-column">
        <div className="d-flex justify-content-center align-items-center p-5">
          <div className="spinner-border text-success me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>Loading offers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-table bg-white d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-3 recent-tble-header text-murmaid-color bg-light-green-color">
        <p className="font-20 inter-font-family-500 mb-0">
          Offers Management {isRajlaxmi && "(Rajlaxmi)"}
        </p>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className={`px-3 py-1 rounded font-12 inter-font-family-500 ${
              editMode
                ? "bg-danger text-white"
                : "bg-light-green-color text-murmaid-color"
            }`}
            onClick={handleEditClick}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>

          {editMode && (
            <button
              type="button"
              className="px-3 py-1 rounded font-12 inter-font-family-500 bg-primary text-white"
              onClick={handleUpdateOffers}
              disabled={
                !editOffers.offer_text1 &&
                !editOffers.offer_text2 &&
                !editOffers.offer_text3 &&
                !editOffers.offer_text4
              } // [web:3][web:11]
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      {editMode && (
        <div className="px-lg-5 px-3 pb-4 pt-2">
          <div className="row g-3">
            {["offer_text1", "offer_text2", "offer_text3", "offer_text4"].map(
              (field, index) => (
                <div key={field} className="col-12 col-md-6 col-lg-3">
                  <label
                    htmlFor={field}
                    className="form-label font-14 inter-font-family-500 text-murmaid-color"
                  >
                    Offer {index + 1}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="text"
                    maxLength={200}
                    className="form-control border rounded-3 py-2"
                    value={editOffers[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={`Enter offer text ${index + 1}`}
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}

      {!editMode && (
        <div className="table-responsive flex-grow-1 px-lg-5 px-3 pb-4">
          <table className="table text-nowrap fixed-table">
            <thead className="text-center">
              <tr>
                <th className="text-dark-silver-color inter-font-family-500 align-middle">
                  #
                </th>
                <th className="text-dark-silver-color inter-font-family-500 align-middle">
                  Offer Text
                </th>
                <th className="text-dark-silver-color inter-font-family-500 align-middle">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {visibleOffers.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-muted py-4 inter-font-family-400"
                  >
                    No offers configured yet.
                  </td>
                </tr>
              )}

              {visibleOffers.map((offer, index) => (
                <tr key={index}>
                  <td className="text-murmaid-color inter-font-family-400 align-middle">
                    {index + 1}
                  </td>
                  <td className="text-murmaid-color inter-font-family-400 align-middle text-start ps-4">
                    {offer}
                  </td>
                  <td className="text-murmaid-color inter-font-family-400 align-middle">
                    <span className="badge bg-success px-3 py-1 rounded-3 font-12">
                      Active
                    </span>
                  </td>
                </tr>
              ))}

              {Array.from({ length: emptyRowsCount }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td colSpan={3} className="empty_row"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OfferTable;
