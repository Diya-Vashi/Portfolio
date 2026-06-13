"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { Award, ExternalLink } from "lucide-react";

export function Certifications({ data }: { data: import('@/types/portfolio').PortfolioData }) {
  const { certificationsContent } = data;
  return (
    <section id="certifications" className="py-[120px] px-6 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute right-[-10%] top-[30%] -z-10 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading>Validated Expertise</SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificationsContent.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 md:p-8 flex flex-col items-center text-center group relative overflow-hidden"
            >
              {/* Radial gradient backing */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="p-4 bg-secondary border border-border rounded-2xl mb-5 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300">
                <Award className="text-primary" size={28} />
              </div>

              <h3 className="text-lg font-normal text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                {cert.name}
              </h3>
              <p className="text-sm text-muted-foreground font-normal mb-6">{cert.issuer}</p>

              <div className="flex items-center gap-4 mt-auto">
                <span className="px-3 py-1 text-[10px] font-mono tracking-wider uppercase bg-secondary/50 border border-border rounded text-muted-foreground">
                  {cert.badge}
                </span>
                {cert.credentialLink && cert.credentialLink !== "#TODO" && (
                  <a
                    href={cert.credentialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center font-medium transition-all duration-300 text-xs text-muted-foreground hover:text-accent hover:scale-105 cursor-pointer"
                  >
                    <ExternalLink size={13} className="mr-1.5" />
                    Verify
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
