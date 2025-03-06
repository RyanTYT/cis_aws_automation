"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./LoginForm.css"; 

export default function LoginForm() {
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:8099/store-aws-credentials/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          access_key_id: accessKeyId, 
          secret_access_key: secretAccessKey, 
          default_region: region 
        })
      });

      if (res.ok) {
        console.log("Login successful");
        router.replace("/");
        window.location.reload()
      } else {
        const data = await res.json();
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong, please try again.");
    }
  };

  return (
    <div className="login-container">
      <img src="/logo.png" alt="Vantage Point Security Logo" className="logo" /> 
      <div className="login-box">
        <h2 className="login-title">Enter AWS Credentials</h2>
        {error && <p className="error-message">{error}</p>}
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
  );
}
