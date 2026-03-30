import { withAuth } from "../../lib/auth";
import { getSignatures } from "../../lib/signatures";
import { buildHomepageCard, buildErrorCard } from "../../lib/cardBuilder";

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const signatures = await getSignatures();
    return res.status(200).json(buildHomepageCard(signatures));
  } catch (error) {
    console.error("Homepage trigger error:", error);
    return res.status(200).json(buildErrorCard("Failed to load add-on."));
  }
}

export default withAuth(handler);
