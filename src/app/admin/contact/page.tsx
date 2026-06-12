"use client";

import React, { useEffect, useState } from "react";
import { Save, Link as LinkIcon, Plus, Trash2 } from "lucide-react";

export default function ContactLinksAdmin() {
  const [data, setData] = useState({
    contactContent: { email: "", phone: "", linkedin: "", location: "", formspreeUrl: "" },
    socialLinks: { github: "", linkedin: "", email: "" },
    navLinks: [] as { label: string; href: string }[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio?_t=" + Date.now())
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          alert("Data load error: " + json.error);
        } else {
          setData({
            contactContent: json.contactContent || { email: "", phone: "", linkedin: "", location: "", formspreeUrl: "" },
            socialLinks: json.socialLinks || { github: "", linkedin: "", email: "" },
            navLinks: json.navLinks || []
          });
        }
        setLoading(false);
      })
      .catch(err => {
        alert("Fetch failed: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, contactContent: { ...prev.contactContent, [name]: value } }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [name]: value } }));
  };

  const handleNavChange = (index: number, field: "label" | "href", val: string) => {
    const newNav = [...data.navLinks];
    newNav[index][field] = val;
    setData(prev => ({ ...prev, navLinks: newNav }));
  };

  const addNavLink = () => {
    setData(prev => ({ ...prev, navLinks: [...prev.navLinks, { label: "New Link", href: "#" }] }));
  };

  const removeNavLink = (index: number) => {
    const newNav = [...data.navLinks];
    newNav.splice(index, 1);
    setData(prev => ({ ...prev, navLinks: newNav }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) alert("Contact & Links saved successfully!");
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
              <LinkIcon size={24} className="text-primary" />
              Contact & Links
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage header navigation, footer links, and contact details.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
            <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="glass-card rounded-2xl border border-border p-6 space-y-6">
            <h2 className="text-lg font-medium text-foreground">Contact Form & Details</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Formspree Endpoint URL</label>
                <input type="text" name="formspreeUrl" value={data.contactContent.formspreeUrl} onChange={handleContactChange} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <input type="email" name="email" value={data.contactContent.email} onChange={handleContactChange} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <input type="text" name="phone" value={data.contactContent.phone} onChange={handleContactChange} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <input type="text" name="location" value={data.contactContent.location} onChange={handleContactChange} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50" />
              </div>
            </div>
          </div>

          {/* Social Links (Footer/Header Icons) */}
          <div className="glass-card rounded-2xl border border-border p-6 space-y-6">
            <h2 className="text-lg font-medium text-foreground">Social Link Icons</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">GitHub Profile</label>
                <input type="url" name="github" value={data.socialLinks.github} onChange={handleSocialChange} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">LinkedIn Profile</label>
                <input type="url" name="linkedin" value={data.socialLinks.linkedin} onChange={handleSocialChange} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email (mailto link)</label>
                <input type="email" name="email" value={data.socialLinks.email} onChange={handleSocialChange} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Navigation Links */}
        <div className="glass-card rounded-2xl border border-border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Header Navigation Menu</h2>
            <button onClick={addNavLink} className="text-sm flex items-center gap-2 px-3 py-1.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80">
              <Plus size={16} /> Add Link
            </button>
          </div>
          <div className="space-y-3">
            {data.navLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-4 bg-secondary/10 p-3 rounded-xl border border-border group">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-muted-foreground">Label</label>
                  <input type="text" value={link.label} onChange={(e) => handleNavChange(i, "label", e.target.value)} className="w-full bg-transparent border-b border-border py-1 text-sm text-foreground focus:outline-none focus:border-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-muted-foreground">URL / Section ID (e.g. #about)</label>
                  <input type="text" value={link.href} onChange={(e) => handleNavChange(i, "href", e.target.value)} className="w-full bg-transparent border-b border-border py-1 text-sm text-foreground focus:outline-none focus:border-primary" />
                </div>
                <button onClick={() => removeNavLink(i)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
