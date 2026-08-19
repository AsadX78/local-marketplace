"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    title: "Browse or Post",
    desc: "Find what you need or list your item in minutes. Admin reviews every listing for safety.",
  },
  {
    icon: Shield,
    title: "Pay with Escrow",
    desc: "Buyers pay into secure escrow. Funds release only when the deal is confirmed.",
  },
  {
    icon: Star,
    title: "Rate & Trust",
    desc: "Build your reputation. Sellers earn badges, buyers shop with confidence.",
  },
];

export function HomeHowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-2xl font-bold text-gray-900 sm:text-3xl"
      >
        How LocalMarket NG Works
      </motion.h2>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 shadow-lg shadow-brand-100/50">
              <step.icon className="h-8 w-8" />
            </div>
            <div className="absolute -top-2 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-lg shadow-brand-600/30">
              {i + 1}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function HomeCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl bg-gradient-to-r from-accent-500 to-accent-600 px-8 py-12 text-center shadow-2xl shadow-accent-500/25 sm:px-16"
      >
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Ready to start selling?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-accent-50">
          Post your first listing for free. Only pay 5% when your item sells —
          the lowest fee in Nigeria.
        </p>
        <Button asChild size="lg" variant="default" className="mt-6 bg-white text-accent-700 hover:bg-accent-50 shadow-xl shadow-accent-600/30">
          <Link href="/listings/create">
            Post a Free Listing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
