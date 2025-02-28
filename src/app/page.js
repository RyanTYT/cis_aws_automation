"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
// import build from "next/dist/build";

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

  function create_elem(inner_log_dict, depth = 0) {
    if (inner_log_dict == undefined) return <></>;

    const elem = [];
    if (Object.keys(inner_log_dict).includes("name")) {
      elem.push(
        <tr className={styles.normal_row} key={inner_log_dict.name}>
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
            <p style={{ paddingLeft: "20px" }}>{inner_log_dict.name}</p>
          </td>
          <td>
            <p>{inner_log_dict.last_run.substr(0, 10)}</p>
          </td>
          <td>
            <PieChart width={100} height={100}>
              <Pie
                data={[
                  {
                    name: "Tests Passed",
                    value: inner_log_dict.tests_passed.length,
                    color: "#4AD673",
                  }, // Green
                  {
                    name: "Tests Failed",
                    value: inner_log_dict.tests_failed.length,
                    color: "#D65B4A",
                  }, // Red
                  {
                    name: "Tests Skipped",
                    value: inner_log_dict.tests_skipped.length,
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
        </tr>,
      );
    }
    const keys = Object.keys(inner_log_dict);
    // console.log(keys);

    keys
      .filter(
        (key) =>
          ![
            "id",
            "last_run",
            "name",
            "tests_passed",
            "tests_failed",
            "tests_skipped",
          ].includes(key),
      )
      .forEach((key) => {
        elem.push(...create_elem(inner_log_dict[key], depth + 1));
      });

    return elem;
  }

  const [logs, setLogsRaw] = useState([]);
  const [tests, setTests] = useState(<></>);
  const setLogs = (logs) => {
    setLogsRaw(logs);
    setTests(create_elem(logs));
  };

  useEffect(() => {
    fetch("/api").then(async (res) => {
      const log_dict = {};
      (await res.json()).forEach((log) =>
        build_nested_json(log_dict, log.id.split(".").reverse(), log),
      );
      setLogs(log_dict);
    });
  }, []);

  const num_of_tests = 100;

  return (
    <div className={styles.table_container}>
      <div className={styles.table_header}>
        <header>
          <div className={styles.table_header_primary}>Tests</div>
          <div className={styles.table_header_count}>
            | {num_of_tests} tests
          </div>
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
        <tbody>{tests}</tbody>
      </table>
    </div>
  );
}
