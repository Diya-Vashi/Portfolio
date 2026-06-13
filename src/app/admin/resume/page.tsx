"use client";

import React, { useEffect, useState } from "react";
import { FileText, Upload, Save, CheckCircle2 } from "lucide-react";

export default function ResumeAdmin() {
  const [resumeLink, setResumeLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then((res) => res.json())
      .then((json) => {
        if (json.personalInfo?.resumeLink) {
          setResumeLink(json.personalInfo.resumeLink);
        }
        setLoading(false);
      });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setResumeLink(data.media.url);
        // Automatically save the new resume link
        await handleSave(data.media.url);
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert("Error uploading file.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async (newUrl?: string) => {
    setSaving(true);
    try {
      // First fetch current data to avoid overwriting everything else in personalInfo
      const currentRes = await fetch("/api/admin/portfolio");
      const currentJson = await currentRes.json();
      
      const updatedPersonalInfo = {
        ...currentJson.personalInfo,
        resumeLink: newUrl || resumeLink,
      };

      const saveRes = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "personalInfo", data: updatedPersonalInfo }),
      });
      
      if (saveRes.ok) {
        if (!newUrl) alert("Resume link updated successfully!");
      } else {
        alert("Failed to update resume link.");
      }
    } catch (err) {
      alert("Error updating resume.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <FileText size={24} className="text-primary" />
            Resume Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your latest PDF resume. It will automatically update everywhere on the website.
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-border p-8 space-y-8">
          
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-12 bg-secondary/10 hover:bg-secondary/20 transition-colors">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Upload size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Upload New Resume</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              Upload a new PDF document. It will automatically replace your current resume across the entire site.
            </p>
            <label className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
              {uploading ? "Uploading..." : "Select PDF File"}
              <input type="file" onChange={handleUpload} disabled={uploading || saving} className="hidden" accept="application/pdf" />
            </label>
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground">Current Active Resume</h4>
            {resumeLink ? (
              <div className="flex items-center gap-4 p-4 bg-secondary/30 border border-border rounded-xl">
                <FileText size={24} className="text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{resumeLink.split('/').pop() || 'resume.pdf'}</p>
                  <a href={resumeLink} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline truncate block mt-1">
                    {resumeLink}
                  </a>
                </div>
                <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg text-xs font-medium">
                  <CheckCircle2 size={14} /> Active
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No resume link set.</p>
            )}
            
            <div className="pt-4 space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Manual Override URL (Optional)</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={resumeLink} 
                  onChange={e => setResumeLink(e.target.value)} 
                  className="flex-1 bg-secondary/20 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors" 
                  placeholder="https://..."
                />
                <button 
                  onClick={() => handleSave()} 
                  disabled={saving || uploading} 
                  className="flex items-center gap-2 px-6 py-2 bg-secondary text-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  <Save size={18} /> {saving ? "Saving..." : "Save Link"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
