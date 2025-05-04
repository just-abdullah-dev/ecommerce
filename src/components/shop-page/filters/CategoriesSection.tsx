import Link from "next/link";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

type Category = {
  title: string;
  slug: string;
};
const categoriesData: Category[] = [
  {
    title: "Men's Fragrances",
    slug: "/shop?category=mens-fragrances",
  },
  {
    title: "Women's Fragrances",
    slug: "/shop?category=womens-fragrances",
  },
  {
    title: "Unisex Scents",
    slug: "/shop?category=unisex-scents",
  },
  {
    title: "Attars (Itr)",
    slug: "/shop?category=attars",
  },
  {
    title: "Bakhoor & Oud",
    slug: "/shop?category=bakhoor-oud",
  },
];


const CategoriesSection = () => {
  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      {categoriesData.map((category, idx) => (
        <Link
          key={idx}
          href={category.slug}
          className="flex items-center justify-between py-2"
        >
          {category.title} <MdKeyboardArrowRight />
        </Link>
      ))}
    </div>
  );
};

export default CategoriesSection;
