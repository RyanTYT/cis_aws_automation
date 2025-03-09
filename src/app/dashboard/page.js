"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Expander from "@/components/Expander";
import LogoutButton from "@/components/LogoutButton";
import CustomSidebar from "@/components/CustomSidebar";

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
  const [logs, setLogsRaw] = useState([]);
  const [tests, setTests] = useState(<></>);
  const setLogs = (logs) => {
    setLogsRaw(logs);
    setTests(
      Object.keys(logs).map((key) => (
        <Expander key={key} tests={logs[key]} depth={0} />
      )),
    );
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

  const accessKeyId = "12";

  return (
    <div className={styles.full_page}>
      <CustomSidebar accessKeyId={accessKeyId}/>
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
    </div>
  );
}
