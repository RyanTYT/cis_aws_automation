"use client";

import { useState } from "react";
import styles from "./expander.module.css";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

export default function Expander({ tests, depth, initial_display = true }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#ededed",
            padding: "5px",
            border: "1px solid #ccc",
            color: "#273142",
            whiteSpace: "nowrap",
          }}
        >
          <p>{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  let row = (
    <tr
      className={styles.normal_row}
      style={{ display: initial_display ? "" : "none" }}
      key={tests.name}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <td
        style={{
          paddingLeft: `${50 * depth}px`,
          backgroundColor: "#313d4f",
          backgroundClip: "padding-box",
          borderRadius: "20px",
          borderTopRightRadius: "0",
          borderBottomRightRadius: "0",

          boxShadow: `inset ${50 * depth}px 0 0 0 #273142`,
        }}
      >
        <p style={{ paddingLeft: "20px" }}>{tests.name}</p>
      </td>
      <td>
        <p>{tests.last_run.substr(0, 10)}</p>
      </td>
      <td>
        <PieChart width={100} height={100}>
          <Pie
            data={[
              {
                name: "Tests Passed",
                value: tests.tests_passed.length,
                color: "#4AD673",
              }, // Green
              {
                name: "Tests Failed",
                value: tests.tests_failed.length,
                color: "#D65B4A",
              }, // Red
              {
                name: "Tests Skipped",
                value: tests.tests_skipped.length,
                color: "#B0B0B0",
              }, // Grey
            ]}
            dataKey="value"
            stroke="none"
            cx="50%"
            cy="50%"
            innerRadius={40} // Makes it a donut
            outerRadius={50}
            startAngle={90} // Starts from the top
            endAngle={-270} // Full circle
            paddingAngle={10}
          >
            <Cell fill="#4AD673" />
            <Cell fill="#D65B4A" />
            <Cell fill="#B0B0B0" />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </td>
      <td
        style={{
          borderTopRightRadius: "20px",
          borderBottomRightRadius: "20px",
        }}
      >
        Actions
      </td>
    </tr>
  );
  if (tests.audit) {
    row = (
      <>
        {row}
        <tr style={{ display: isExpanded ? "" : "none" }}>
          <td
            colSpan={2}
            style={{
              paddingLeft: `${50 * depth}px`,
              backgroundColor: "#313d4f",
              backgroundClip: "padding-box",
              borderRadius: "20px",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",

              boxShadow: `inset ${50 * depth}px 0 0 0 #273142`,
            }}
          >
            {tests.audit}
          </td>
          <td colSpan={2}>{tests.remediation}</td>
        </tr>
      </>
    );
  }

  const children = Object.keys(tests)
    .filter(
      (key) =>
        ![
          "id",
          "name",
          "audit",
          "remediation",
          "last_run",
          "tests_passed",
          "tests_failed",
          "tests_skipped",
        ].includes(key),
    )
    .map((key) => {
      return (
        <Expander
          key={key}
          tests={tests[key]}
          depth={depth + 1}
          initial_display={isExpanded}
        />
      );
      // elem.push(...create_elem(inner_log_dict[key], depth + 1));
    });

  if (children) {
    row = (
      <>
        {row}
        {children}
      </>
    );
  }
  return row;
}
