"use client";

import React, { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Smartphone, Tablet, Monitor, ExternalLink } from "lucide-react";

export default function PreviewPage() {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");

  const getDeviceStyle = () => {
    switch (device) {
      case "mobile":
        return { width: "375px", height: "812px", borderRadius: "36px" };
      case "tablet":
        return { width: "768px", height: "1024px", borderRadius: "24px" };
      case "desktop":
      default:
        return { width: "100%", height: "100%", borderRadius: "12px" };
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header & Controls */}
      <div className="p-6 border-b border-border bg-background/50 backdrop-blur-sm flex justify-between items-center z-10">
        <div>
          <SectionHeading>Live Device Preview</SectionHeading>
          <p className="text-sm text-muted-foreground mt-1">
            See how your portfolio looks across different screen sizes.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-secondary/50 border border-border rounded-xl">
            <button
              onClick={() => setDevice("mobile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                device === "mobile" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone size={16} />
              <span className="hidden sm:inline">Mobile</span>
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                device === "tablet" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Tablet size={16} />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDevice("desktop")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                device === "desktop" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor size={16} />
              <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>

          <a 
            href="/" 
            target="_blank" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            <ExternalLink size={16} />
            <span className="hidden sm:inline">Open in New Tab</span>
          </a>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-secondary/20 p-8 flex justify-center overflow-y-auto items-start custom-scrollbar">
        <div 
          className={`bg-background border-[8px] border-secondary overflow-hidden shadow-2xl transition-all duration-500 ease-in-out ${
            device !== "desktop" ? "my-8" : ""
          }`}
          style={getDeviceStyle()}
        >
          <iframe 
            src="/" 
            title="Portfolio Live Preview"
            className="w-full h-full border-none bg-background"
          />
        </div>
      </div>
    </div>
  );
}
