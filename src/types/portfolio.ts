export interface PersonalInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  resumeLink: string;
}

export interface HeroContent {
  badge: string;
  subtitle: string;
  impactStatement: string;
  roles: string[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface AboutContent {
  blueprintText: string[];
  researchText: string[];
  researchBadge: string;
  stats: Stat[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface SkillsContent {
  categories: SkillCategory[];
}

export interface ExperienceContent {
  company: string;
  role: string;
  duration: string;
  location: string;
  tech: string[];
  bullets: string[];
}

export interface Conference {
  name: string;
  location: string;
  year: string;
  type: string;
  publisher?: string;
}

export interface Project {
  title: string;
  subtitle: string;
  tags: string[];
  isFeatured: boolean;
  hasResearchPublished: boolean;
  bullets: string[];
  conferences: Conference[];
  githubLink: string;
  liveDemoLink: string;
  image?: string;
}

export interface Publication {
  title: string;
  conference?: string;
  institution?: string;
  organizer?: string;
  location?: string;
  date: string;
  publisher?: string;
  badge: string;
}

export interface Certification {
  name: string;
  issuer: string;
  badge: string;
  credentialLink: string;
}

export interface Education {
  degree: string;
  institution: string;
  duration: string;
  cgpa: string;
  status: string;
}

export interface ContactContent {
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  formspreeUrl: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export type CustomSectionLayout =
  | "text-block"
  | "card-grid"
  | "timeline"
  | "stats-row"
  | "image-text";

export interface CustomSectionCardItem {
  heading: string;
  body: string;
}

export interface CustomSectionTimelineItem {
  date: string;
  title: string;
  description: string;
}

export interface CustomSectionStatItem {
  value: string;
  label: string;
}

export interface CustomSection {
  id: string;
  slug: string;
  title: string;
  layout: CustomSectionLayout;
  visible: boolean;
  order: number;
  textContent?: string;
  cards?: CustomSectionCardItem[];
  timelineItems?: CustomSectionTimelineItem[];
  stats?: CustomSectionStatItem[];
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
}

export type FontPair = "dm-sans-cormorant" | "inter-playfair" | "geist-lora";

export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  skills: boolean;
  experience: boolean;
  projects: boolean;
  research: boolean;
  certifications: boolean;
  education: boolean;
  contact: boolean;
  [key: string]: boolean;
}

export interface SiteSettings {
  title: string;
  description: string;
  faviconUrl: string;
  ogImageUrl: string;
  accentColor: string;
  fontPair: FontPair;
  sectionVisibility: SectionVisibility;
  sectionOrder: string[];
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  uploadedAt: string;
}

export interface PortfolioData {
  siteSettings: SiteSettings;
  personalInfo: PersonalInfo;
  heroContent: HeroContent;
  aboutContent: AboutContent;
  skillsContent: SkillsContent;
  experienceContent: ExperienceContent[];
  projectsContent: Project[];
  publicationsContent: Publication[];
  certificationsContent: Certification[];
  educationContent: Education[];
  contactContent: ContactContent;
  socialLinks: SocialLinks;
  navLinks: NavLink[];
  customSections: CustomSection[];
  mediaAssets: MediaAsset[];
}
