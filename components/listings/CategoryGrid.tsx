"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Smartphone,
  Car,
  Shirt,
  Home,
  Building,
  Briefcase,
  Wrench,
  Leaf,
  Book,
  Dumbbell,
  Baby,
  PawPrint,
  Factory,
  Palette,
  Ticket,
  HeartPulse,
  MoreHorizontal,
} from "lucide-react";
import { CATEGORY_SEED } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone,
  car: Car,
  shirt: Shirt,
  home: Home,
  building: Building,
  briefcase: Briefcase,
  wrench: Wrench,
  leaf: Leaf,
  book: Book,
  dumbbell: Dumbbell,
  baby: Baby,
  "paw-print": PawPrint,
  factory: Factory,
  palette: Palette,
  ticket: Ticket,
  "heart-pulse": HeartPulse,
  "more-horizontal": MoreHorizontal,
};

export function CategoryGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } },
      }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      {CATEGORY_SEED.map((cat) => {
        const Icon = iconMap[cat.icon] || MoreHorizontal;
        return (
          <motion.div
            key={cat.slug}
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
            }}
          >
            <Link
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-brand-300 hover:bg-brand-50 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-200">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {cat.name.en}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
