"use client";

import React, { useState, useEffect } from "react";
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
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  Menu,
  X,
  Code2
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
      { label: "Skills", href: "/admin/skills", icon: Code2 },
      { label: "Projects", href: "/admin/projects", icon: FileCode },
      { label: "Experience", href: "/admin/experience", icon: Briefcase },
      { label: "Education", href: "/admin/education", icon: GraduationCap },
      { label: "Certifications", href: "/admin/certifications", icon: Award },
      { label: "Research", href: "/admin/publications", icon: BookOpen },
      { label: "Contact & Links", href: "/admin/contact", icon: LinkIcon },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      { label: "Resume Manager", href: "/admin/resume", icon: FileText },
    ]
  },
  {
    label: "Configuration",
    items: [
      { label: "Admin Users", href: "/admin/users", icon: User },
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
      { label: "Device Preview", href: "/admin/preview", icon: Globe },
      { label: "Help & Guide", href: "/admin/help", icon: HelpCircle },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        aria-label="Open Admin Menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        w-72 lg:w-64 h-[100dvh] 
        bg-background border-r border-border 
        flex flex-col 
        transition-transform duration-300 ease-[0.16,1,0.3,1]
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Admin Panel</h2>
            <p className="text-xs text-muted-foreground mt-1">Portfolio Management</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
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
    </>
  );
}
