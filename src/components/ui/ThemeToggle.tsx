"use client";

import { useTheme } from "@/components/ui/theme-provider";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ floating = true }: { floating?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const buttonContent = (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center p-2.5 rounded-full border border-white/[0.08] dark:border-white/[0.05] bg-white/[0.04] dark:bg-white/[0.02] backdrop-blur-md text-foreground hover:text-primary dark:hover:text-primary transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] group cursor-pointer ${
        floating 
          ? "fixed bottom-6 right-6 z-50 w-11 h-11" 
          : "w-9 h-9"
      }`}
      aria-label="Toggle visual theme"
    >
      {/* Background soft glow on hover */}
      <span className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex items-center justify-center"
        >
          {isDark ? (
            <Sun size={floating ? 18 : 16} className="text-amber-400 group-hover:scale-110 transition-transform" />
          ) : (
            <Moon size={floating ? 18 : 16} className="text-violet-600 group-hover:scale-110 transition-transform" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );

  return buttonContent;
}
