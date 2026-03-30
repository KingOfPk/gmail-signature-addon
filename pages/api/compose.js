import { withAuth } from "../../lib/auth";
import { getSignatures } from "../../lib/signatures";
import { buildComposeCard, buildErrorCard } from "../../lib/cardBuilder";

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const signatures = await getSignatures();
    if (!signatures || signatures.length === 0)
      return res.status(200).json(buildErrorCard("No signatures found. Please add one first."));
    return res.status(200).json(buildComposeCard(signatures));
  } catch (error) {
    console.error("Compose trigger error:", error);
    return res.status(200).json(buildErrorCard("Failed to load signatures."));
  }
}

export default withAuth(handler);
