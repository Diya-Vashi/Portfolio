"use client";

import { motion } from "framer-motion";
import type { CustomSection } from "@/types/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface DynamicSectionProps {
  section: CustomSection;
}

function fadeUpProps(i: number) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  };
}

function TextBlock({ section }: DynamicSectionProps) {
  return (
    <section id={section.slug} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading>{section.title}</SectionHeading>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-2xl p-8"
        >
          <p className="text-foreground/80 text-base md:text-lg leading-relaxed font-light whitespace-pre-wrap">
            {section.textContent}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function CardGrid({ section }: DynamicSectionProps) {
  const cards = section.cards ?? [];
  return (
    <section id={section.slug} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading>{section.title}</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              {...fadeUpProps(i)}
              className="glass-card rounded-2xl p-6 flex flex-col gap-3 group"
            >
              <h3 className="text-foreground font-medium text-lg group-hover:text-primary transition-colors">
                {card.heading}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineLayout({ section }: DynamicSectionProps) {
  const items = section.timelineItems ?? [];
  return (
    <section id={section.slug} className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeading>{section.title}</SectionHeading>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-8 pl-12">
            {items.map((item, i) => (
              <motion.div
                key={i}
                {...fadeUpProps(i)}
                className="relative"
              >
                <div className="absolute -left-9 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                  {item.date}
                </span>
                <h3 className="text-foreground font-medium mt-1 mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-light">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsRow({ section }: DynamicSectionProps) {
  const stats = section.stats ?? [];
  return (
    <section id={section.slug} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading>{section.title}</SectionHeading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              {...fadeUpProps(i)}
              className="glass-card rounded-2xl p-6 text-center flex flex-col items-center gap-2 group"
            >
              <span className="font-[family-name:var(--font-heading)] text-4xl font-light text-accent italic group-hover:scale-105 transition-transform inline-block">
                {stat.value}
              </span>
              <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageText({ section }: DynamicSectionProps) {
  const isRight = section.imagePosition === "right";
  return (
    <section id={section.slug} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading>{section.title}</SectionHeading>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`flex flex-col ${isRight ? "md:flex-row-reverse" : "md:flex-row"} gap-10 items-center`}
        >
          {section.imageUrl && (
            <div className="w-full md:w-1/2 rounded-2xl overflow-hidden">
              <img
                src={section.imageUrl}
                alt={section.imageAlt ?? section.title}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          )}
          <div className="w-full md:w-1/2 glass-card rounded-2xl p-8">
            <p className="text-foreground/80 text-base leading-relaxed font-light whitespace-pre-wrap">
              {section.textContent}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function DynamicSection({ section }: DynamicSectionProps) {
  if (!section.visible) return null;

  switch (section.layout) {
    case "text-block":
      return <TextBlock section={section} />;
    case "card-grid":
      return <CardGrid section={section} />;
    case "timeline":
      return <TimelineLayout section={section} />;
    case "stats-row":
      return <StatsRow section={section} />;
    case "image-text":
      return <ImageText section={section} />;
    default:
      return <TextBlock section={section} />;
  }
}
