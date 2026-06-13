"use client";

import React, { useEffect, useState } from "react";
import { Save, User, Plus, Trash2 } from "lucide-react";

export default function GeneralInfoAdmin() {
  const [data, setData] = useState({
    personalInfo: {
      name: "",
      resumeLink: "",
    },
    heroContent: {
      badge: "",
      subtitle: "",
      impactStatement: "",
      roles: [] as string[]
    },
    aboutContent: {
      blueprintText: [] as string[],
      researchText: [] as string[],
      researchBadge: "",
      stats: [] as { label: string; value: string }[]
    }
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio?_t=" + Date.now())
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          setErrorMsg(json.error);
        } else {
          setData({
            personalInfo: json.personalInfo || { name: "", resumeLink: "" },
            heroContent: json.heroContent || { badge: "", subtitle: "", impactStatement: "", roles: [] },
            aboutContent: {
              blueprintText: json.aboutContent?.blueprintText || (json.aboutContent?.paragraphs?.slice(0, 2) || []),
              researchText: json.aboutContent?.researchText || (json.aboutContent?.paragraphs?.slice(2, 4) || []),
              researchBadge: json.aboutContent?.researchBadge || "// CHARUSAT & Springer Published",
              stats: json.aboutContent?.stats || []
            }
          });
        }
        setLoading(false);
      })
      .catch(err => {
        setErrorMsg(err.message);
        setLoading(false);
      });
  }, []);

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, heroContent: { ...prev.heroContent, [name]: value } }));
  };

  const updateRoles = (value: string) => {
    setData(prev => ({ ...prev, heroContent: { ...prev.heroContent, roles: value.split(",").map(s => s.trim()) } }));
  };

  const updateBlueprint = (value: string) => {
    setData(prev => ({ ...prev, aboutContent: { ...prev.aboutContent, blueprintText: value.split("\n") } }));
  };

  const updateResearch = (value: string) => {
    setData(prev => ({ ...prev, aboutContent: { ...prev.aboutContent, researchText: value.split("\n") } }));
  };

  const updateBadge = (value: string) => {
    setData(prev => ({ ...prev, aboutContent: { ...prev.aboutContent, researchBadge: value } }));
  };

  const handleStatChange = (index: number, field: "label" | "value", val: string) => {
    const newStats = [...data.aboutContent.stats];
    newStats[index][field] = val;
    setData(prev => ({ ...prev, aboutContent: { ...prev.aboutContent, stats: newStats } }));
  };

  const addStat = () => {
    setData(prev => ({ ...prev, aboutContent: { ...prev.aboutContent, stats: [...prev.aboutContent.stats, { label: "New Stat", value: "0" }] } }));
  };

  const removeStat = (index: number) => {
    const newStats = [...data.aboutContent.stats];
    newStats.splice(index, 1);
    setData(prev => ({ ...prev, aboutContent: { ...prev.aboutContent, stats: newStats } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) alert("General Information saved successfully!");
      else alert("Failed to save changes.");
    } catch (e) {
      alert("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading...</div>;
  if (errorMsg) return <div className="p-8 text-red-500 font-bold bg-red-500/10 rounded-xl border border-red-500 m-8">Error loading data: {errorMsg}. Please try logging out and logging back in.</div>;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <User size={24} className="text-primary" />
              Hero & About Section
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your homepage hero and personal bio.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
            <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="glass-card rounded-2xl border border-border p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <input type="text" value={data.personalInfo.name} onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, name: e.target.value } }))} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Resume/CV Link</label>
              <input type="text" value={data.personalInfo.resumeLink} onChange={(e) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, resumeLink: e.target.value } }))} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Hero Badge Text</label>
              <input type="text" name="badge" value={data.heroContent.badge} onChange={handleHeroChange} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Hero Rotating Roles (Comma separated)</label>
              <input type="text" value={(data.heroContent.roles || []).join(", ")} onChange={(e) => updateRoles(e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Hero Impact Statement</label>
              <textarea rows={3} name="impactStatement" value={data.heroContent.impactStatement} onChange={handleHeroChange} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none" />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">The Blueprint Content (One paragraph per line)</label>
              <textarea rows={4} value={(data.aboutContent.blueprintText || []).join("\n")} onChange={(e) => updateBlueprint(e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Research & Innovation Content (One paragraph per line)</label>
              <textarea rows={4} value={(data.aboutContent.researchText || []).join("\n")} onChange={(e) => updateResearch(e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Research Badge Text</label>
              <input type="text" value={data.aboutContent.researchBadge} onChange={(e) => updateBadge(e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="// e.g. Published in Springer" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Hero Stats</h2>
            <button onClick={addStat} className="text-sm flex items-center gap-2 px-3 py-1.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80">
              <Plus size={16} /> Add Stat
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(data.aboutContent.stats || []).map((stat, i) => (
              <div key={i} className="relative p-4 border border-border rounded-xl bg-secondary/10 group">
                <button onClick={() => removeStat(i)} className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Value</label>
                    <input type="text" value={stat.value} onChange={(e) => handleStatChange(i, "value", e.target.value)} className="w-full bg-transparent border-b border-border py-1 text-lg font-semibold text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Label</label>
                    <input type="text" value={stat.label} onChange={(e) => handleStatChange(i, "label", e.target.value)} className="w-full bg-transparent border-b border-border py-1 text-sm text-foreground focus:outline-none focus:border-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
