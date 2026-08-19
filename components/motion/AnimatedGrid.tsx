"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";

interface AnimatedGridProps {
  children: ReactNode;
  className?: string;
  cols?: string;
}

export function AnimatedGrid({ children, className, cols }: AnimatedGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className={cols || "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"}
    >
      {className
        ? <div className={className}>{children}</div>
        : children}
    </motion.div>
  );
}

export function AnimatedGridItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
