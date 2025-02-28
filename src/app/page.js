"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

export default function Home() {
  const table_row = (
    test,
    last_run,
    tests_passed,
    tests_failed,
    tests_skipped,
  ) => {
    return (
      <>
        <td>
          <p>{test}</p>
        </td>
        <td>
          <p>{last_run}</p>
        </td>
        <td>
          <p>{tests_passed}</p>
        </td>
        <td>
          <p>{tests_failed}</p>
        </td>
        <td>
          <p>{tests_skipped}</p>
        </td>
      </>
    );
  };

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api").then(async (res) => {
      setLogs(await res.json());
    });
  }, []);

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

  const num_of_tests = 100;

  return (
    <div>
      <div className={styles.table_header}>
        <header>
          <div className={styles.table_header_primary}>Tests</div>
          <div className={styles.table_header_count}>| {num_of_tests} tests</div>
        </header>
      </div>

      <table className={styles.projects_table}>
        <thead>
          <tr>
            <th>Benchmark Test</th>
            <th>Last Test Ran</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.name}>
              <td>
                <p>{log.name}</p>
              </td>
              <td>
                <p>{log.last_run.substr(0, 10)}</p>
              </td>
              <td>
                <PieChart width={100} height={100}>
                  <Pie
                    data={[
                      {
                        name: "Tests Passed",
                        value: log.tests_passed.length,
                        color: "#4AD673",
                      }, // Green
                      {
                        name: "Tests Failed",
                        value: log.tests_failed.length,
                        color: "#D65B4A",
                      }, // Red
                      {
                        name: "Tests Skipped",
                        value: log.tests_skipped.length,
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
              <td>Actions</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
