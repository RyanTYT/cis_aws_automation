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

  let row = <></>;

  if (Object.keys(tests).includes("benchmark-0")) {
    const test_statuses = Object.keys(tests)
      .filter((key) => key.includes("benchmark"))
      .map((test) => tests[test].result.status);
    console.log(test_statuses);
    row = (
      <tr
        className={styles.normal_row}
        style={{ display: initial_display ? "" : "none" }}
        key={tests.title}
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
          <p style={{ paddingLeft: "20px" }}>{tests.title}</p>
        </td>
        {
          // <td>
          // {
          //<p>{tests.last_run.substr(0, 10)}</p>
          // }
          // </td>
        }
        <td>
          <PieChart width={100} height={100}>
            <Pie
              data={[
                {
                  name: "Tests Passed",
                  value: test_statuses.filter(
                    (test_status) => test_status === "success",
                  ).length,
                  color: "#4AD673",
                }, // Green
                {
                  name: "Tests Failed",
                  value: test_statuses.filter(
                    (test_status) => test_status === "fail",
                  ).length,
                  color: "#D65B4A",
                }, // Red
                {
                  name: "Tests Skipped",
                  value: test_statuses.filter(
                    (test_status) => test_status === "manual",
                  ).length,
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
  } else {
    row = (
      <tr
        className={styles.normal_row}
        style={{ display: initial_display ? "" : "none" }}
        key={tests.title}
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
          <p style={{ paddingLeft: "20px" }}>{tests.title}</p>
        </td>
        <td></td>
        {
          // <td>
          // {
          //<p>{tests.last_run.substr(0, 10)}</p>
          // }
          // </td>
        }
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
    // const Result = (
    //   <>
    //     {tests.audit
    //       .split("\n")
    //       .filter((line) => !/^[0-9]+\sPage/.test(line))
    //       .map((line, ind) => (
    //         <>
    //           <span key={ind} style={{ color: `${ind > 2 ? "red" : "green"}` }}>
    //             {line}
    //           </span>
    //           <br />
    //         </>
    //       ))}
    //   </>
    // );
    row = (
      <>
        {row}
        <tr style={{ display: isExpanded ? "" : "none" }}>
          <td
            colSpan={2}
            valign="top"
            style={{
              paddingLeft: `${50 * depth + 20}px`,
              backgroundColor: "#313d4f",
              backgroundClip: "padding-box",
              borderRadius: "20px",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",

              boxShadow: `inset ${50 * depth}px 0 0 0 #273142`,
              whiteSpace: "pre-wrap",
            }}
          >
            {`Audit Steps:\n\n`}
            {tests.text}
          </td>
          <td
            valign="top"
            colSpan={1}
            style={{
              backgroundColor: "#313d4f",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
              whiteSpace: "pre-wrap",
            }}
          >
            {`Errors:\n\n`}
            {tests.result.status}
            {tests.result.error}
          </td>
        </tr>
      </>
    );
  }

  const children = Object.keys(tests)
    .filter(
      (key) =>
        ![
          // "id",
          // "name",
          // "audit",
          // "remediation",
          // "last_run",
          // "tests_passed",
          // "tests_failed",
          // "tests_skipped",
          "result",
          "script",
          "text",
          "title",
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
