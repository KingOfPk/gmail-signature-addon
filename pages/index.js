/**
 * Signature Management Dashboard
 * - View all signatures
 * - Create new signatures (with HTML editor)
 * - Set default signature
 * - Delete signatures
 * - Preview signatures
 */

import { useState, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSig, setEditingSig] = useState(null);
  const [previewSig, setPreviewSig] = useState(null);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    name: "",
    html: "",
    isDefault: false,
  });

  const fetchSignatures = async () => {
    try {
      const res = await fetch("/api/signatures");
      const data = await res.json();
      setSignatures(data.signatures || []);
    } catch (err) {
      showNotification("Failed to load signatures", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSignatures(); }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.html.trim()) {
      showNotification("Name and HTML content are required", "error");
      return;
    }
    try {
      const url = editingSig ? `/api/signatures/${editingSig.id}` : "/api/signatures";
      const method = editingSig ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Request failed");
      showNotification(editingSig ? "Signature updated!" : "Signature created!");
      setShowForm(false); setEditingSig(null); setForm({ name: "", html: "", isDefault: false });
      fetchSignatures();
    } catch (err) { showNotification("Failed to save signature", "error"); 
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this signature?")) return;
    try { await fetch(`/api/signatures/${id}`, { method: "DELETE" }); showNotification("Signature deleted"); fetchSignatures(); }
    catch { showNotification("Failed to delete", "error"); }
  };

  const handleSetDefault = async (id) => {
    try { await fetch(`/api/signatures/${id}`, { method: "PATCH" }); showNotification("Default signature updated!"); fetchSignatures(); }
    catch { showNotification("Failed to update", "error"); }
  };

  const handleEdit = (sig) => { setEditingSig(sig); setForm({ name: sig.name, html: sig.html, isDefault: sig.isDefault }); setShowForm(true); };

  const loadTemplate = (type) => {
    const templates = {
      professional: '<div style="font-family:Arial;font-size:13px;color:#333;border-top:2px solid #4285f4;padding-top:10px;margin-top:10px"><strong>Your Name</strong><br/><span style="color:#4285f4">Your Job Title</span><br/><span>Company | your@email.com</span></div>',
      minimal: '<div style="font-family:Arial;font-size:12px;color:#555;margin-top:10px">-- <br/><strong>Your Name</strong> | Company<br/><a href="mailto:your@email.com" style="color:#4285f4">your@email.com</a></div>',
      withImage: '<div style="font-family:Arial;font-size:13px;margin-top:10px"><table><tr><td style="padding-right:15px"><img src="https://your-domain.com/photo.jpg" width="80" height="80" style="border-radius:50%" /></td><td><strong>Your Name</strong><br/>Your Job Title<br/><a href="mailto:your@email.com">your@email.com</a></td></tr></table></div>',
    };
    setForm((f) => ({ ...f, html: templates[type] || "" }));
  };

  return (
    <>
      <Head><title>Gmail Signature Manager</title></Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">G</div>
              <div><h1 className="text-lg font-semibold text-gray-800">Gmail Signature Manager</h1><p className="text-xs text-gray-500">Manage signatures for your Gmail Add-on</p></div>
            </div>
            <button onClick={()=>{setShowForm(true);setEditingSig(null);setForm({name:"",html:"",isDefault:false});}} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition">+ New Signature</button>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-6">
          {notification&&<div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${notification.type==="error"?"bg-red-50 text-red-700 border border-red-200":"bg-green-50 text-green-700 border border-green-200"}`}>{notification.message}</div>}
          {showForm&&<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">{editingSig?"Edit Signature":"Create New Signature"}</h2>
            <div className="mb-4"><p className="text-xs text-gray-500 mb-2">Quick Templates:</p><div className="flex gap-2">{["professional","minimal","withImage"].map(t=>(<button key={t} onClick={()=>loadTemplate(t)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full capitalize transition">{t}</button>))}</div></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Signature Name</label><input type="text" value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Professional..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">HTML Cntent</label><textarea value={form.html} onChange={(e)=>setForm(f=>({...f,html:e.target.value}))} rows={8} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              {form.html&&<div><p className="text-xs text-gray-500 mb-1">Preview:</p><div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm" dangerouslySetInnerHTML={{__html:form.html}}/></div>}
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.isDefault} onChange={(e)=>setForm(f=>({...f,isDefault:e.target.checked}))} className="rounded"/>Set as default signature</label>
              <div className="flex gap-3"><button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition">{editingSig?"Update":"Create"} Signature</button><button type="button" onClick={()=>{setShowForm(false);setEditingSig(null);}} className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Cancel</button></div>
            </form>
          </div>}
          {loading?<div className="text-center py-12 text-gray-400">Loading...</div>:signatures.length===0?<div className="text-center py-12"><p className="text-gray-400 text-sm">No signatures yet.</p><button onClick={()=>setShowForm(true)} className="mt-3 text-blue-500 text-sm underline">Create your first signature</button></div>:<div className="space-y-4">{signatures.map(sig=><div key={sig.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"><div className="flex items-start justify-between mb-3"><div className="flex items-center gap-2"><h3 className="font-medium text-gray-800">{sig.name}</h3>{sig.isDefault&&<span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Default</span>}</div><div className="flex items-center gap-2">{!sig.isDefault&&<button onClick={()=>handleSetDefault(sig.id)} className="text-xs text-gray-500 hover:text-blue-500 transition">Set Default</button>}<button onClick={()=>setPreviewSig(previewSig?.id===sig.id?null:sig)} className="text-xs text-gray-500 hover:text-gray-700 transition">{previewSig?.id===sig.id?"Hide":"Preview"}</button><button onClick={()=>handleEdit(sig)} className="text-xs text-blue-500 hover:text-blue-700 transition">Edit</button><button onClick={()=>handleDelete(sig.id)} className="text-xs text-red-400 hover:text-red-600 transition">Delete</button></div></div>{previewSig?.id===sig.id&&<div className="mt-3 pt-3 border-t border-gray-100" dangerouslySetInnerHTML={{__html:sig.html}}/>}<p className="text-xs text-gray-400 mt-2">Created: {new Date(sig.createdAt).toLocaleDateString()}</p></div>)}</div>}
        </div>
      </div>
    </>
  );
}
