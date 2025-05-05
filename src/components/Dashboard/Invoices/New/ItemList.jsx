import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputComp from "@/components/Utils/Input";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import useUser from "@/contexts/user";
import { fetchCustom } from "@/lib/utils";
import useCurrency from "@/hooks/useCurrency";

export default function ItemList({ items, setItems }) {
  const [products, setProducts] = useState([]);

  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: 1,
    name: "",
    desc: "",
  });
  const user = useUser();
  const currency = useCurrency();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetchCustom("/product", {
        method: "GET",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setProducts(data?.data);
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        description: error?.message,
      });
    }
  };

  const addItem = () => {
    if (!newItem.productId) {
      toast({
        title: "Error",
        description: "Select Product",
        variant: "destructive",
      });
      return;
    }

    if (
      newItem.quantity === undefined ||
      newItem.quantity === null ||
      newItem.quantity === 0
    ) {
      toast({
        title: "Error",
        description: "Quantity field must be greater than zero.",
        variant: "destructive",
      });
      return;
    }
    const product = products.find((item) => item._id === newItem.productId);
    setItems([
      ...items,
      {
        ...newItem,
        name: product.name,
        desc: product.desc,
        salePrice: product.price,
      },
    ]);
    setNewItem({ productId: "", quantity: 1 });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const truncateDescription = (desc) => {
    const words = desc.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + "...";
    }
    return desc;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-custom-gradient">Items</h3>
      {items.map((item, index) => (
        <>
          <div
            key={index}
            className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end"
          >
            <div className="col-span-2 flex items-end gap-2 w-full">
              <div className=" font-semibold pb-2">{index + 1}.</div>
              <div className="w-full">
                <Label>Product</Label>
                <Select
                  value={item.productId}
                  onValueChange={(value) =>
                    updateItem(index, "productId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem
                        key={product._id}
                        value={product._id}
                        title={
                          product.name +
                          " - " +
                          `${currency?.symbol}` +
                          product.price +
                          " - " +
                          product.desc
                        }
                      >
                        {product.name} - {currency.symbol}
                        {product.price} - {truncateDescription(product.desc)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Quantity</Label>
              <InputComp
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, "quantity", parseInt(e.target.value))
                }
              />
            </div>
            <Button variant="destructive" onClick={() => removeItem(index)}>
              Remove <Trash2 />
            </Button>
          </div>
        </>
      ))}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
        <div className="col-span-2">
          <Label>Product</Label>
          <Select
            value={newItem.productId}
            onValueChange={(value) =>
              setNewItem({ ...newItem, productId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product._id} value={product._id}>
                  {product.name} - {currency.symbol}
                  {product.price} - {truncateDescription(product.desc)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Quantity</Label>
          <InputComp
            type="number"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: parseInt(e.target.value) })
            }
          />
        </div>

        <Button onClick={addItem}>
          Add Item <Plus />
        </Button>
      </div>
    </div>
  );
}
