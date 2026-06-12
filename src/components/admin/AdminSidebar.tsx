"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { 
  LayoutDashboard, 
  Inbox, 
  Settings, 
  User, 
  FileCode, 
  Briefcase, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Globe,
  LogOut,
  Link as LinkIcon
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Inbox", href: "/admin/inbox", icon: Inbox },
    ]
  },
  {
    label: "Content",
    items: [
      { label: "General Info", href: "/admin/general", icon: User },
      { label: "Projects", href: "/admin/projects", icon: FileCode },
      { label: "Experience", href: "/admin/experience", icon: Briefcase },
      { label: "Education", href: "/admin/education", icon: GraduationCap },
      { label: "Certifications", href: "/admin/certifications", icon: Award },
      { label: "Research", href: "/admin/publications", icon: BookOpen },
      { label: "Contact & Links", href: "/admin/contact", icon: LinkIcon },
    ]
  },
  {
    label: "Configuration",
    items: [
      { label: "Admin Users", href: "/admin/users", icon: User },
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
      { label: "Device Preview", href: "/admin/preview", icon: Globe },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-background border-r border-border flex flex-col hidden lg:flex sticky top-0">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Admin Panel</h2>
        <p className="text-xs text-muted-foreground mt-1">Portfolio Management</p>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={(item as any).target}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border flex flex-col gap-2">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-medium text-muted-foreground">Theme</span>
          <ThemeToggle floating={false} />
        </div>
        <button 
          onClick={async () => {
            await fetch("/api/admin/auth/logout", { method: "POST" });
            window.location.reload();
          }}
          className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
