"use client";

import { useState } from "react";
import { BookOpen, HelpCircle, Image as ImageIcon, LayoutDashboard, Settings, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const helpSections = [
  {
    id: "settings",
    title: "Site Settings & Branding",
    icon: <Settings size={20} />,
    color: "text-primary",
    bgColor: "bg-primary/10",
    content: (
      <div className="space-y-4">
        <p>You can manage the core identity of your website from the <strong>Configuration &gt; Site Settings</strong> page. Changes here apply globally and instantly.</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Site Name & SEO:</strong> Update the main title that appears in Google searches and browser tabs.</li>
          <li><strong>Theme Color:</strong> Change the primary accent color (hex code) used for buttons and highlights across the site.</li>
          <li><strong>Favicon:</strong> Upload a square image (.png, .ico) in the Branding tab to change the small icon in the browser tab.</li>
        </ul>
      </div>
    )
  },
  {
    id: "hero",
    title: "Updating Homepage Content (Hero)",
    icon: <User size={20} />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    content: (
      <div className="space-y-4">
        <p>The main text on your homepage can be easily edited under <strong>Content &gt; General Info</strong>.</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Full Name:</strong> This sets the name that appears in big text on the landing page and navigation bar.</li>
          <li><strong>Roles (Animated Text):</strong> You can specify multiple job titles (e.g., <em>Software Engineer, Content Creator</em>). Separate them with a comma. The website will automatically type and animate through these roles sequentially.</li>
          <li><strong>Impact Statement:</strong> This is the descriptive paragraph shown below your name on the homepage.</li>
        </ul>
      </div>
    )
  },
  {
    id: "media",
    title: "Media Library & Resume Management",
    icon: <ImageIcon size={20} />,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    content: (
      <div className="space-y-4">
        <p>Your portfolio uses a modern cloud-hosted media system (Cloudinary) to ensure blazing fast load speeds.</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Media Library:</strong> Go to <strong>Content &gt; Media Library</strong> to bulk upload, preview, or delete images.</li>
          <li><strong>Project Images:</strong> When creating or editing a Project, you can upload an image directly from the form.</li>
          <li><strong>Resume Updates:</strong> Go to <strong>Content &gt; Resume Manager</strong> to upload a new PDF of your CV. This updates the global download buttons instantly across the site without requiring any code redeployment.</li>
        </ul>
      </div>
    )
  },
  {
    id: "dashboard",
    title: "Analytics & Visitor Tracking",
    icon: <LayoutDashboard size={20} />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    content: (
      <p>
        The Admin Dashboard provides real-time insights into your portfolio's traffic. Every time someone visits your portfolio, the <strong>Total Views</strong> counter automatically increases. 
        <br/><br/>
        Any messages submitted via your portfolio's Contact form are securely logged in the database. You can read them in the <strong>Inbox</strong> tab. The system also sends a beautiful HTML email notification directly to your registered admin email address.
      </p>
    )
  }
];

export default function HelpPage() {
  const [openSection, setOpenSection] = useState<string>("settings");

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 p-2 sm:p-4">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          <BookOpen size={14} /> Documentation
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Admin Panel Guide</h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
          Everything you need to know to manage your portfolio, customize branding, and track your analytics.
        </p>
      </div>

      <div className="space-y-4">
        {helpSections.map((section) => {
          const isOpen = openSection === section.id;

          return (
            <div 
              key={section.id} 
              className={`bg-card border transition-all duration-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md ${isOpen ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border'}`}
            >
              <button
                onClick={() => setOpenSection(isOpen ? "" : section.id)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer outline-none focus-visible:bg-secondary/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${section.bgColor} ${section.color}`}>
                    {section.icon}
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">{section.title}</h2>
                </div>
                <ChevronDown 
                  className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  size={20} 
                />
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-border/50 text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="p-4 bg-primary/20 rounded-full text-primary shrink-0">
          <HelpCircle size={32} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Did you know?</h3>
          <p className="text-muted-foreground">
            All your changes are saved instantly to the secure Postgres database and are automatically and instantly reflected on your live Vercel portfolio without needing any code changes or redeployments!
          </p>
        </div>
      </div>
    </div>
  );
}
