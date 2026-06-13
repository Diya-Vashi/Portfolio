"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { Calendar, Star } from "lucide-react";

export function Education({ data }: { data: import('@/types/portfolio').PortfolioData }) {
  const { educationContent } = data;
  return (
    <section id="education" className="py-[120px] px-6 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute left-[-10%] top-[40%] -z-10 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading>Academic Foundation</SectionHeading>

        <div className="relative border-l border-border max-w-3xl mx-auto pl-8 md:pl-12 space-y-12">
          {educationContent.map((edu, index) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Timeline indicator node */}
              <div className="absolute -left-[41px] md:-left-[57px] top-6 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.3)]">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              </div>

              {/* Glass Card */}
              <div className="glass-card rounded-2xl p-6 md:p-8 hover:border-primary/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-normal text-foreground group-hover:text-primary transition-colors duration-300">
                        {edu.degree}
                      </h3>
                      {edu.status && (
                        <span className="px-2.5 py-0.5 text-[9px] font-mono tracking-wider uppercase bg-accent/10 border border-accent/20 text-accent rounded">
                          {edu.status}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Calendar size={14} className="text-muted-foreground/60" />
                    <span>{edu.duration}</span>
                  </div>
                </div>

                {edu.cgpa && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
                    <Star size={12} className="fill-primary text-primary" />
                    <span>CGPA: {edu.cgpa}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
