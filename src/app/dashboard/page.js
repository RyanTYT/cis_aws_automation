"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Expander from "@/components/Expander";
import CustomSidebar from "@/components/CustomSidebar";
import {
  Button,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
const axios = require("axios").default;
import jsonData from "./output.json" assert { type: "json" };
import { toast } from "react-toastify";

// ensure key is reversed
function build_nested_json(test_dict, key, val) {
  if (key.length == 0) {
    for (const [inner_key, inner_val] of Object.entries(val)) {
      test_dict[inner_key] = inner_val;
    }
    return;
  }

  const next_key = key.pop();
  if (!(next_key in test_dict)) {
    test_dict[next_key] = {};
  }
  build_nested_json(test_dict[next_key], key, val);
}

export default function Home() {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [access_key_id, set_access_key_id] = useState(0);
  const [assets, setAssets] = useState([]);
  const [tests, setTests] = useState(<></>);
  const [num_of_tests, set_num_of_tests] = useState(0);

  // Loading state trackers
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isGeneratingScripts, setIsGeneratingScripts] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  useEffect(() => {
    // set_num_of_tests(
    //   Object.keys(jsonData)
    //     .map(
    //       (key) =>
    //         Object.keys(jsonData[key]).filter((key) => key !== "title").length,
    //     )
    //     .reduce((first_sum, second_sum) => first_sum + second_sum),
    // );
    // setTests(
    //   Object.keys(jsonData).map((key) => {
    //     jsonData[key].title = key;
    //     return <Expander key={key} tests={jsonData[key]} depth={0} />;
    //   }),
    // );
    axios.get(`${NEXT_PUBLIC_BASE_URL}/get-aws-credentials`).then((res) => {
      set_access_key_id(res.data.access_key_id);
    });
  }, []);

  const run_all_tests = async () => {
    try {
      // Start loading assets
      setIsLoadingAssets(true);
      const assetsResponse = await axios.get(
        `${NEXT_PUBLIC_BASE_URL}/get-aws-assets`,
      );
      const assets_res = assetsResponse.data;
      setAssets(assets_res);
      setIsLoadingAssets(false);

      const asset_maps = {
        "IAM Users": "AWS Identity and Access Management (IAM)",
        "IAM Roles": "AWS Identity and Access Management (IAM)",
        "IAM Access Analyzers": "IAM Access Analyzer",
        "AWS Config Rules": "AWS Config",
        "CloudTrail Trails": "AWS CloudTrail",
        "CloudWatch Alarms": "AWS CloudWatch",
        "SNS Topics": "AWS Simple Notification Service (SNS)",
        "S3 Buckets": "AWS Simple Storage Service (S3)",
        "EC2 Instances": "Elastic Compute Cloud (EC2)",
        "RDS Instances": "Relational Database Service (RDS)",
        VPCs: "AWS VPC",
      };

      // Start loading docs
      setIsLoadingDocs(true);
      const relevantAssets = Object.keys(assets_res)
        .filter((asset) => asset === "IAM Users")
        .map((asset) => asset_maps[asset]);

      // Fetch docs sequentially with loading state
      for (const asset of relevantAssets) {
        await axios.get(`${NEXT_PUBLIC_BASE_URL}/get-relevant-doc/${asset}`);
      }
      setIsLoadingDocs(false);

      // Start generating scripts
      setIsGeneratingScripts(true);
      for (const asset of relevantAssets) {
        await axios.get(
          `${NEXT_PUBLIC_BASE_URL}/generate-bash-scripts/${asset}`,
          {
            timeout: 360000, // 6 minutes
          },
        );
      }
      setIsGeneratingScripts(false);

      // Load final results
      setIsLoadingResults(true);
      const testResultsResponse = await axios.get(
        `${NEXT_PUBLIC_BASE_URL}/final-data/`,
        {
          timeout: 360000, // 6 minutes
        },
      );
      const test_results = testResultsResponse.data;
      setIsLoadingResults(false);

      // Update UI with results
      set_num_of_tests(
        Object.keys(test_results)
          .map((key) => Object.keys(test_results[key]).length)
          .reduce((first_sum, second_sum) => first_sum + second_sum),
      );
      setTests(
        Object.keys(test_results).map((key) => {
          test_results[key].title = key;
          return <Expander key={key} tests={test_results[key]} depth={0} />;
        }),
      );
    } catch (e) {
      // Reset all loading states on error
      setIsLoadingAssets(false);
      setIsLoadingDocs(false);
      setIsGeneratingScripts(false);
      setIsLoadingResults(false);
      toast.error(`Failed to run tests:\n${e}`);
    }
  };

  return (
    <div className={styles.full_page}>
      <CustomSidebar accessKeyId={access_key_id} dashboard={true} />
      <div className={styles.table_container}>
        <div className={styles.table_header}>
          <header>
            <div className={styles.table_header_primary}>Tests</div>
            <div className={styles.table_header_count}>
              | {num_of_tests} tests
            </div>
          </header>
          <header>
            <Button
              variant="outlined"
              onClick={run_all_tests}
              disabled={
                isLoadingAssets ||
                isLoadingDocs ||
                isGeneratingScripts ||
                isLoadingResults
              }
              sx={{
                color: "#E0E6F0",
                borderColor: "#E0E6F0",
                "&.Mui-disabled": {
                  color: "rgba(224, 230, 240, 0.5)",
                  borderColor: "rgba(224, 230, 240, 0.5)",
                },
              }}
            >
              {isLoadingAssets ||
              isLoadingDocs ||
              isGeneratingScripts ||
              isLoadingResults ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <CircularProgress size={20} sx={{ color: "#E0E6F0" }} />
                  {isLoadingAssets && "Getting assets..."}
                  {!isLoadingAssets && isLoadingDocs && "Loading docs..."}
                  {!isLoadingAssets &&
                    !isLoadingDocs &&
                    isGeneratingScripts &&
                    "Generating scripts..."}
                  {!isLoadingAssets &&
                    !isLoadingDocs &&
                    !isGeneratingScripts &&
                    isLoadingResults &&
                    "Processing results..."}
                </div>
              ) : (
                "RUN"
              )}
            </Button>
          </header>
        </div>

        <TableContainer
          component={Paper}
          sx={{
            background: "#3A475E",
            color: "#E0E6F0",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#E0E6F0", fontSize: "1.5rem" }}>
                  Benchmark Test
                </TableCell>
                <TableCell
                  sx={{
                    color: "#E0E6F0",
                    width: "20rem",
                    textAlign: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoadingResults ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{ color: "#E0E6F0" }}
                  >
                    <CircularProgress sx={{ color: "#E0E6F0", my: 3 }} />
                    <div>Processing test results...</div>
                  </TableCell>
                </TableRow>
              ) : (
                tests
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
