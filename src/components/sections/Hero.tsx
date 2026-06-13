"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ArrowRight, Mail } from "lucide-react";

import Image from "next/image";
import profilePhoto from "@/img/Photo.png";

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export function Hero({ data }: { data: import('@/types/portfolio').PortfolioData }) {
  const { heroContent, personalInfo, socialLinks } = data;
  const roles: string[] = (heroContent as { roles?: string[] }).roles ?? [
    "Full-Stack Developer",
    "Research Published Author",
    "ASP.NET Core & Angular Specialist",
  ];

  const [roleIndex, setRoleIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [roles.length]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const scrollToContent = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const nameWords = personalInfo.name.split(" ");

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  return (
    <section className="relative min-h-[96vh] flex items-center justify-center px-6 pt-[120px] pb-[100px] overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Ambient glows */}
      <div className="absolute right-[8%] top-[25%] -z-10 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
      <div className="absolute left-[5%] bottom-[15%] -z-10 w-[350px] h-[350px] rounded-full bg-cyan-600/6 blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">

        {/* Left — text content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 space-y-8 lg:pr-8"
        >
          {/* Status badge */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              {heroContent.badge}
            </span>
          </motion.div>

          {/* Name & Subtitle */}
          <div className="space-y-4">
            <h1 className="leading-[1.05] tracking-tight">
              {nameWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="inline-block mr-4 font-[family-name:var(--font-heading)] text-6xl md:text-7xl lg:text-[5.5rem] italic font-normal text-foreground"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <div className="h-6 md:h-8 overflow-hidden relative">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={roleIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm md:text-lg font-bold text-cyan-400 uppercase tracking-[0.2em] absolute w-full"
                >
                  {roles[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Impact statement */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.35 } },
            }}
            className="text-base md:text-lg text-muted-foreground max-w-xl leading-[1.8] font-normal"
          >
            {heroContent.impactStatement}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.45 } },
            }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-full px-8 py-3.5 text-sm bg-violet-500 hover:bg-violet-600 text-white shadow-lg shadow-violet-500/25 group"
            >
              Let&apos;s Collaborate
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            <a
              href={personalInfo.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 rounded-full px-8 py-3.5 text-sm border border-white/10 text-foreground hover:bg-white/5"
            >
              Download Resume
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.8, delay: 0.6 } },
            }}
            className="flex items-center gap-6 text-muted-foreground pt-4"
          >
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:scale-110 transition-all duration-200"
              aria-label="GitHub"
            >
              <GithubIcon size={22} />
            </a>
            <a
              href={socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : `https://${socialLinks.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:scale-110 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={22} />
            </a>
            <a
              href={`mailto:${socialLinks.email}`}
              className="hover:text-foreground hover:scale-110 transition-all duration-200"
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right — Portrait Image & Code Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="lg:col-span-6 relative w-full h-[380px] sm:h-[480px] md:h-[600px] mt-12 lg:mt-0"
        >
          {/* Main Portrait Container */}
          <div 
            className="absolute inset-0 rounded-3xl overflow-hidden border border-white/5 bg-white/5 pointer-events-none select-none"
            onContextMenu={(e) => e.preventDefault()}
          >
            <Image 
              src={profilePhoto}
              alt={personalInfo.name}
              fill
              className="object-cover object-top select-none pointer-events-none"
              priority
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

          {/* Badge Overlay (Bottom Left) */}
          <div className="absolute -left-2 md:-left-6 -bottom-4 bg-stone-100 dark:bg-[#09090d] border border-border px-4 py-2 md:px-5 md:py-2.5 rounded-full z-20 shadow-xl scale-90 sm:scale-100 origin-bottom-left">
            <span className="text-[10px] md:text-[11px] text-muted-foreground tracking-widest font-mono uppercase">
              code • build • impact
            </span>
          </div>

          {/* Small Code Block Overlay (Bottom Right) */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="absolute -right-2 md:-right-8 -bottom-6 md:-bottom-12 w-[240px] sm:w-[280px] md:w-[340px] bg-stone-100/95 dark:bg-[#09090d]/95 backdrop-blur-xl border border-border rounded-2xl p-4 md:p-5 shadow-2xl z-20 cursor-pointer group scale-85 sm:scale-100 origin-bottom-right"
          >
            {/* Cursor light */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(circle 200px at var(--mx,50%) var(--my,50%), rgba(124,58,237,0.1), transparent 70%)",
              }}
            />

            {/* Code block */}
            <pre className="font-mono text-[9px] md:text-[11px] leading-[1.8] text-foreground/80 overflow-hidden">
              <code>
                <span className="text-violet-600 dark:text-violet-400">const</span>{" "}
                <span className="text-blue-600 dark:text-blue-400">developer</span> = &#123;{"\n"}
                {"  "}name:{" "}
                <span className="text-emerald-600 dark:text-emerald-400">&quot;{personalInfo.name}&quot;</span>,{"\n"}
                {"  "}specialization:{" "}
                <span className="text-emerald-600 dark:text-emerald-400">&quot;ASP.NET Core&quot;</span>,{"\n"}
                {"  "}focus: [{"\n"}
                {"    "}
                <span className="text-cyan-600 dark:text-cyan-400">&quot;Scalable Web APIs&quot;</span>,{"\n"}
                {"    "}
                <span className="text-cyan-600 dark:text-cyan-400">&quot;Modern UIs&quot;</span>
                {"\n"}
                {"  "}],{"\n"}
                {"  "}tools: [
                <span className="text-violet-600 dark:text-violet-400">&quot;Angular&quot;</span>,{" "}
                <span className="text-violet-600 dark:text-violet-400">&quot;React&quot;</span>],{"\n"}
                {"  "}backend: [
                <span className="text-blue-600 dark:text-blue-400">&quot;ASP.NET Core&quot;</span>,{" "}
                <span className="text-blue-600 dark:text-blue-400">&quot;Node.js&quot;</span>],{"\n"}
                {"  "}passion:{" "}
                <span className="text-emerald-600 dark:text-emerald-400">&quot;Building impactful solutions&quot;</span>
                {"\n"}&#125;;
              </code>
            </pre>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        onClick={scrollToContent}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} className="animate-bounce" />
      </motion.button>
    </section>
  );
}
