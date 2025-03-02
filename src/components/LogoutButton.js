"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST", credentials: "include" });

      if (res.ok) {
        router.replace("/?page=login"); // 👈 Redirect to login page after logout
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return <button onClick={handleLogout} className="ml-auto bg-red-500 px-4 py-2 rounded">Logout</button>;
}
