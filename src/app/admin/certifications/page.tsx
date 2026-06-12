"use client";

import React, { useEffect, useState } from "react";
import { Save, Plus, Trash2, Award } from "lucide-react";

export default function CertificationsAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then(res => res.json())
      .then(json => {
        if (json.certificationsContent) {
          setData(json.certificationsContent);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "certificationsContent", data })
      });
      if (res.ok) alert("Certifications saved successfully!");
      else alert("Failed to save changes.");
    } catch (e) {
      alert("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  const addCertification = () => {
    setData([{ name: "New Certification", issuer: "", badge: "", credentialLink: "" }, ...data]);
  };

  const removeCertification = (index: number) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
    }
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Award size={24} className="text-primary" />
              Certifications
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your certificates and awards.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={addCertification} className="flex items-center gap-2 px-4 py-2 bg-secondary/50 text-foreground font-medium rounded-xl hover:bg-secondary/50 transition-colors">
              <Plus size={18} /> Add Certification
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
              <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {data.map((cert, i) => (
            <div key={i} className="glass-card rounded-2xl border border-border p-6 relative group">
              <button onClick={() => removeCertification(i)} className="absolute top-6 right-6 p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20">
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Certification Name</label>
                  <input type="text" value={cert.name || ""} onChange={e => updateCertification(i, "name", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Issuing Organization</label>
                  <input type="text" value={cert.issuer || ""} onChange={e => updateCertification(i, "issuer", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Badge/Category</label>
                  <input type="text" value={cert.badge || ""} onChange={e => updateCertification(i, "badge", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Credential URL</label>
                  <input type="url" value={cert.credentialLink || ""} onChange={e => updateCertification(i, "credentialLink", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
