export function buildComposeCard(signatures) {
  const buttons = signatures.map((sig) => ({
    textButton: {
      text: sig.isDefault ? `⭐ ${sig.name}` : sig.name,
      onClick: { action: { function: `${process.env.NEXT_PUBLIC_BASE_URL}/api/insert`, parameters: [{ key: "signatureId", value: sig.id }] } },
    },
  }));
  return {
    card: {
      header: { title: "Email Signature Manager", subtitle: "Choose a signature to insert", imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/icon.png`, imageType: "CIRCLE" },
      sections: [{ header: "Your Signatures", widgets: [
        { buttonList: { buttons } },
        { divider: {} },
        { textParagraph: { text: '<font color="#888888">Click any signature to insert it at the bottom of your email.</font>' } },
        { buttonList: { buttons: [{ textButton: { text: "⚙️ Manage Signatures", onClick: { openLink: { url: `${process.env.NEXT_PUBLIC_BASE_URL}`, openAs: "OVERLAY", onClose: "RELOAD_ADD_ON" } } } }] } },
      ]}],
    },
  };
}

export function buildSuccessCard(signatureName) {
  return { renderActions: { action: { notification: { text: `✅ "${signatureName}" signature inserted!` } } } };
}

export function buildErrorCard(message) {
  return { card: { sections: [{ widgets: [{ textParagraph: { text: `<font color="#d93025">❌ Error: ${message}</font>` } }] }] } };
}

export function buildHomepageCard(signatures) {
  return {
    card: {
      header: { title: "Email Signature Manager", subtitle: `${signatures.length} signature(s) configured` },
      sections: [{ header: "Quick Info", widgets: [
        { textParagraph: { text: "Open Gmail Compose to insert your signatures." } },
        { buttonList: { buttons: [{ textButton: { text: "Open Signature Manager", onClick: { openLink: { url: `${process.env.NEXT_PUBLIC_BASE_URL}`, openAs: "FULL_SIZE", onClose: "NOTHING" } } } }] } },
      ]}],
    },
  };
}
