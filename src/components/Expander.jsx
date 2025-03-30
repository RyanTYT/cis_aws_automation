"use client";

import { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  Button,
} from "@mui/material";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { toast } from "react-toastify";
const axios = require("axios").default;

export default function Expander({ tests, depth = 0, initial_display = true }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={2}
          sx={{
            p: 1,
            bgcolor: "#ededed",
            border: "1px solid #ccc",
            color: "#273142",
            whiteSpace: "nowrap",
          }}
        >
          <Typography variant="body2">{`${payload[0].name} : ${payload[0].value}`}</Typography>
        </Paper>
      );
    }
    return null;
  };

  const isBenchmark = Object.keys(tests).includes("benchmark-0");

  // Function to determine if this item has child elements
  const hasChildren = Object.keys(tests).some(
    (key) => !["result", "script", "text", "title"].includes(key),
  );

  // Render benchmark test row with pie chart
  if (isBenchmark) {
    const test_statuses = Object.keys(tests)
      .filter((key) => key.includes("benchmark"))
      .map((test) => tests[test].result.status);

    const chartData = [
      {
        name: "Tests Passed",
        value: test_statuses.filter((status) => status === "success").length,
        color: "#4AD673",
      },
      {
        name: "Tests Failed",
        value: test_statuses.filter((status) => status === "fail").length,
        color: "#D65B4A",
      },
      {
        name: "Tests Skipped",
        value: test_statuses.filter((status) => status === "manual").length,
        color: "#B0B0B0",
      },
    ];

    return (
      <>
        <TableRow
          sx={{
            display: initial_display ? "table-row" : "none",
            background: "#3A475E",
            "&:hover": { bgcolor: "#3e4a5c" },
            cursor: "pointer",
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <TableCell
            sx={{
              pl: `${depth * 4}px`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {hasChildren && (
                <IconButton size="small" sx={{ color: "white", mr: 1 }}>
                  {isExpanded ? (
                    <KeyboardArrowDownIcon />
                  ) : (
                    <KeyboardArrowRightIcon />
                  )}
                </IconButton>
              )}
              <Typography sx={{ color: "white", ml: 2, fontSize: "1.5rem" }}>
                {tests.title.replaceAll("_", " ")}
              </Typography>
            </Box>
          </TableCell>

          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            <Box sx={{ display: "inline-block" }}>
              <PieChart width={100} height={100}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  stroke="none"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={50}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={10}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </Box>
          </TableCell>
        </TableRow>

        {hasChildren && (
          <TableRow>
            <TableCell sx={{ p: 0, border: 0 }} colSpan={2}>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box>
                  <Table>
                    {Object.keys(tests)
                      .filter(
                        (key) =>
                          !["result", "script", "text", "title"].includes(key),
                      )
                      .map((key) => (
                        <Expander
                          key={key}
                          tests={tests[key]}
                          depth={depth + 1}
                          initial_display={true}
                        />
                      ))}
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  }
  // Render regular test row with pass/fail indicator
  else {
    const formattedTitle = tests.title
      .replaceAll("_", " ")
      .replace(/\.md$/, "");

    const rerun_test = () =>
      axios
        .post("", {
          script: tests.script,
        })
        .then((resp) => {
          tests.result = resp.data;
        })
        .catch(() => {
          toast.error("Failed to re-run test");
        });

    return (
      <TableBody>
        <TableRow
          sx={{
            display: initial_display ? "table-row" : "none",
            background: "#3A475E",
            "&:hover": { bgcolor: "#3e4a5c" },
            cursor: "pointer",
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <TableCell
            sx={{
              pl: `${depth * 4}px`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton size="small" sx={{ color: "white", mr: 1 }}>
                {isExpanded ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </IconButton>
              <Typography sx={{ color: "white", ml: 2, fontSize: "1.25rem" }}>
                {formattedTitle}
              </Typography>
            </Box>
          </TableCell>

          <TableCell
            sx={{
              borderRadius: "0 20px 20px 0",
              textAlign: "center",
              width: "20rem",
              // display: "flex",
              // flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "inline-block",
                borderRadius: "100%",
                bgcolor:
                  tests.result.status === "success" ? "#4AD673" : "#D65B4A",
                width: "1rem",
                height: "1rem",
              }}
            />
            {tests.result.status === "success" ? (
              <></>
            ) : (
              <Box marginTop={1}>
                <Button
                  variant="outlined"
                  onClick={rerun_test}
                  sx={{
                    color: "#D65B4A",
                    borderColor: "#D65B4A",
                  }}
                >
                  Re-run
                </Button>
              </Box>
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell sx={{ p: 0, border: 0 }} colSpan={2}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      flex: 1,
                      pl: `${depth * 4 + 20}px`,
                      whiteSpace: "pre-wrap",
                      p: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "white", mb: 2 }}
                    >
                      Audit Steps:
                    </Typography>
                    <Typography sx={{ color: "white", whiteSpace: "pre-wrap" }}>
                      {tests.text}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      whiteSpace: "pre-wrap",
                      p: 2,
                      width: "20rem",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "white", mb: 2 }}
                    >
                      Error Output:
                    </Typography>
                    <Typography sx={{ color: "white", whiteSpace: "pre-wrap" }}>
                      {tests.result.error
                        ? tests.result.error
                        : "Sorry, no meaningful error log produced!"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>

        {hasChildren && (
          <TableRow>
            <TableCell sx={{ p: 0, border: 0 }} colSpan={2}>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box>
                  {Object.keys(tests)
                    .filter(
                      (key) =>
                        !["result", "script", "text", "title"].includes(key),
                    )
                    .map((key) => (
                      <Expander
                        key={key}
                        tests={tests[key]}
                        depth={depth + 1}
                        initial_display={true}
                      />
                    ))}
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  }
}
