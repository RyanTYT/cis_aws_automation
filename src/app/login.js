"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKeyId, secretAccessKey, region }),
        credentials: "include"
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Login failed:", errorText);
        setError(errorText || "Login failed");
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        setError("Invalid server response");
        return;
      }

      console.log("Login successful:", data);
      router.replace("/");

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong, please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Enter AWS Credentials</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input type="text" placeholder="Access Key ID" value={accessKeyId} onChange={(e) => setAccessKeyId(e.target.value)} required className="p-2 border rounded" />
        <input type="password" placeholder="Secret Access Key" value={secretAccessKey} onChange={(e) => setSecretAccessKey(e.target.value)} required className="p-2 border rounded" />
        <input type="text" placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} required className="p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
