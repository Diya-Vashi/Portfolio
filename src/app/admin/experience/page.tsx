"use client";

import React, { useEffect, useState } from "react";
import { Save, Briefcase } from "lucide-react";

export default function ExperienceAdmin() {
  const [data, setData] = useState({
    company: "",
    role: "",
    duration: "",
    location: "",
    tech: [] as string[],
    bullets: [] as string[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then(res => res.json())
      .then(json => {
        if (json.experienceContent) {
          setData(json.experienceContent);
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "tech" || name === "bullets") {
      const arrValue = value.split("\n").map(s => s.trim()).filter(Boolean);
      setData(prev => ({ ...prev, [name]: value.split("\n") }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Clean up array fields before saving (remove empty strings)
      const cleanData = {
        ...data,
        tech: data.tech.map(s => s.trim()).filter(Boolean),
        bullets: data.bullets.map(s => s.trim()).filter(Boolean)
      };

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
            <p className="text-sm text-muted-foreground mt-1">Manage your current or most recent role.</p>
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

        <div className="glass-card rounded-2xl border border-border p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Company</label>
              <input
                type="text"
                name="company"
                value={data.company}
                onChange={handleChange}
                className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <input
                type="text"
                name="role"
                value={data.role}
                onChange={handleChange}
                className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Duration</label>
              <input
                type="text"
                name="duration"
                value={data.duration}
                onChange={handleChange}
                className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <input
                type="text"
                name="location"
                value={data.location}
                onChange={handleChange}
                className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Technologies (one per line)</label>
              <textarea
                name="tech"
                rows={3}
                value={data.tech.join("\n")}
                onChange={handleChange}
                className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Experience Points (one per line)</label>
              <textarea
                name="bullets"
                rows={6}
                value={data.bullets.join("\n")}
                onChange={handleChange}
                className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
