// "use client";
// import { useEffect, useState } from "react";
// import styles from "./page.module.css";
// import { PieChart, Pie, Tooltip, Cell } from "recharts";
// import Expander from "@/app/Expander";
// import LoginForm from "./login";
// import LogoutButton from "@/components/LogoutButton";
//
// // ensure key is reversed
// function build_nested_json(test_dict, key, val) {
//   if (key.length == 0) {
//     for (const [inner_key, inner_val] of Object.entries(val)) {
//       test_dict[inner_key] = inner_val;
//     }
//     return;
//   }
//
//   const next_key = key.pop();
//   if (!(next_key in test_dict)) {
//     test_dict[next_key] = {};
//   }
//   build_nested_json(test_dict[next_key], key, val);
// }
//
// export default function Home() {
//   const [logs, setLogsRaw] = useState([]);
//   const [tests, setTests] = useState(<></>);
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const [accessKeyId, setAccessKeyId] = useState(null);
//   const setLogs = (logs) => {
//     setLogsRaw(logs);
//     setTests(
//       Object.keys(logs).map((key) => (
//         <Expander key={key} tests={logs[key]} depth={0} />
//       )),
//     );
//   };
//
//   const fetchLogs = () => {
//     fetch("/api").then(async (res) => {
//       const log_dict = {};
//       (await res.json()).forEach((log) =>
//         build_nested_json(log_dict, log.id.split(".").reverse(), log),
//       );
//       setLogs(log_dict);
//     });
//   };
//
//   useEffect(() => {
//     fetch("http://localhost:8099/get-aws-credentials/")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.access_key_id) {
//           setIsAuthenticated(true);
//           setAccessKeyId(data.access_key_id);
//           fetchLogs(); // Load logs only if authenticated
//         } else {
//           setIsAuthenticated(false);
//         }
//       })
//       .catch((error) => {
//         console.error("Auth check error:", error);
//         setIsAuthenticated(false);
//       });
//   }, []);
//
//   const num_of_tests = 100;
//
//   if (isAuthenticated === null) {
//     return <p className="text-center text-gray-500">Checking authentication...</p>;
//   }
//
//     return <LoginForm />;
// }
