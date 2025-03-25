"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import styles from "./LoginForm.module.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export default function LoginForm() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const BASE_URL = process.env.BASE_URL;
  useEffect(() => {
    fetch(`${BASE_URL}/get-aws-credentials/`)
      .then((res) => {
        if (res.ok) router.push("/dashboard");
        return Promise.reject(res);
      })
      // .then((data) => {
      //   if (data.access_key_id) {
      //     setIsAuthenticated(true);
      //     setAccessKeyId(data.access_key_id);
      //   } else {
      //     setIsAuthenticated(false);
      //   }
      // })
      .catch((error) => {
        toast.error(`Auth check error: ${error}`);
        setIsAuthenticated(false);
      });
  }, []);

  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/store-aws-credentials/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key_id: accessKeyId,
          secret_access_key: secretAccessKey,
          default_region: region,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.detail || "Login failed");
      }
    } catch (err) {
      toast.error(`Login error: ${err}`);
    }
  };

  return isAuthenticated === null ? (
    <>
      <p className="text-center text-gray-500">Checking authentication...</p>
      <PulseLoader
        color="#1e1e2f"
        loading={isAuthenticated}
        size={150}
        aria-label="Checking Authentication..."
      />
    </>
  ) : (
    <>
      <div className={styles.login_container}>
        <img
          src="/logo.png"
          alt="Vantage Point Security Logo"
          className={styles.logo}
        />
        <div className={styles.login_box}>
          <h2 className={styles.login_title}>Enter AWS Credentials</h2>
          <form onSubmit={handleLogin} className={styles.login_form}>
            <TextField
              id="standard-helperText"
              label="Access Key ID"
              defaultValue=""
              // helperText="Access Key ID"
              InputLabelProps={{ sx: { color: "var(--foreground)" } }}
              onChange={(e) => setAccessKeyId(e.target.value)}
              variant="standard"
            />
            <TextField
              id="standard-helperText"
              label="Secret Access Key"
              defaultValue=""
              onChange={(e) => setSecretAccessKey(e.target.value)}
              InputLabelProps={{ sx: { color: "var(--foreground)" } }}
              type="password"
              variant="standard"
            />
            <TextField
              id="standard-helperText"
              label="Region"
              defaultValue=""
              onChange={(e) => setRegion(e.target.value)}
              InputLabelProps={{ sx: { color: "var(--foreground)" } }}
              variant="standard"
            />
            <Button variant="text" type="submit">
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
