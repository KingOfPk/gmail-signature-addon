import { getSignatureById, updateSignature, deleteSignature, setDefaultSignature } from "../../../lib/signatures";

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      const signature = await getSignatureById(id);
      if (!signature) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ signature });
    } catch { return res.status(500).json({ error: "Failed to fetch signature" }); }
  }
  if (req.method === "PUT") {
    try {
      const updated = await updateSignature(id, req.body);
      return res.status(200).json({ signature: updated });
    } catch (error) { return res.status(500).json({ error: error.message }); }
  }
  if (req.method === "DELETE") {
    try {
      await deleteSignature(id);
      return res.status(200).json({ message: "Deleted successfully" });
    } catch { return res.status(500).json({ error: "Failed to delete" }); }
  }
  if (req.method === "PATCH") {
    try {
      await setDefaultSignature(id);
      return res.status(200).json({ message: "Set as default" });
    } catch { return res.status(500).json({ error: "Failed to set default" }); }
  }
  return res.status(405).json({ error: "Method not allowed" });
}
