"use client";

import React, { useEffect, useState } from "react";
import { Save, Plus, Trash2, GraduationCap } from "lucide-react";

export default function EducationAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then(res => res.json())
      .then(json => {
        if (json.educationContent) {
          setData(json.educationContent);
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
        body: JSON.stringify({ section: "educationContent", data })
      });
      if (res.ok) alert("Education saved successfully!");
      else alert("Failed to save changes.");
    } catch (e) {
      alert("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    setData([{ degree: "New Degree", institution: "", duration: "", cgpa: "", status: "" }, ...data]);
  };

  const removeEducation = (index: number) => {
    if (confirm("Are you sure you want to delete this education entry?")) {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
    }
  };

  const updateEducation = (index: number, field: string, value: string) => {
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
              <GraduationCap size={24} className="text-primary" />
              Education
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your educational background.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={addEducation} className="flex items-center gap-2 px-4 py-2 bg-secondary/50 text-foreground font-medium rounded-xl hover:bg-secondary/50 transition-colors">
              <Plus size={18} /> Add Education
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
              <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {data.map((edu, i) => (
            <div key={i} className="glass-card rounded-2xl border border-border p-6 relative group">
              <button onClick={() => removeEducation(i)} className="absolute top-6 right-6 p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20">
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Degree</label>
                  <input type="text" value={edu.degree || ""} onChange={e => updateEducation(i, "degree", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Institution</label>
                  <input type="text" value={edu.institution || ""} onChange={e => updateEducation(i, "institution", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Duration (e.g. 2021 - 2024)</label>
                  <input type="text" value={edu.duration || ""} onChange={e => updateEducation(i, "duration", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">CGPA / Grade</label>
                  <input type="text" value={edu.cgpa || ""} onChange={e => updateEducation(i, "cgpa", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Status (e.g. Currently Pursuing - Optional)</label>
                  <input type="text" value={edu.status || ""} onChange={e => updateEducation(i, "status", e.target.value)} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
