import { getIronSession } from "iron-session";
import { sessionOptions } from "../../../lib/session";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  return Response.json({ 
    authenticated: !!session.awsCredentials,
    accessKeyId: session.awsCredentials?.accessKeyId || null
  });
}