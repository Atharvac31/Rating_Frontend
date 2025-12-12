import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import "./stores.css";

const OwnerStoreList = () => {
  const nav = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axiosClient.get("/owner/stores");
      setStores(res.data.stores || []);
    } catch (err) {
      console.error("Failed to load owner stores", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="stores-root">
      <h2>Your Stores</h2>

      {stores.length === 0 ? (
        <div>No stores assigned to you.</div>
      ) : (
        <div className="stores-list">
          {stores.map((store) => (
            <div
              key={store.id}
              className="store-card"
              onClick={() => nav(`/owner/stores/${store.id}/ratings`)}
              style={{ cursor: "pointer" }}
            >
              <h3 className="store-name">{store.name}</h3>
              <p>{store.address}</p>
              <p>⭐ {store.average_rating} | {store.ratings_count} ratings</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerStoreList;
