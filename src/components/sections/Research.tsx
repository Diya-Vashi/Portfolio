"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { Award, BookOpen } from "lucide-react";

export function Research({ data }: { data: import('@/types/portfolio').PortfolioData }) {
  const { publicationsContent, siteSettings } = data;
  const getPubIcon = (pub: any) => {
    if (pub.publisher?.toLowerCase().includes("springer") || pub.badge?.toLowerCase().includes("springer")) {
      return <Award className="text-primary" size={20} />;
    }
    return <BookOpen className="text-accent" size={20} />;
  };

  return (
    <section id="research" className="py-[120px] px-6 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute left-[-5%] top-[10%] -z-10 w-[350px] h-[350px] rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading>{siteSettings?.researchTitle || "Research & Publications"}</SectionHeading>

        <div className="space-y-6">
          {publicationsContent.map((pub: any, index) => {
            const CardWrapper = pub.link ? motion.a : motion.div;
            return (
              <CardWrapper
                href={pub.link}
                target={pub.link ? "_blank" : undefined}
                rel={pub.link ? "noopener noreferrer" : undefined}
                key={pub.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group relative overflow-hidden block"
              >
              {/* Vertical glowing accent strip */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-accent opacity-80" />

              <div className="flex gap-4 items-start">
                <div className="shrink-0 p-3 bg-secondary border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 rounded-xl">
                  {getPubIcon(pub)}
                </div>

                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-0.5 text-[9px] font-mono tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary rounded">
                    {pub.badge}
                  </span>

                  <h3 className="text-lg md:text-xl font-normal text-foreground italic leading-relaxed group-hover:text-primary transition-colors duration-300">
                    "{pub.title}"
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground font-normal">
                    {pub.conference && (
                      <span className="font-mono text-accent">{pub.conference}</span>
                    )}
                    {pub.organizer && (
                      <span className="font-mono text-accent">{pub.organizer}</span>
                    )}
                    {pub.institution && (
                      <span>{pub.institution}</span>
                    )}
                    {pub.location && (
                      <span>{pub.location}</span>
                    )}
                    <span className="text-muted-foreground/60">{pub.date}</span>
                  </div>
                </div>
              </div>

              {pub.publisher && (
                <div className="shrink-0 self-start md:self-center font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-accent/20 bg-accent/10 text-accent">
                  {pub.publisher}
                </div>
              )}
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
