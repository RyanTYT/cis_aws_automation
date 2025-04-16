"use client";
import { useEffect, useState } from "react";
import CustomSidebar from "@/components/CustomSidebar";
import "./aws-assets.css";

export default function AWSAssetsPage() {
  const [assets, setAssets] = useState({
    "": [],
    // "AWS Config Rules": [],
    // "CloudTrail Trails": [],
    // "CloudWatch Alarms": [],
    // "EC2 Instances": [],
    // "IAM Access Analyzers": [],
    // "IAM Roles": [
    //   "AWSServiceRoleForAPIGateway",
    //   "AWSServiceRoleForOrganizations",
    //   "AWSServiceRoleForRDS",
    //   "AWSServiceRoleForSSO",
    //   "AWSServiceRoleForSupport",
    //   "AWSServiceRoleForTrustedAdvisor",
    //   "rds-monitoring-role",
    // ],
    // "IAM Users": ["admin-user", "cli-user", "test-user"],
    // "RDS Instances": ["database-1"],
    // "S3 Buckets": ["testbucketsiol"],
    // "SNS Topics": [],
    // VPCs: ["vpc-0f8144ea4375c89ad"],
  });
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
    <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
      <CustomSidebar backgroundColor="#273142" dashboard={false} />
      <div className="aws-assets-container">
        <h1 className="page-title">AWS Assets</h1>

        {loading && <p className="loading-message">Loading AWS assets...</p>}
        {error && <p className="error-message">Error: {error}</p>}

        <div className="assets-list" style={{ height: "100vh" }}>
          {assets &&
            Object.entries(assets).map(([category, items]) => (
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
      </div>
    </div>
  );
}
