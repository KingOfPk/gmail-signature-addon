import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client();

export async function verifyGoogleToken(req) {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) throw new Error("No authorization token provided");
    const ticket = await client.verifyIdToken({ idToken: token, audience: CLIENT_ID });
    return ticket.getPayload();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    throw new Error("Unauthorized: Invalid token");
  }
}

export function withAuth(handler) {
  return async (req, res) => {
    try {
      if (process.env.NODE_ENV === "development" && process.env.SKIP_AUTH === "true") {
        return handler(req, res);
      }
      await verifyGoogleToken(req);
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}
