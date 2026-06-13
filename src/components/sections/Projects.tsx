"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { ExternalLink, GraduationCap, Compass, Image as ImageIcon, X } from "lucide-react";

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export function Projects({ data }: { data: import('@/types/portfolio').PortfolioData }) {
  const { projectsContent } = data;
  const [selectedGallery, setSelectedGallery] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getProjectIcon = (title: string) => {
    if (title.toLowerCase().includes("doc")) {
      return <GraduationCap className="text-accent" size={20} />;
    }
    return <Compass className="text-primary" size={20} />;
  };

  return (
    <section id="projects" className="py-[120px] px-6 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute right-[5%] bottom-[30%] -z-10 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading>Academic & Personal Projects</SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsContent.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-card rounded-2xl p-8 flex flex-col justify-between group relative overflow-hidden ${
                project.isFeatured ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              {/* Radial gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/[0.03] to-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-secondary border border-border group-hover:bg-secondary/80 transition-colors rounded-xl">
                      {getProjectIcon(project.title)}
                    </div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                      {project.isFeatured ? "Featured Spotlight" : "Application"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3.5 text-muted-foreground">
                    {project.githubLink && project.githubLink !== "#TODO" && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors cursor-pointer"
                        aria-label="GitHub Repository"
                      >
                        <GithubIcon size={18} />
                      </a>
                    )}
                    {project.liveDemoLink && project.liveDemoLink !== "#TODO" && project.liveDemoLink !== "#" && project.liveDemoLink !== "" && (
                      <a
                        href={project.liveDemoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent transition-colors cursor-pointer"
                        aria-label="Live Demo"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                    {((project as any).imageGallery && (project as any).imageGallery.length > 0) && (
                      <button
                        onClick={() => {
                          setSelectedGallery((project as any).imageGallery);
                          setCurrentImageIndex(0);
                        }}
                        className="hover:text-primary transition-colors cursor-pointer ml-1"
                        aria-label="View Screenshots"
                      >
                        <ImageIcon size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-2xl font-normal text-foreground group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  {project.hasResearchPublished && (
                    <span className="px-2.5 py-0.5 text-[9px] font-mono tracking-wider uppercase bg-accent/10 border border-accent/20 text-accent rounded">
                      Research Published
                    </span>
                  )}
                </div>
                
                <p className="text-accent/90 font-mono text-xs mb-4 tracking-wider">
                  {project.subtitle}
                </p>

                <p className="text-foreground/80 text-sm leading-relaxed mb-6 font-normal">
                  {project.bullets.join(" ")}
                </p>

                {/* Conferences if any */}
                {project.conferences && project.conferences.length > 0 && (
                  <div className="mb-6 space-y-2.5">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground/80 block">Conferences Presented</span>
                    {project.conferences.map((conf, idx) => (
                      <div
                        key={idx}
                        className="text-xs p-3 bg-secondary/35 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 group-hover:border-primary/20 transition-colors"
                      >
                        <div>
                          <span className="text-foreground font-medium">{conf.name}</span>
                          {conf.publisher && (
                            <span className="text-muted-foreground"> (Published via {conf.publisher})</span>
                          )}
                        </div>
                        <span className="text-muted-foreground/70 text-[10px] font-mono">{conf.location} · {conf.year}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[11px] font-mono bg-secondary/50 border border-border rounded text-muted-foreground hover:text-foreground transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {selectedGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedGallery(null)}
          >
            <button
              onClick={() => setSelectedGallery(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-black/20 hover:bg-black/40 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-white transition-colors z-[110]"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl bg-background border border-border rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-4 bg-background border-b border-border z-20 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center shrink-0">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <h3 className="text-xl font-medium text-foreground">Project Screenshots</h3>
                  <span className="text-xs font-mono tracking-wider text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-md">
                    {currentImageIndex + 1} / {selectedGallery.length}
                  </span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end sm:mr-10">
                  <button
                    onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentImageIndex === 0}
                    className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-secondary hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors text-foreground"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => Math.min(selectedGallery.length - 1, prev + 1))}
                    disabled={currentImageIndex === selectedGallery.length - 1}
                    className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground rounded-lg transition-colors shadow-lg shadow-primary/20"
                  >
                    Next Image
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center overflow-y-auto p-4 sm:p-6 bg-secondary/10">
                <motion.div 
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full rounded-xl overflow-hidden border border-border shadow-2xl bg-background"
                >
                  <img 
                    src={selectedGallery[currentImageIndex]} 
                    alt={`Screenshot ${currentImageIndex + 1}`} 
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
