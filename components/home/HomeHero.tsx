"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Shield, Zap, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800">
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" as const }}
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], y: [0, -10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" as const }}
          className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <Star className="h-4 w-4 text-accent-300" />
            Nigeria&apos;s fastest-growing marketplace
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Buy &amp; Sell Anything,
            <br />
            <span className="text-accent-300">Anywhere in Nigeria</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-lg text-brand-100">
            From phones in Lagos to land in Kano. Safe escrow payments, verified
            sellers, and zero listing fees. We only take 5% when you sell.
          </motion.p>

          <motion.form
            variants={fadeUp}
            action="/listings"
            method="GET"
            className="mt-8 flex max-w-xl gap-2 rounded-2xl bg-white p-2 shadow-xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                name="q"
                placeholder="What are you looking for?"
                className="h-12 w-full rounded-xl pl-10 pr-4 text-gray-900 focus:outline-none"
              />
            </div>
            <Button type="submit" variant="brand" size="lg" className="px-6 shadow-lg shadow-brand-600/30">
              Search
            </Button>
          </motion.form>

          <motion.div variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-100">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> 37 states covered
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" /> Escrow-protected
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4" /> Instant chat
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
