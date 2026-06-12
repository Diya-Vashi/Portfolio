"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillsContent } from "@/data/portfolio";
import { Code2, Monitor, Cpu, Database, Wrench, Brain } from "lucide-react";

export function Skills() {
  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "languages": return <Code2 className="text-primary" size={18} />;
      case "frontend": return <Monitor className="text-accent" size={18} />;
      case "backend": return <Cpu className="text-violet-600 dark:text-violet-400" size={18} />;
      case "database": return <Database className="text-emerald-600 dark:text-emerald-450" size={18} />;
      case "tools": return <Wrench className="text-amber-600 dark:text-amber-400" size={18} />;
      default: return <Brain className="text-rose-600 dark:text-rose-450" size={18} />;
    }
  };

  const getCategoryGlow = (name: string) => {
    switch (name.toLowerCase()) {
      case "languages": return "group-hover:border-primary/40 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]";
      case "frontend": return "group-hover:border-accent/40 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]";
      case "backend": return "group-hover:border-violet-500/40 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]";
      case "database": return "group-hover:border-emerald-500/40 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]";
      case "tools": return "group-hover:border-amber-500/40 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]";
      default: return "group-hover:border-rose-500/40 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]";
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section id="skills" className="py-[120px] px-6 relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute right-[-10%] top-[20%] -z-10 w-[450px] h-[450px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading>Technical Arsenal</SectionHeading>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillsContent.categories.map((category, index) => (
            <motion.div
              key={category.name}
              variants={cardVariants}
              className={`glass-card rounded-2xl p-6 flex flex-col justify-between group cursor-pointer ${getCategoryGlow(
                category.name
              )}`}
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-secondary border border-border group-hover:bg-secondary/80 transition-colors rounded-xl">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-foreground">
                    {category.name}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 text-xs font-normal bg-secondary/50 dark:bg-white/[0.02] border border-border rounded-full text-foreground/80 hover:text-foreground dark:hover:text-white hover:border-primary/50 dark:hover:border-white/20 hover:bg-secondary transition-all duration-300 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover active highlight bar */}
              <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary to-accent mt-6 transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
