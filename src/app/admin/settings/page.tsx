"use client";

import React, { useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Save, Loader2, Globe, Palette, FileText } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    themeColor: "#6d28d9",
    seoKeywords: "",
    googleAnalyticsId: "",
    faviconUrl: "",
  });
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert("Settings saved successfully!");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.name.endsWith(".ico")) {
      alert("Please upload an image file (.png, .jpg, .ico).");
      return;
    }

    setUploadingFavicon(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, faviconUrl: data.media.url }));
      } else {
        alert("Favicon upload failed.");
      }
    } catch (err) {
      alert("Error uploading favicon.");
    } finally {
      setUploadingFavicon(false);
      e.target.value = "";
    }
  };


  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete the setting '${key}'?`)) return;
    try {
      await fetch(`/api/admin/settings?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      const newSettings = { ...settings };
      delete (newSettings as any)[key];
      setSettings(newSettings);
    } catch (e) {
      console.error(e);
      alert("Failed to delete setting.");
    }
  };

  const handleAddNew = async () => {
    if (!newKey.trim()) return alert("Key is required");
    const updated = { ...settings, [newKey]: newValue };
    setSettings(updated);
    setNewKey("");
    setNewValue("");
    
    // Auto save the new key to the backend
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <SectionHeading>Site Settings</SectionHeading>
          <p className="text-sm text-muted-foreground mt-2">Manage your global portfolio configuration and SEO.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>Save Settings</span>
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Tabs */}
        <div className="w-64 space-y-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "general" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <Globe size={18} />
            General Info
          </button>
          <button
            onClick={() => setActiveTab("branding")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "branding" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <Palette size={18} />
            Branding
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "seo" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <FileText size={18} />
            SEO & Analytics
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "advanced" ? "bg-red-500/10 text-red-500" : "text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <FileText size={18} />
            Advanced (All Keys)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card rounded-2xl border border-border p-8">
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground">Site Name / Title</label>
                  <p className="text-xs text-muted-foreground mb-2">The main title of your portfolio.</p>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    placeholder="E.g. Diya Vashi | Software Engineer"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Contact Email</label>
                  <p className="text-xs text-muted-foreground mb-2">The email address used for contact forms.</p>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {activeTab === "branding" && (
              <div className="space-y-8">
                <div>
                  <label className="text-sm font-medium text-foreground">Primary Theme Color (Hex)</label>
                  <p className="text-xs text-muted-foreground mb-2">The primary brand color for buttons and highlights.</p>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={settings.themeColor}
                      onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer border-none bg-transparent"
                    />
                    <input
                      type="text"
                      value={settings.themeColor}
                      onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                      className="flex-1 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary uppercase"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <label className="text-sm font-medium text-foreground block mb-1">Site Favicon (Browser Tab Icon)</label>
                  <p className="text-xs text-muted-foreground mb-4">Upload a square image (PNG or ICO) to appear in the browser tab.</p>
                  
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-xl border border-border bg-secondary/50 flex items-center justify-center overflow-hidden shrink-0 relative">
                      {settings.faviconUrl ? (
                        <img src={settings.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                      ) : (
                        <Globe className="text-muted-foreground" size={24} />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <label className="inline-flex items-center justify-center px-4 py-2 bg-secondary text-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer text-sm">
                        {uploadingFavicon ? <><Loader2 size={16} className="animate-spin mr-2" /> Uploading...</> : "Upload New Favicon"}
                        <input type="file" onChange={handleFaviconUpload} disabled={uploadingFavicon} className="hidden" accept="image/*,.ico" />
                      </label>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.faviconUrl || ""}
                          onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                          placeholder="Or paste an image URL here..."
                          className="flex-1 px-3 py-1.5 bg-secondary/30 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground">Site Description</label>
                  <p className="text-xs text-muted-foreground mb-2">Used for SEO meta description.</p>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">SEO Keywords</label>
                  <p className="text-xs text-muted-foreground mb-2">Comma separated list of keywords.</p>
                  <input
                    type="text"
                    value={settings.seoKeywords}
                    onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    placeholder="React, Next.js, Developer, Portfolio"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Google Analytics ID</label>
                  <p className="text-xs text-muted-foreground mb-2">Your GA4 measurement ID (e.g. G-XXXXXXXXXX).</p>
                  <input
                    type="text"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {activeTab === "advanced" && (
              <div className="space-y-6 max-w-4xl">
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl text-sm">
                  <strong>Warning:</strong> These are raw key-value pairs stored in the database. Modifying or deleting core keys (like `siteName`) may break the front-end layout if they are expected by the application.
                </div>
                
                <div className="space-y-4">
                  {Object.entries(settings).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-4 p-4 glass-card rounded-xl border border-border">
                      <div className="w-1/3">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Key</label>
                        <input
                          type="text"
                          value={key}
                          disabled
                          className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground opacity-70 cursor-not-allowed text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Value</label>
                        <input
                          type="text"
                          value={value as string}
                          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                          className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-sm"
                        />
                      </div>
                      <div className="pt-6">
                        <button
                          type="button"
                          onClick={() => handleDelete(key)}
                          className="px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-foreground rounded-lg transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="text-lg font-medium text-foreground mb-4">Add Custom Setting</h3>
                  <div className="flex items-end gap-4">
                    <div className="w-1/3">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">New Key</label>
                      <input
                        type="text"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="e.g. heroSubtitle"
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Value</label>
                      <input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Value"
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddNew}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm h-10"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
