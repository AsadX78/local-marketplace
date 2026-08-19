"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ListingCard } from "@/components/listings/ListingCard";
import type { Listing } from "@/lib/types";

export function ListingsResults({ listings }: { listings: Listing[] }) {
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
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      {listings.map((listing) => (
        <motion.div
          key={listing.id}
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.97 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
          }}
        >
          <ListingCard listing={listing} />
        </motion.div>
      ))}
    </motion.div>
  );
}
