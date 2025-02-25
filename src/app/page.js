"use client";
import { useEffect, useState } from "react";

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

  return (
    <table className="projects-table">
      <thead>
        <tr>
          <th>Benchmark Test</th>
          <th>Last Test Ran</th>
          <th>Tests Passed</th>
          <th>Tests Failed</th>
          <th>Tests Skipped</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>
      {logs.map((log) => (
        <tr>
          <td>
            <p>{log.name}</p>
          </td>
          <td>
            <p>{log.last_run}</p>
          </td>
          <td>
            <p>{log.tests_passed}</p>
          </td>
          <td>
            <p>{log.tests_failed}</p>
          </td>
          <td>
            <p>{log.tests_skipped}</p>
          </td>
        </tr>
      ))}
    </table>
  );
}
