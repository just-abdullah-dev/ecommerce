"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { fetchCustom } from "@/lib/utils";
import useUser from "@/contexts/user";

export default function EditProduct({ product, onUpdate }) {
  const [name, setName] = useState(product.name);
  const [desc, setDesc] = useState(product.desc);
  const [price, setPrice] = useState(product.price.toString());
  const user = useUser();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(product.name);
    setDesc(product.desc);
    setPrice(product.price.toString());
  }, [product]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchCustom("/product", {
        method: "PUT",
        body: JSON.stringify({
          productId: product?._id,
          name,
          desc,
          price: parseFloat(price),
        }),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setName("");
        setDesc("");
        setPrice("");
        onUpdate();
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
      console.error("Error adding product:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className=" mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              placeholder="Product description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              className=" w-full"
              type="button"
              variant="destructive"
              onClick={onUpdate}
            >
              Cancel
            </Button>
            <Button className=" w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
