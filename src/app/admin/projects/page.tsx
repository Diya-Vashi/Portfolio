"use client";

import React, { useEffect, useState } from "react";
import { Save, Plus, Trash2, Code } from "lucide-react";

export default function ProjectsAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then(res => res.json())
      .then(json => {
        if (json.projectsContent) {
          setData(json.projectsContent);
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
        body: JSON.stringify({ section: "projectsContent", data })
      });
      if (res.ok) alert("Projects saved successfully!");
      else alert("Failed to save changes.");
    } catch (e) {
      alert("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  const addProject = () => {
    setData([{ title: "New Project", subtitle: "", tags: [], isFeatured: false, bullets: [], githubLink: "", liveDemoLink: "" }, ...data]);
  };

  const removeProject = (index: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
    }
  };

  const updateProject = (index: number, field: string, value: any) => {
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
              <Code size={24} className="text-primary" />
              Projects
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your portfolio projects.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={addProject} className="flex items-center gap-2 px-4 py-2 bg-secondary/50 text-foreground font-medium rounded-xl hover:bg-secondary/50 transition-colors">
              <Plus size={18} /> Add Project
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
              <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {data.map((proj, i) => (
            <div key={i} className="glass-card rounded-2xl border border-border p-6 relative group">
              <button onClick={() => removeProject(i)} className="absolute top-6 right-6 p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20">
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Project Title</label>
                  <input type="text" value={proj.title || ""} onChange={e => updateProject(i, "title", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Subtitle</label>
                  <input type="text" value={proj.subtitle || ""} onChange={e => updateProject(i, "subtitle", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Tags (comma separated)</label>
                  <input type="text" value={(proj.tags || []).join(", ")} onChange={e => updateProject(i, "tags", e.target.value.split(",").map((s: string) => s.trim()))} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Bullet Points (one per line)</label>
                  <textarea rows={4} value={(proj.bullets || []).join("\n")} onChange={e => updateProject(i, "bullets", e.target.value.split("\n"))} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">GitHub Link</label>
                  <input type="url" value={proj.githubLink || ""} onChange={e => updateProject(i, "githubLink", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Live Demo Link</label>
                  <input type="url" value={proj.liveDemoLink || ""} onChange={e => updateProject(i, "liveDemoLink", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={proj.isFeatured || false} onChange={e => updateProject(i, "isFeatured", e.target.checked)} className="w-4 h-4 rounded bg-secondary/20 border-border text-primary focus:ring-primary/50" />
                  <label className="text-sm font-medium text-muted-foreground">Featured Project</label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
