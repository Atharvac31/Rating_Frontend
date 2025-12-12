/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./stores.css";

// ⭐ COMPONENT: Stars
const RatingStars = ({ value = 0, onChange = () => {}, editable = true }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = (hover || value) >= i;
        return (
          <button
            key={i}
            type="button"
            className={`star-btn ${filled ? "filled" : ""} ${
              editable ? "editable" : "readonly"
            }`}
            onMouseEnter={() => editable && setHover(i)}
            onMouseLeave={() => editable && setHover(0)}
            onClick={() => editable && onChange(i)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

// ⭐ COMPONENT: Store Card
const StoreCard = ({ store, onRate }) => {
  return (
    <div className="store-card">
      <div className="store-left">
        <h3 className="store-name">{store.name}</h3>
        <p className="store-address">{store.address}</p>
        <div className="meta-row">
          <span className="avg-label">Avg:</span>
          <span className="avg-value">
            {store.avgRating != null ? store.avgRating.toFixed(1) : "—"}
          </span>
          <span className="dot">•</span>
          <span className="count">{store.totalRatings} ratings</span>
        </div>
      </div>

      <div className="store-right">
        <div className="your-rating">
          <div className="label">Your Rating</div>
          <RatingStars
            value={store.userRating || 0}
            editable={true}
            onChange={(newStars) => onRate(store.id, newStars)}
          />
        </div>
      </div>
    </div>
  );
};

// ⭐ MAIN PAGE: User Store List
const UserStoreList = () => {
  const { user, token, logout } = useAuth();
  const nav = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosClient.get("/user/stores");
      const raw = res.data?.data ?? [];

      const mapped = raw.map((s) => {
        const userRating = s.myRating
          ? Number(s.myRating.rating_value)
          : s.user_rating ?? null;

        return {
          id: s.id,
          name: s.name,
          address: s.address,
          avgRating: Number(s.average_rating) || 0,
          totalRatings: s.ratings_count || 0,
          userRating,
          ratingId: s.myRating?.id ?? null,
        };
      });

      setStores(mapped);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load stores");
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (storeId, stars) => {
    if (!user || !token) {
      setError("You must be logged in to rate stores.");
      return;
    }

    setRatingLoading((s) => ({ ...s, [storeId]: true }));
    setError("");

    const prev = [...stores];
    setStores((list) =>
      list.map((s) => (s.id === storeId ? { ...s, userRating: stars } : s))
    );

    try {
      await axiosClient.post(`/user/stores/${storeId}/rating`, {
        rating_value: stars,
      });

      await fetchStores();
    } catch (err) {
      setStores(prev);
      setError(err.response?.data?.message || "Rating failed");
    } finally {
      setRatingLoading((s) => ({ ...s, [storeId]: false }));
    }
  };

  return (
    <div className="stores-root">

      {/* 🧭 TOP RIGHT BUTTONS */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}>
        <button
          className="btn"
          style={{ padding: "6px 14px" }}
          onClick={() => nav("/me")}
        >
          My Profile
        </button>

        <button
          className="btn"
          style={{ background: "#ef4444", padding: "6px 14px" }}
          onClick={() => {
            logout();
            nav("/login");
          }}
          
        >
          Logout
        </button>
      </div>

      <h2 style={{ marginBottom: "16px" }}>Rate Stores</h2>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading stores...</div>
      ) : stores.length === 0 ? (
        <div className="empty">No stores available.</div>
      ) : (
        <div className="stores-list">
          {stores.map((store) => (
            <div key={store.id} className="store-row">
              <StoreCard store={store} onRate={handleRate} />
              {ratingLoading[store.id] && (
                <div className="small-loading">Saving...</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStoreList;
