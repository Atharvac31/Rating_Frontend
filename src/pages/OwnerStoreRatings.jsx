import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "./stores.css";

const OwnerStoreRatings = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const res = await axiosClient.get(`/owner/stores/${storeId}/ratings`);
      setStore(res.data.store);
      setRatings(res.data.ratings);
    } catch (err) {
      console.error("Failed to load ratings", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!store) return <div>Store not found</div>;

  return (
    <div className="stores-root">
      <h2>{store.name} — Ratings</h2>
      <p>⭐ {store.average_rating} | {store.ratings_count} ratings</p>

      {ratings.length === 0 ? (
        <div>No ratings yet.</div>
      ) : (
        <div className="ratings-list">
          {ratings.map((r) => (
            <div key={r.id} className="store-card">
              <strong>{r.user?.name}</strong> ({r.user?.email})
              <p>⭐ {r.rating_value}</p>
              {r.comment && <p>💬 {r.comment}</p>}
              <small>{new Date(r.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerStoreRatings;
