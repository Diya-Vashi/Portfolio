"use client";

import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { BookOpen, Layers, Rocket } from "lucide-react";

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(inViewRef, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");

    if (isNaN(numeric)) {
      if (ref.current) ref.current.textContent = value;
      return;
    }

    const controls = animate(0, numeric, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent =
            (Number.isInteger(numeric) ? Math.round(v) : v.toFixed(2)) + suffix;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <div
      ref={inViewRef}
      className="glass-card rounded-2xl p-5 flex flex-col justify-center items-center text-center group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <span
        ref={ref}
        className="relative font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-normal text-accent tracking-tight mb-1.5 group-hover:scale-105 transition-transform duration-300 italic"
      >
        {value}
      </span>
      <span className="relative text-xs text-muted-foreground font-mono tracking-wider uppercase leading-tight">
        {label}
      </span>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 16 },
  },
};

export function About({ data }: { data: import('@/types/portfolio').PortfolioData }) {
  const { aboutContent, siteSettings } = data;
  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute left-[-8%] top-[40%] -z-10 w-[450px] h-[450px] rounded-full bg-violet-600/5 blur-[130px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto">
        <SectionHeading>{siteSettings.aboutTitle || "Engineering Philosophy"}</SectionHeading>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Main philosophy card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 glass-card rounded-2xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group min-h-[320px]"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.025] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
              <Layers size={200} className="text-foreground" />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-500/10 rounded-xl text-primary">
                  <Rocket size={20} />
                </div>
                <h3 className="text-sm font-semibold tracking-[0.1em] uppercase text-foreground/70">
                  The Blueprint
                </h3>
              </div>

              {(aboutContent.blueprintText || []).map((para, i) => (
                <p
                  key={i}
                  className="text-foreground/75 text-base leading-[1.85] font-normal"
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-1 gap-4"
          >
            {aboutContent.stats.map((stat) => (
              <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </motion.div>

          {/* Research vision card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-3 glass-card rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between relative overflow-hidden group"
          >
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl text-accent">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-sm font-semibold tracking-[0.1em] uppercase text-foreground/70">
                  Research & Innovation
                </h3>
              </div>
              {(aboutContent.researchText || []).map((para, i) => (
                <p
                  key={i}
                  className="text-muted-foreground text-sm md:text-base leading-[1.85] font-normal"
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}
            </div>
            <div className="shrink-0 flex items-center justify-center px-6 py-4 bg-white/[0.02] border border-border rounded-2xl font-mono text-[11px] text-muted-foreground/50 whitespace-nowrap">
              {aboutContent.researchBadge || "// Research Published"}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
