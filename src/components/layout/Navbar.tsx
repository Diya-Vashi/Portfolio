"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, personalInfo } from "@/data/portfolio";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Top fade mask to create 'going inside' effect and prevent hard overlapping */}
      <div 
        className={`fixed top-0 left-0 right-0 h-32 z-40 pointer-events-none transition-opacity duration-500 ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(to bottom, var(--background) 40%, transparent 100%)"
        }}
      />
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[calc(100%-2rem)] max-w-5xl rounded-full px-6 ${
          isScrolled 
            ? "bg-background border border-border shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] py-2.5" 
            : "bg-transparent py-4"
        }`}
      >
        <div className="flex items-center justify-between">
          <a
            href="#"
            className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-medium tracking-[0.02em] text-foreground hover:text-primary transition-colors duration-300"
          >
            {personalInfo.name}
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground relative transition-colors duration-300 text-[13px] font-medium tracking-[0.05em] py-1.5 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </a>
            ))}
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Desktop Resume Button */}
            <div className="hidden md:block">
              <a
                href={personalInfo.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer px-4 py-1.5 text-xs rounded-full border border-white/10 dark:border-white/5 text-foreground bg-white/[0.03] dark:bg-white/[0.01] hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              >
                Resume
              </a>
            </div>

            {/* Embedded Theme Toggle */}
            <ThemeToggle floating={false} />

            {/* Mobile Hamburger Menu */}
            <button
              className="md:hidden text-foreground p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-background/95 backdrop-blur-md z-50 p-8 border-l border-border flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-10">
                  <span className="font-[family-name:var(--font-heading)] text-xl font-medium text-foreground">
                    {personalInfo.name}
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-foreground p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex flex-col space-y-5">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors py-1.5 text-[15px] font-medium tracking-[0.05em]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-border">
                <a
                  href={personalInfo.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer px-4 py-2.5 text-sm rounded-full border border-white/10 dark:border-white/5 text-foreground bg-white/[0.03] dark:bg-white/[0.01] hover:bg-primary hover:text-primary-foreground hover:border-primary w-full text-center"
                >
                  Download Resume
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
