"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

export default function CustomSidebar({ accessKeyId }) {
  const router = useRouter();

  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await fetch(`${BASE_URL}/get-aws-credentials/`);
        if (res.ok) {
          const data = await res.json();
          setSecretAccessKey(data.secret_access_key);
          setRegion(data.default_region);
        }
      } catch (err) {
        toast.error("Failed to load AWS credentials");
      }
    };

    fetchCredentials();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/store-aws-credentials/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key_id: "",
          secret_access_key: "",
          default_region: "",
        }),
      });

      if (res.ok) {
        sessionStorage.setItem("accessKeyId", null);
        sessionStorage.setItem("secretAccessKey", null);
        sessionStorage.setItem("region", null);
        router.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (err) {
      toast.error("Logout error:", err);
    }
  };


  const handleGenerateReport = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/generate-report/${accessKeyId}/${secretAccessKey}/${region}`
      );
      if (!res.ok) throw new Error("Failed to generate report");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "aws_cis_report.pdf";
      a.click();
      toast.success("Report downloaded!");
    } catch (err) {
      toast.error(err.message || "Error generating report");
    }
  };

  return (
    <Sidebar backgroundColor="#273142">
      <Menu
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            return {
              "&:hover": {
                color: "#273142",
                backgroundColor: "var(--foreground)",
              },
              color: active ? "#273142" : "var(--foreground)",
              backgroundColor: active ? "var(--foreground)" : "#273142",
            };
          },
        }}
      >
        <SubMenu label="Profiles">
          <MenuItem>
            {" "}
            Tests Dashboard: <br />
            <p style={{ fontSize: "0.8rem", fontWeight: "700" }}>
              Access Key ID: {accessKeyId}{" "}
            </p>
          </MenuItem>
          {
            // <MenuItem> Remedies </MenuItem>
          }
        </SubMenu>
        <MenuItem onClick={handleGenerateReport}> Generate Report </MenuItem>
        <MenuItem onClick={handleLogout}> Logout </MenuItem>
      </Menu>
    </Sidebar>
  );
}
