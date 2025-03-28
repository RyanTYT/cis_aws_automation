"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Expander from "@/components/Expander";
import CustomSidebar from "@/components/CustomSidebar";
import { Button } from "@mui/material";
const axios = require("axios").default;
import jsonData from "./output.json" assert { type: "json" };

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
  const BASE_URL = process.env.BASE_URL;
  const [assets, setAssets] = useState([]);
  // const [logs, setLogsRaw] = useState([]);
  const [tests, setTests] = useState(<></>);
  // const setLogs = (logs) => {
  //   // setLogsRaw(logs);
  //   setTests(
  //     Object.keys(logs).map((key) => (
  //       <Expander key={key} tests={logs[key]} depth={0} />
  //     )),
  //   );
  // };
  // const setTests = (tests) => {
  //   setTestsRaw();
  // };
  //
  useEffect(() => {
    setTests(
      Object.keys(jsonData).map((key) => {
        jsonData[key].title = key;
        return <Expander key={key} tests={jsonData[key]} depth={0} />;
      }),
    );
  }, []);

  const run_all_tests = async () => {
    await axios.get(`${BASE_URL}/get-aws-assets`).then(async (res) => {
      const assets_res = await res.data();
      setAssets(assets_res);

      const assets_tests = {};
      assets_res
        .map(async (asset) => {
          await axios.get(`${BASE_URL}/get-relevant-doc/${asset}`);
          return asset;
        })
        .map(async (asset) => {
          await axios.get(`${BASE_URL}/generate-bash-scripts/${asset}`);
        });

      const test_results = (await axios.get(`${BASE_URL}/final-data/`)).json();
      setTests(
        Object.keys(test_results).map((key) => {
          test_results[key].title = key;
          return <Expander key={key} tests={test_results[key]} depth={0} />;
        }),
      );
    });
    // fetch("/api").then(async (res) => {
    //   const log_dict = {};
    //   (await res.json()).forEach((log) =>
    //     build_nested_json(log_dict, log.id.split(".").reverse(), log),
    //   );
    //   setLogs(log_dict);
    // });
  };

  const num_of_tests = 100;

  const [access_key_id, set_access_key_id] = useState(0);
  // axios
  //   .get(`${BASE_URL}/get_aws_credentials`)
  //   .then((res) => set_access_key_id(res.data().access_key_id));

  return (
    <div className={styles.full_page}>
      <CustomSidebar accessKeyId={access_key_id} />
      <div className={styles.table_container}>
        <div className={styles.table_header}>
          <header>
            <div className={styles.table_header_primary}>Tests</div>
            <div className={styles.table_header_count}>
              | {num_of_tests} tests
            </div>
          </header>
          <header>
            <Button variant="outlined" onClick={run_all_tests}>
              Run
            </Button>
          </header>
        </div>

        <table className={styles.projects_table}>
          <thead>
            <tr>
              <th>Benchmark Test</th>
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
