"use client";
import { useEffect, useState } from "react";

export default function AWSAssetsPage() {
  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8099/get-aws-assets/")
      .then((res) => res.json())
      .then((data) => {
        if (data.detail) {
          throw new Error(data.detail);
        }
        setAssets(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="aws-assets-container">
      <h1 className="page-title">AWS Assets</h1>

      {loading && <p className="loading-message">Loading AWS assets...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {assets && (
        <div className="assets-list">
          {Object.entries(assets).map(([category, items]) => (
            <div key={category} className="asset-category">
              <h2 className="category-title">{category}</h2>
              <ul>
                {items.length > 0 ? (
                  items.map((item, index) => <li key={index}>{item}</li>)
                ) : (
                  <p className="no-assets">No assets found</p>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
