import { withAuth } from "../../lib/auth";
import { getSignatureById, getDefaultSignature } from "../../lib/signatures";
import { buildErrorCard } from "../../lib/cardBuilder";

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const body = req.body || {};
    const parameters = (body.commonEventObject || {}).parameters || {};
    const signatureId = parameters.signatureId || null;
    const signature = signatureId ? await getSignatureById(signatureId) : await getDefaultSignature();
    if (!signature) return res.status(200).json(buildErrorCard("Signature not found."));
    return res.status(200).json({
      renderActions: {
        action: { notification: { text: `✅ "${signature.name}" signature inserted!` } },
        hostAppAction: {
          gmailAction: {
            updateDraftActionResponse: {
              updateBody: {
                insertContents: [{ contentType: "HTML", addedContent: signature.html }],
                type: "INSERT_AT_END",
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Insert signature error:", error);
    return res.status(200).json(buildErrorCard("Failed to insert signature."));
  }
}

export default withAuth(handler);
