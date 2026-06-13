"use client";

import React, { useEffect, useState } from "react";
import { Save, Briefcase, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { ExperienceContent } from "@/types/portfolio";

export default function ExperienceAdmin() {
  const [data, setData] = useState<ExperienceContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then(res => res.json())
      .then(json => {
        if (json.experienceContent) {
          setData(Array.isArray(json.experienceContent) ? json.experienceContent : [json.experienceContent]);
        }
        setLoading(false);
      });
  }, []);

  const handleAdd = () => {
    setData([
      ...data,
      {
        company: "New Company",
        role: "Role",
        duration: "Jan 2024 - Present",
        location: "Location",
        tech: [],
        bullets: []
      }
    ]);
  };

  const handleRemove = (index: number) => {
    if (confirm("Remove this experience entry?")) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === data.length - 1) return;
    
    const newData = [...data];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newData[index], newData[newIndex]] = [newData[newIndex], newData[index]];
    setData(newData);
  };

  const handleChange = (index: number, field: keyof ExperienceContent, value: string) => {
    const newData = [...data];
    
    if (field === "tech" || field === "bullets") {
      newData[index][field] = value.split("\n") as any;
    } else {
      newData[index][field] = value as any;
    }
    setData(newData);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Clean up array fields before saving
      const cleanData = data.map(exp => ({
        ...exp,
        tech: exp.tech.map(s => s.trim()).filter(Boolean),
        bullets: exp.bullets.map(s => s.trim()).filter(Boolean)
      }));

      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "experienceContent", data: cleanData })
      });
      if (res.ok) alert("Experience saved successfully!");
      else alert("Failed to save changes.");
    } catch (e) {
      alert("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Briefcase size={24} className="text-primary" />
              Work Experience
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your work history. Ordered from top to bottom.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {data.map((exp, index) => (
          <div key={index} className="glass-card rounded-2xl border border-border p-6 space-y-6 relative group">
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-2 hover:bg-secondary rounded-lg disabled:opacity-50">
                <ArrowUp size={16} />
              </button>
              <button onClick={() => moveItem(index, 'down')} disabled={index === data.length - 1} className="p-2 hover:bg-secondary rounded-lg disabled:opacity-50">
                <ArrowDown size={16} />
              </button>
              <button onClick={() => handleRemove(index)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleChange(index, "role", e.target.value)}
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Duration</label>
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) => handleChange(index, "duration", e.target.value)}
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => handleChange(index, "location", e.target.value)}
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Technologies (one per line)</label>
                <textarea
                  rows={3}
                  value={exp.tech.join("\n")}
                  onChange={(e) => handleChange(index, "tech", e.target.value)}
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Experience Points (one per line)</label>
                <textarea
                  rows={4}
                  value={exp.bullets.join("\n")}
                  onChange={(e) => handleChange(index, "bullets", e.target.value)}
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleAdd}
          className="w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <Plus size={20} />
          Add Experience
        </button>
      </div>
    </div>
  );
}
