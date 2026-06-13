"use client";

import React, { useEffect, useState } from "react";
import { Image as ImageIcon, Upload, Trash2, Copy, FileText, CheckCircle2 } from "lucide-react";

export default function MediaLibrary() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = () => {
    setLoading(true);
    fetch("/api/admin/media")
      .then((res) => res.json())
      .then((json) => {
        if (json.media) setMedia(json.media);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        fetchMedia();
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert("Error uploading file.");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file permanently?")) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMedia(media.filter((m) => m.id !== id));
      } else {
        alert("Failed to delete media.");
      }
    } catch (err) {
      alert("Error deleting media.");
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <ImageIcon size={24} className="text-primary" />
              Media Library
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Upload and manage your images and documents.</p>
          </div>
          <div>
            <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
              <Upload size={18} /> {uploading ? "Uploading..." : "Upload File"}
              <input type="file" onChange={handleUpload} disabled={uploading} className="hidden" accept="image/*,application/pdf" />
            </label>
          </div>
        </div>

        {loading ? (
          <div className="text-muted-foreground">Loading media...</div>
        ) : media.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">No media files found. Upload your first file!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {media.map((item) => {
              const isImage = item.mimeType.includes("image");
              return (
                <div key={item.id} className="glass-card rounded-2xl border border-border overflow-hidden relative group">
                  <div className="aspect-square bg-secondary/30 flex items-center justify-center relative">
                    {isImage ? (
                      <img src={item.url} alt={item.fileName} className="w-full h-full object-cover" />
                    ) : (
                      <FileText size={48} className="text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                      <button
                        onClick={() => copyUrl(item.url, item.id)}
                        className="p-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === item.id ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-foreground truncate" title={item.fileName}>
                      {item.fileName}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {(item.size / 1024).toFixed(1)} KB • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
