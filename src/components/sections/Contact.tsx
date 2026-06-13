"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { Mail, Phone, MapPin, Send } from "lucide-react";

const LinkedinIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export function Contact({ data }: { data: import('@/types/portfolio').PortfolioData }) {
  const { contactContent, personalInfo, siteSettings } = data;
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const dataObj = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataObj),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-[120px] px-6 relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute right-[-10%] top-[40%] -z-10 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading>{siteSettings?.contactTitle || "Let's Build Something Together"}</SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Contact details */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-secondary/40 border border-border mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </span>
              <span className="text-xs font-mono tracking-wider text-muted-foreground uppercase">Open to new initiatives</span>
            </div>

            <div className="space-y-4">
              
              <div className="flex items-center gap-4 p-5 glass-card rounded-2xl group hover:border-primary/20">
                <div className="p-3 bg-secondary border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 rounded-xl">
                  <Mail className="text-primary" size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-muted-foreground/60 uppercase mb-0.5">Email</p>
                  <a
                    href={`mailto:${contactContent.email}`}
                    className="text-foreground/80 hover:text-primary transition-colors font-normal text-sm md:text-base cursor-pointer"
                  >
                    {contactContent.email}
                  </a>
                </div>
              </div>


              <div className="flex items-center gap-4 p-5 glass-card rounded-2xl group hover:border-primary/20">
                <div className="p-3 bg-secondary border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 rounded-xl">
                  <LinkedinIcon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-muted-foreground/60 uppercase mb-0.5">LinkedIn</p>
                  <a
                    href={contactContent.linkedin.startsWith('http') ? contactContent.linkedin : `https://${contactContent.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:text-primary transition-colors font-normal text-sm md:text-base cursor-pointer"
                  >
                    {contactContent.linkedin.replace("linkedin.com/in/", "")}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 glass-card rounded-2xl group">
                <div className="p-3 bg-secondary border border-border rounded-xl">
                  <MapPin className="text-accent" size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-muted-foreground/60 uppercase mb-0.5">Location</p>
                  <p className="text-foreground/80 font-normal text-sm md:text-base">{contactContent.location}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-2xl p-6 md:p-8"
            >
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-foreground focus:border-primary/50 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-muted-foreground/45"
                    placeholder={personalInfo.name}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-foreground focus:border-primary/50 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-muted-foreground/45"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-2">
                    Subject / Goal
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="general">General Collaboration</option>
                      <option value="job">Immediate Recruitment</option>
                      <option value="freelance">Freelance Initiatives</option>
                      <option value="research">Academic Research</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground/70">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-2">
                    Message Detail *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-foreground focus:border-primary/50 focus:ring-primary/10 focus:outline-none transition-all resize-none placeholder:text-muted-foreground/45"
                    placeholder="Tell me about your product requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="w-full inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 rounded-xl px-7 py-3 text-sm bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 hover:shadow-primary/30 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "idle" && (
                    <>
                      Send Message
                      <Send size={15} />
                    </>
                  )}
                  {status === "loading" && "Sending..."}
                  {status === "success" && "Message Sent!"}
                  {status === "error" && "Error - Try Again"}
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
