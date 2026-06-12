"use client";

import React, { useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Plus, Edit2, Trash2, Shield, Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Admin", status: "Active" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin user?")) return;
    try {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const openModal = (user: any = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({ name: user.name, email: user.email, password: "", role: user.role, status: user.status });
    } else {
      setFormData({ name: "", email: "", password: "", role: "Admin", status: "Active" });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <SectionHeading>Admin Management</SectionHeading>
          <p className="text-sm text-muted-foreground mt-2">Manage roles, permissions, and administrator accounts.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          <span>New Admin</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-muted-foreground text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary w-fit">
                    <Shield size={12} />
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    user.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(user)} className="p-2 text-muted-foreground hover:text-accent transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/20 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-xl font-medium text-foreground mb-4">
              {editingUser ? "Edit Admin" : "Add New Admin"}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  {editingUser ? "Password (leave blank to keep current)" : "Password"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  required={!editingUser}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="SuperAdmin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
