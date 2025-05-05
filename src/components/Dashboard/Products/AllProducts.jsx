"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import EditProduct from "./EditProduct";
import { Card, CardContent } from "@/components/ui/card";
import useCurrency from "@/hooks/useCurrency";

import ShowError from "@/components/Utils/ShowError";
import LoadingDots from "@/components/Utils/LoadingDots";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/contexts/user";
import { toast } from "@/hooks/use-toast";
import ConfirmationDialog from "@/components/Utils/ConfirmationDialog";

export default function AllProducts() {
  const currency = useCurrency();
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const user = useUser();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom("/product", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setIsError(null);
        setProducts(data?.data);
      } else {
        setIsError(data?.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsError(error?.message);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingDots />;
  }
  if (isError) {
    return <ShowError error={isError} />;
  }

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetchCustom("/product", {
        method: "DELETE",
        token: user?.token,
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
        toast({
          variant: "custom",
          description: data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateProduct = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  if (editingProduct) {
    return (
      <EditProduct product={editingProduct} onUpdate={handleUpdateProduct} />
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Description</TableHead>
              <TableHead className="font-bold text-right">Price</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product._id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {product.desc}
                </TableCell>
                <TableCell className="text-right">
                  {currency?.symbol}&nbsp;{product.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-8 w-8" />
                    </Button>
                    <ConfirmationDialog
                      trigger={
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-8 w-8 text-red-600" />
                        </Button>
                      }
                      title="Are you sure?"
                      description="This action cannot be undone. This will permanently delete."
                      onConfirm={() => handleDelete(product._id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
