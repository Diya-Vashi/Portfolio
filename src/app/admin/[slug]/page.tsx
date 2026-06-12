import React from "react";
import PortfolioEditor from "@/components/admin/PortfolioEditor";

export default async function AdminContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  // Pass the slug to the editor to open the right tab
  return <PortfolioEditor initialTab={resolvedParams.slug} />;
}
