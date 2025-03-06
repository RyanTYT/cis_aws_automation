"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8099/store-aws-credentials/", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key_id: "",
          secret_access_key: "",
          default_region: "",
        }),
      });

      if (res.ok) {
        router.replace("/?page=login");
        window.location.reload()
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return <button onClick={handleLogout} className="ml-auto bg-red-500 px-4 py-2 rounded">Logout</button>;
}
