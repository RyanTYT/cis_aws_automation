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


  const handleGeneratePDF = async () => {
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

  const handleGenerateMarkdown = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/get-stored-data/${accessKeyId}/${secretAccessKey}/${region}`
      );

      if (!res.ok) throw new Error("Failed to fetch stored data");

      const data = await res.json();

      let md = `# AWS CIS Compliance Report\n\n`;
      md += `**Access Key ID:** \`${accessKeyId}\`\n`;
      md += `**Region:** \`${region}\`\n`;
      md += `**Generated:** ${new Date().toLocaleString()}\n\n`;

      Object.entries(data).forEach(([category, benchmarks]) => {
        md += `## ${category.toUpperCase()}\n\n`;

        Object.entries(benchmarks).forEach(([benchmarkId, benchmark]) => {
          const result = benchmark.result || {};
          const title = result.name || benchmark.title || benchmarkId;
          const status = result.status?.toUpperCase() || "UNKNOWN";
          const output = result.output || "";
          const error = result.error || "";

          md += `### ${title}\n`;
          md += `- **Status:** \`${status}\`\n`;
          if (error) md += `- **Error:** \`${error}\`\n`;
          md += `- **Output:**\n\n\`\`\`\n${output}\n\`\`\`\n\n`;
        });
      });

      const blob = new Blob([md], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "aws_cis_report.md";
      a.click();

      toast.success("Markdown report downloaded!");
    } catch (err) {
      toast.error(err.message || "Error generating markdown report");
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
        <SubMenu label="Generate Report">
          <MenuItem onClick={handleGeneratePDF}> Export PDF </MenuItem>
          <MenuItem onClick={handleGenerateMarkdown}> Export Markdown </MenuItem>
        </SubMenu>
        <MenuItem onClick={handleLogout}> Logout </MenuItem>
      </Menu>
    </Sidebar>
  );
}
