import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { VisitorTracker } from "@/components/VisitorTracker";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

import { getPortfolioData } from "@/data/portfolio";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://diya-vashi.net";
  const faviconUrl = data.siteSettings.faviconUrl || "/favicon.ico";

  return {
    title: data.siteSettings.title || data.personalInfo.name,
    description: data.siteSettings.description || `Portfolio of ${data.personalInfo.name}`,
    metadataBase: new URL(siteUrl),
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    keywords: [
      data.personalInfo.name,
      "Full Stack Developer",
      "Angular",
      "ASP.NET Core",
      "Node.js",
      "MySQL",
      "Portfolio",
      "SRIMCA",
      "Bardoli",
    ],
    authors: [{ name: data.personalInfo.name }],
    openGraph: {
      title: data.siteSettings.title || data.personalInfo.name,
      description: data.siteSettings.description || `Portfolio of ${data.personalInfo.name}`,
      type: "website",
      locale: "en_US",
      siteName: `${data.personalInfo.name} Portfolio`,
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: data.siteSettings.title || data.personalInfo.name,
      description: data.siteSettings.description || `Portfolio of ${data.personalInfo.name}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getPortfolioData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${cormorant.variable} font-sans min-h-screen flex flex-col antialiased bg-background text-foreground relative overflow-x-hidden`}
      >
        <VisitorTracker />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1000px] overflow-hidden">
            <div className="absolute left-[10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px] mesh-glow dark:bg-violet-600/8" />
            <div className="absolute right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[100px] mesh-glow dark:bg-cyan-500/4" />
          </div>
          
          <Navbar navLinks={data.navLinks} personalInfo={data.personalInfo} />
          
          {/* Main Content Area - flex-grow pushes footer down naturally */}
          <main className="flex-grow flex-1 relative w-full">
            {children}
          </main>
          
          <Footer socialLinks={data.socialLinks} personalInfo={data.personalInfo} />
        </ThemeProvider>
      </body>
    </html>
  );
}