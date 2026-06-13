"use client";

import React, { useEffect, useState } from "react";
import { Save, Code2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface SkillCategory {
  name: string;
  skills: string[];
}

export default function SkillsAdmin() {
  const [data, setData] = useState<{ categories: SkillCategory[] }>({ categories: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then(res => res.json())
      .then(json => {
        if (json.skillsContent && json.skillsContent.categories) {
          setData(json.skillsContent);
        }
        setLoading(false);
      });
  }, []);

  const handleAddCategory = () => {
    setData({
      categories: [
        ...data.categories,
        {
          name: "New Category",
          skills: []
        }
      ]
    });
  };

  const handleRemoveCategory = (index: number) => {
    if (confirm("Remove this tech stack category?")) {
      const newCats = [...data.categories];
      newCats.splice(index, 1);
      setData({ categories: newCats });
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === data.categories.length - 1) return;
    
    const newCats = [...data.categories];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newCats[index], newCats[newIndex]] = [newCats[newIndex], newCats[index]];
    setData({ categories: newCats });
  };

  const handleNameChange = (index: number, value: string) => {
    const newCats = [...data.categories];
    newCats[index].name = value;
    setData({ categories: newCats });
  };

  const handleSkillsChange = (index: number, value: string) => {
    const newCats = [...data.categories];
    newCats[index].skills = value.split("\n") as any;
    setData({ categories: newCats });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Clean up empty lines
      const cleanData = {
        categories: data.categories.map(cat => ({
          name: cat.name,
          skills: cat.skills.map(s => s.trim()).filter(Boolean)
        }))
      };

      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "skillsContent", data: cleanData })
      });
      if (res.ok) alert("Skills saved successfully!");
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
              <Code2 size={24} className="text-primary" />
              Technical Arsenal (Skills)
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your tech stack categories (e.g. Frontend, Backend).</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.categories.map((cat, index) => (
            <div key={index} className="glass-card rounded-2xl border border-border p-6 space-y-4 relative group">
              <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveCategory(index, 'up')} disabled={index === 0} className="p-1.5 hover:bg-secondary rounded-lg disabled:opacity-50">
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => moveCategory(index, 'down')} disabled={index === data.categories.length - 1} className="p-1.5 hover:bg-secondary rounded-lg disabled:opacity-50">
                  <ArrowDown size={14} />
                </button>
                <button onClick={() => handleRemoveCategory(index)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category Name</label>
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 transition-colors font-mono text-sm"
                  placeholder="e.g. Frontend"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Skills (One per line)</label>
                <textarea
                  rows={6}
                  value={cat.skills.join("\n")}
                  onChange={(e) => handleSkillsChange(index, e.target.value)}
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none text-sm"
                  placeholder="React&#10;Next.js&#10;Tailwind"
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleAddCategory}
            className="w-full min-h-[250px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <div className="p-3 bg-secondary rounded-xl">
              <Plus size={24} />
            </div>
            <span className="font-medium">Add Category</span>
          </button>
        </div>
      </div>
    </div>
  );
}
