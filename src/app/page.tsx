"use client";

import ProductListSec from "@/components/common/ProductListSec";
import Brands from "@/components/homepage/Brands";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";
import { useEffect, useState } from "react";

export const newArrivalsData: Product[] = [
  {
    id: 1,
    title: "Aventus Inspired by Creed",
    srcUrl: "/images/products/pic1.jpg",
    gallery: ["/images/products/pic1.jpg", "/images/products/pic10.jpg", "/images/products/pic11.jpg"],
    price: 1499,
    discount: { amount: 0, percentage: 0 },
    rating: 4.5,
  },
  {
    id: 2,
    title: "White Oudh Intense",
    srcUrl: "/images/products/pic2.jpg",
    gallery: ["/images/products/pic2.jpg"],
    price: 1399,
    discount: { amount: 0, percentage: 20 },
    rating: 3.5,
  },
  {
    id: 3,
    title: "Gucci Flora Bloom",
    srcUrl: "/images/products/pic3.jpg",
    gallery: ["/images/products/pic3.jpg"],
    price: 1380,
    discount: { amount: 0, percentage: 0 },
    rating: 4.5,
  },
  {
    id: 4,
    title: "Velvet Rose by Tom Ford",
    srcUrl: "/images/products/pic4.jpg",
    gallery: ["/images/products/pic4.jpg", "/images/products/pic10.jpg", "/images/products/pic11.jpg"],
    price: 1450,
    discount: { amount: 0, percentage: 30 },
    rating: 4.5,
  },
];


export const topSellingData: Product[] = [
  {
    id: 5,
    title: "Spice Bomb Noir",
    srcUrl: "/images/products/pic5.jpg",
    gallery: ["/images/products/pic5.jpg", "/images/products/pic10.jpg", "/images/products/pic11.jpg"],
    price: 1550,
    discount: { amount: 0, percentage: 20 },
    rating: 5.0,
  },
  {
    id: 6,
    title: "Citrus Woods – Fresh Essence",
    srcUrl: "/images/products/pic6.jpg",
    gallery: ["/images/products/pic6.jpg", "/images/products/pic10.jpg", "/images/products/pic11.jpg"],
    price: 1310,
    discount: { amount: 0, percentage: 0 },
    rating: 4.0,
  },
  {
    id: 7,
    title: "Amber Oud Luxe",
    srcUrl: "/images/products/pic7.jpg",
    gallery: ["/images/products/pic7.jpg"],
    price: 1299,
    discount: { amount: 0, percentage: 0 },
    rating: 3.0,
  },
  {
    id: 8,
    title: "Oud Wood by Tom Essence",
    srcUrl: "/images/products/pic8.jpg",
    gallery: ["/images/products/pic8.jpg"],
    price: 1540,
    discount: { amount: 0, percentage: 0 },
    rating: 4.5,
  },
];


export const relatedProductData: Product[] = [
  {
    id: 12,
    title: "La Nuit by YSL Type",
    srcUrl: "/images/products/pic12.jpg",
    gallery: ["/images/products/pic12.jpg", "/images/products/pic10.jpg", "/images/products/pic11.jpg"],
    price: 1429,
    discount: { amount: 0, percentage: 20 },
    rating: 4.0,
  },
  {
    id: 13,
    title: "Rose Elixir – Inspired by Miss Dior",
    srcUrl: "/images/products/pic13.jpg",
    gallery: ["/images/products/pic13.jpg", "/images/products/pic10.jpg", "/images/products/pic11.jpg"],
    price: 1370,
    discount: { amount: 0, percentage: 0 },
    rating: 3.5,
  },
  {
    id: 14,
    title: "Musk Royale – Signature Scent",
    srcUrl: "/images/products/pic14.jpg",
    gallery: ["/images/products/pic14.jpg"],
    price: 1385,
    discount: { amount: 0, percentage: 0 },
    rating: 4.5,
  },
  {
    id: 15,
    title: "Black Vanilla Noir",
    srcUrl: "/images/products/pic15.jpg",
    gallery: ["/images/products/pic15.jpg"],
    price: 1410,
    discount: { amount: 0, percentage: 30 },
    rating: 5.0,
  },
];


export const reviewsData: Review[] = [
  {
    id: 1,
    user: "Ahmed R.",
    content: `"MashaAllah, the White Oudh is amazing. Long-lasting and perfect for Jummah and special gatherings."`,
    rating: 5,
    date: "March 12, 2024",
  },
  {
    id: 2,
    user: "Fatima Z.",
    content: `"I wear the Rose Musk Attar daily. It's soft, feminine, and I always get compliments at work and family events!"`,
    rating: 5,
    date: "March 14, 2024",
  },
  {
    id: 3,
    user: "Bilal A.",
    content: `"Alhamdulillah, this is the best Oud I’ve bought. Feels premium and gives a very calming vibe, especially during Tahajjud."`,
    rating: 5,
    date: "March 16, 2024",
  },
  {
    id: 4,
    user: "Ayesha N.",
    content: `"The blend of Amber and Jasmine is so elegant. It’s now my go-to for weddings and Eid!"`,
    rating: 5,
    date: "March 18, 2024",
  },
  {
    id: 5,
    user: "Hassan M.",
    content: `"This Attar reminds me of Madinah. SubhanAllah, such a beautiful and spiritual scent."`,
    rating: 5,
    date: "March 20, 2024",
  },
  {
    id: 6,
    user: "Zainab K.",
    content: `"Wearing this floral attar gives me a peaceful feeling. It’s subtle but powerful – perfect for daily use."`,
    rating: 5,
    date: "March 22, 2024",
  },
];



export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(()=>{
    const fetchProducts = async () => {
      const res = await fetch("/api/v1/product?storeId=6815dc804f082dbe8174f334", { cache: "no-store" });
      const data = await res.json();
      setProducts(data?.data);
    }
    fetchProducts();

  },[])
  console.log(products);
  
  
  return (
    <>
      <Header />
      <Brands />
      <main className="my-[50px] sm:my-[72px]">
        <ProductListSec
          title="NEW ARRIVALS"
          data={products}
          viewAllLink="/shop#new-arrivals"
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec
            title="top selling"
            data={products}
            viewAllLink="/shop#top-selling"
          />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <DressStyle />
        </div>
        <Reviews data={reviewsData} />
      </main>
    </>
  );
}
