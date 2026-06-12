import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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

export const metadata: Metadata = {
  title: "Diya Vashi",
  description:
    "Full-Stack Developer specializing in Angular, ASP.NET Core, Node.js and MySQL. MCA student at SRIMCA Bardoli. Research published at ISTE and Springer.",
  keywords: [
    "Diya Vashi",
    "Full Stack Developer",
    "Angular",
    "ASP.NET Core",
    "Node.js",
    "MySQL",
    "Portfolio",
    "SRIMCA",
    "Bardoli",
  ],
  authors: [{ name: "Diya Vashi" }],
  openGraph: {
    title: "Diya Vashi",
    description:
      "Full-Stack Developer specializing in Angular, ASP.NET Core, Node.js and MySQL.",
    type: "website",
    locale: "en_US",
    siteName: "Diya Vashi Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diya Vashi",
    description:
      "Full-Stack Developer specializing in Angular, ASP.NET Core, Node.js and MySQL.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${cormorant.variable} font-sans min-h-screen flex flex-col antialiased bg-background text-foreground relative overflow-x-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1000px] overflow-hidden">
            <div className="absolute left-[10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px] mesh-glow dark:bg-violet-600/8" />
            <div className="absolute right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[100px] mesh-glow dark:bg-cyan-500/4" />
          </div>
          
          <Navbar />
          
          {/* Main Content Area - flex-grow pushes footer down naturally */}
          <main className="flex-grow flex-1 relative w-full">
            {children}
          </main>
          
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}