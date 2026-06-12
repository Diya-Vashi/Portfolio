"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Mail, Trash2, ExternalLink, Star, Archive, Check } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
}

export default function AdminInbox() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateMessage = async (id: string, data: any) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage messages received from your portfolio contact form.</p>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="glass-card rounded-2xl border border-border p-12 text-center">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium">Your inbox is empty</p>
            <p className="text-sm text-muted-foreground mt-1">No one has sent you a message yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`glass-card rounded-2xl border ${msg.isRead ? 'border-border' : 'border-primary/30 bg-primary/5'} p-6 hover:bg-secondary/20 transition-colors`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-foreground">{msg.name}</h3>
                      <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-md">
                        {msg.email}
                      </span>
                      {msg.isStarred && <Star size={14} className="text-amber-500 fill-amber-500" />}
                      {msg.isArchived && <Archive size={14} className="text-muted-foreground" />}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {format(new Date(msg.createdAt), "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary mt-3 mb-2">{msg.subject}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed bg-secondary/50 p-4 rounded-xl border border-border">
                      {msg.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                  {!msg.isRead && (
                    <button
                      onClick={() => updateMessage(msg.id, { isRead: true })}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Check size={14} />
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => updateMessage(msg.id, { isStarred: !msg.isStarred })}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors ${msg.isStarred ? 'text-amber-500 hover:bg-amber-500/10' : 'text-foreground hover:bg-secondary'}`}
                  >
                    <Star size={14} className={msg.isStarred ? 'fill-amber-500' : ''} />
                    {msg.isStarred ? 'Unstar' : 'Star'}
                  </button>
                  <button
                    onClick={() => updateMessage(msg.id, { isArchived: !msg.isArchived })}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors ${msg.isArchived ? 'text-blue-500 hover:bg-blue-500/10' : 'text-foreground hover:bg-secondary'}`}
                  >
                    <Archive size={14} />
                    {msg.isArchived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}&body=${encodeURIComponent(`\n\n\nOn ${format(new Date(msg.createdAt), "MMM d, yyyy h:mm a")}, ${msg.name} wrote:\n> ${msg.message.replace(/\n/g, '\n> ')}`)}`}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 rounded-lg transition-opacity shadow-lg shadow-primary/20"
                  >
                    <ExternalLink size={14} />
                    Reply
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
