import fs from "fs-extra";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "signatures.json");

const DEFAULT_SIGNATURES = [
  {
    id: "sig_1", name: "Professional",
    html: `<div style="font-family:Arial,sans-serif;font-size:13px;color:#333;border-top:2px solid #4285f4;padding-top:10px;margin-top:10px;"><strong style="font-size:15px;">Pawan Sharma</strong><br/><span style="color:#4285f4;">Full Stack Developer</span><br/><span>DigiMonk | pawan.sharma@digimonk.in</span><br/><span style="color:#888;">React JS | React Native | Node JS | Next JS | MongoDB</span></div>`,
    isDefault: true, createdAt: new Date().toISOString(),
  },
  {
    id: "sig_2", name: "Minimal",
    html: `<div style="font-family:Arial,sans-serif;font-size:12px;color:#555;margin-top:10px;">-- <br/><strong>Pawan Sharma</strong> | DigiMonk<br/><a href="mailto:pawan.sharma@digimonk.in" style="color:#4285f4;">pawan.sharma@digimonk.in</a></div>`,
    isDefault: false, createdAt: new Date().toISOString(),
  },
];

async function saveSignatures(sigs) { await fs.ensureFile(DATA_FILE); await fs.writeFile(DATA_FILE, JSON.stringify(sigs, null, 2)); }

export async function getSignatures() {
  try {
    await fs.ensureFile(DATA_FILE);
    const content = await fs.readFile(DATA_FILE, "utf-8");
    if (!content.trim()) { await saveSignatures(DEFAULT_SIGNATURES); return DEFAULT_SIGNATURES; }
    return JSON.parse(content);
  } catch { await saveSignatures(DEFAULT_SIGNATURES); return DEFAULT_SIGNATURES; }
}

export async function getDefaultSignature() { const s = await getSignatures(); return s.find(x=>x.isDefault)||s[0]||null; }
export async function getSignatureById(id) { const s = await getSignatures(); return s.find(x=>x.id===id)||null; }
export async function addSignature(sig) { const s=await getSignatures(); const n={id:`sig_${Date.now()}`,...sig,createdAt:new Date().toISOString()}; s.push(n); await saveSignatures(s); return n; }
export async function updateSignature(id,updates) { const s=await getSignatures(); const i=s.findIndex(x=>x.id===id); if(i===-1)throw new Error("Not found"); s[i]={...s[i],...updates}; await saveSignatures(s); return s[i]; }
export async function deleteSignature(id) { const s=await getSignatures(); await saveSignatures(s.filter(x=>x.id!==id)); }
export async function setDefaultSignature(id) { const s=await getSignatures(); await saveSignatures(s.map(x=>({...x,isDefault:x.id===id}))); }
