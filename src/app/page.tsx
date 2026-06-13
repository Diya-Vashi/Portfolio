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
import { getPortfolioData } from "@/data/portfolio";
import type { CustomSection } from "@/types/portfolio";

export const dynamic = 'force-dynamic';

const SECTION_MAP: Record<string, React.FC<any>> = {
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

export default async function Home() {
  const data = await getPortfolioData();
  const visibility = data.siteSettings.sectionVisibility as Record<string, boolean>;
  const order = data.siteSettings.sectionOrder as string[];
  const customSections = (data.customSections || []) as unknown as CustomSection[];

  const visibleCustom = customSections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {order.map((sectionId) => {
        if (!visibility[sectionId]) return null;
        const SectionComponent = SECTION_MAP[sectionId];
        if (!SectionComponent) return null;
        return <SectionComponent key={sectionId} data={data} />;
      })}
      {visibleCustom.map((section) => (
        <DynamicSection key={section.id} section={section} />
      ))}
    </>
  );
}
