import { CategoryGrid } from "@/components/listings/CategoryGrid";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export const metadata = {
  title: "All Categories",
  description: "Browse all categories on LocalMarket NG - Nigeria's local marketplace",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            All Categories
          </h1>
          <p className="mt-3 text-gray-500">
            Explore everything you can buy and sell across Nigeria
          </p>
        </div>
      </ScrollReveal>
      <CategoryGrid />
    </div>
  );
}
