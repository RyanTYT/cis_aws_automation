import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "../../../lib/session";

export async function POST(req) {
  try {
    const { accessKeyId, secretAccessKey, region } = await req.json();

    if (!accessKeyId || !secretAccessKey || !region) {
      return new Response(JSON.stringify({ message: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = await getIronSession(cookies(), sessionOptions);
    session.awsCredentials = { accessKeyId, secretAccessKey, region };
    await session.save();

    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Login API error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
