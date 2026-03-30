import { getSignatures, addSignature } from "../../../lib/signatures";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const signatures = await getSignatures();
      return res.status(200).json({ signatures });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch signatures" });
    }
  }
  if (req.method === "POST") {
    try {
      const { name, html, isDefault } = req.body;
      if (!name || !html) return res.status(400).json({ error: "name and html are required" });
      const newSignature = await addSignature({ name, html, isDefault: isDefault || false });
      return res.status(201).json({ signature: newSignature });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create signature" });
    }
  }
  return res.status(405).json({ error: "Method not allowed" });
}
