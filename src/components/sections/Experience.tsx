"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { Calendar, MapPin, Briefcase, Zap, Shield, Bell, FileBarChart } from "lucide-react";

export function Experience({ data }: { data: import('@/types/portfolio').PortfolioData }) {
  const { experienceContent } = data;
  const getImpactIcon = (index: number) => {
    switch (index) {
      case 0: return <Zap className="text-primary" size={16} />;
      case 1: return <Shield className="text-accent" size={16} />;
      case 2: return <Bell className="text-violet-600 dark:text-violet-400" size={16} />;
      default: return <FileBarChart className="text-emerald-600 dark:text-emerald-450" size={16} />;
    }
  };

  const getImpactBadge = (index: number) => {
    switch (index) {
      case 0: return "Full-Stack System";
      case 1: return "Enterprise Security & RBAC";
      case 2: return "Real-Time Interactivity";
      default: return "Process Automation";
    }
  };

  return (
    <section id="experience" className="py-[120px] px-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute left-[5%] bottom-[20%] -z-10 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading>Professional Journey</SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column - Corporate Metadata */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Briefcase size={80} />
              </div>
              
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono tracking-widest uppercase mb-4">
                Active Placement
              </span>
              
              <h3 className="text-2xl font-normal text-foreground tracking-tight mb-2">
                {experienceContent.company}
              </h3>
              <p className="text-accent text-sm font-semibold tracking-wider mb-6">
                {experienceContent.role}
              </p>

              <div className="space-y-3.5 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-muted-foreground/60" />
                  <span>{experienceContent.duration}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-muted-foreground/60" />
                  <span>{experienceContent.location}</span>
                </div>
              </div>
            </div>

            {/* Core Tech Stack for Role */}
            <div className="glass-card rounded-2xl p-6">
              <h4 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-4">Role Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {experienceContent.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-xs font-normal bg-secondary/50 border border-border rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Career Storytelling List */}
          <div className="lg:col-span-8 space-y-6">
            {experienceContent.bullets.map((bullet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 flex gap-5 relative group overflow-hidden"
              >
                {/* Visual Connector Timeline line inside list */}
                <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-border -z-10 group-hover:bg-primary/20 transition-colors" />

                {/* Bullet indicator with dynamic icon */}
                <div className="shrink-0 w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300">
                  {getImpactIcon(index)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded bg-secondary/50 border border-border text-muted-foreground group-hover:text-accent group-hover:border-accent/20 transition-all duration-300">
                      {getImpactBadge(index)}
                    </span>
                  </div>
                  <p className="text-foreground/85 text-sm md:text-base leading-relaxed font-normal">
                    {bullet}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
