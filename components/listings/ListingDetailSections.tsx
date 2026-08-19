"use client";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { ReactNode } from "react";

export function ListingDetailSections({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ListingSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ScrollReveal className={className}>
      {children}
    </ScrollReveal>
  );
}
