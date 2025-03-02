import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";

export async function POST() {
  try {
    const session = await getIronSession(cookies(), sessionOptions);
    session.destroy(); // Clear session

    return Response.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json({ message: "Logout failed" }, { status: 500 });
  }
}
