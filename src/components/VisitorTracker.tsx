"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track if we haven't tracked this path yet to avoid double counting in dev React strict mode
    if (pathname && trackedPath.current !== pathname) {
      trackedPath.current = pathname;
      
      fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pathname }),
      }).catch(err => {
        console.error("Failed to track visit:", err);
      });
    }
  }, [pathname]);

  return null;
}
