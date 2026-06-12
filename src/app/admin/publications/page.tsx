"use client";

import React, { useEffect, useState } from "react";
import { Save, Plus, Trash2, BookOpen } from "lucide-react";

export default function PublicationsAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then(res => res.json())
      .then(json => {
        if (json.publicationsContent) {
          setData(json.publicationsContent);
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
        body: JSON.stringify({ section: "publicationsContent", data })
      });
      if (res.ok) alert("Publications saved successfully!");
      else alert("Failed to save changes.");
    } catch (e) {
      alert("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  const addPublication = () => {
    setData([{ title: "New Publication", date: "", badge: "", link: "", conference: "", institution: "", publisher: "", location: "" }, ...data]);
  };

  const removePublication = (index: number) => {
    if (confirm("Are you sure you want to delete this publication?")) {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
    }
  };

  const updatePublication = (index: number, field: string, value: string) => {
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
              <BookOpen size={24} className="text-primary" />
              Research & Publications
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your research papers and publications.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={addPublication} className="flex items-center gap-2 px-4 py-2 bg-secondary/50 text-foreground font-medium rounded-xl hover:bg-secondary/50 transition-colors">
              <Plus size={18} /> Add Publication
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
              <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {data.map((pub, i) => (
            <div key={i} className="glass-card rounded-2xl border border-border p-6 relative group">
              <button onClick={() => removePublication(i)} className="absolute top-6 right-6 p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20">
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Publication Title</label>
                  <input type="text" value={pub.title || ""} onChange={e => updatePublication(i, "title", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Date (e.g. May 2025)</label>
                  <input type="text" value={pub.date || ""} onChange={e => updatePublication(i, "date", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Badge (e.g. National Conference)</label>
                  <input type="text" value={pub.badge || ""} onChange={e => updatePublication(i, "badge", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Conference Name (Optional)</label>
                  <input type="text" value={pub.conference || ""} onChange={e => updatePublication(i, "conference", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Publisher (Optional)</label>
                  <input type="text" value={pub.publisher || ""} onChange={e => updatePublication(i, "publisher", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Institution / Organizer (Optional)</label>
                  <input type="text" value={pub.institution || pub.organizer || ""} onChange={e => updatePublication(i, "institution", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Location (Optional)</label>
                  <input type="text" value={pub.location || ""} onChange={e => updatePublication(i, "location", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Document URL</label>
                  <input type="url" value={pub.link || ""} onChange={e => updatePublication(i, "link", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
