"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import "./LoginForm.css";

export default function LoginForm() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8099/get-aws-credentials/")
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(res);
      })
      .then((data) => {
        if (data.access_key_id) {
          setIsAuthenticated(true);
          setAccessKeyId(data.access_key_id);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        toast.error(`Auth check error: ${error}`);
        setIsAuthenticated(false);
      });
  }, []);

  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8099/store-aws-credentials/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key_id: accessKeyId,
          secret_access_key: secretAccessKey,
          default_region: region,
        }),
      });

      if (res.ok) {
        // console.log("Login successful");
        // router.replace("/");
        // window.location.reload();
        sessionStorage.setItem("accessKeyId", accessKeyId);
        sessionStorage.setItem("secretAccessKey", secretAccessKey);
        sessionStorage.setItem("region", region);
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
      <div className="login-container">
        <img
          src="/logo.png"
          alt="Vantage Point Security Logo"
          className="logo"
        />
        <div className="login-box">
          <h2 className="login-title">Enter AWS Credentials</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Access Key ID"
              value={accessKeyId}
              onChange={(e) => setAccessKeyId(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Secret Access Key"
              value={secretAccessKey}
              onChange={(e) => setSecretAccessKey(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}
