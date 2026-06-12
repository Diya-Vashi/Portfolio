import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Research } from "@/components/sections/Research";
import { Certifications } from "@/components/sections/Certifications";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { DynamicSection } from "@/components/DynamicSection";
import { siteSettings, customSections as rawCustomSections } from "@/data/portfolio";
import type { CustomSection } from "@/types/portfolio";

const customSections = rawCustomSections as unknown as CustomSection[];

const SECTION_MAP: Record<string, React.FC> = {
  hero: Hero,
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  research: Research,
  certifications: Certifications,
  education: Education,
  contact: Contact,
};

export default function Home() {
  const visibility = siteSettings.sectionVisibility as Record<string, boolean>;
  const order = siteSettings.sectionOrder;

  const visibleCustom = customSections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {order.map((sectionId) => {
        if (!visibility[sectionId]) return null;
        const SectionComponent = SECTION_MAP[sectionId];
        if (!SectionComponent) return null;
        return <SectionComponent key={sectionId} />;
      })}
      {visibleCustom.map((section) => (
        <DynamicSection key={section.id} section={section} />
      ))}
    </>
  );
}
