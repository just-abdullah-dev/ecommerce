"use client";

import { useState } from "react";
import AllProducts from "./AllProducts";
import AddProduct from "./AddProduct";
import { Button } from "@/components/ui/button";
import { Plus, Upload, X } from "lucide-react";
import Link from "next/link";
import useIsMobile from "@/hooks/useIsMobile";

export default function Products() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const refreshProducts = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowAddProduct(false);
  };
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto py-10 bg-transparent">
      <div className="flex justify-between md:items-center mb-6 px-4 flex-col md:flex-row gap-3">
        <h1 className="db-title text-custom-gradient">
          {showAddProduct ? "Add Product" : "Products"}
        </h1>
        <div className=" flex items-center gap-4 flex-row-reverse">
          {showAddProduct ? (
            <Button
            size={isMobile ? "xs":"default"}
              variant="destructive"
              onClick={() => setShowAddProduct(false)}
            >
              Close <X />
            </Button>
          ) : (
            <Button
            size={isMobile ? "xs":"default"} onClick={() => setShowAddProduct(true)}>
              Add Product <Plus />{" "}
            </Button>
          )}
          <Link href={"/dashboard/products/bulk-import"} className=" ">
            <Button
            size={isMobile ? "xs":"default"}>
              Bulk Import <Upload />
            </Button>
          </Link>
        </div>
      </div>
      {showAddProduct ? (
        <AddProduct onProductAdded={refreshProducts} />
      ) : (
        <AllProducts key={refreshTrigger} />
      )}
    </div>
  );
}
