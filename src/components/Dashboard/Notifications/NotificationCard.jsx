import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import useUser from "@/contexts/user";
import { fetchCustom, formatDateAndTime } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export function NotificationCard({
  title,
  message,
  link,
  createdAt,
  isViewed,
  _id,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const handleMarkAsViewed = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustom(`/notification?_id=${_id}`, {
        method: "PUT",
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        toast({
          variant: "custom",
          description: data?.message,
        });
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
      toast({
        variant: "destructive",
        description: error?.message,
      });
    }
    setIsLoading(false);
  };
  return (
    <Card className={`mb-4 relative ${isViewed ? "bg-gray-50" : "bg-white"}`}>
      <CardHeader>
        {link ? (
          <Link href={link}>
            <CardTitle className="text-lg">{title}</CardTitle>
          </Link>
        ) : (
          <CardTitle className="text-lg">{title}</CardTitle>
        )}
        <CardDescription>{formatDateAndTime(createdAt)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{message}</p>
        {!isViewed && (
          <>
            <button
              disabled={isLoading}
              onClick={handleMarkAsViewed}
              className="inline-flex absolute top-4 right-20 items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-orange-500 ring-1 ring-inset ring-blue-700/10 float-right cursor-pointer disabled:opacity-50 disabled:cursor-progress"
            >
              Mark as Viewed
            </button>
            <span className="inline-flex absolute top-4 right-4 items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 float-right">
              New
            </span>
          </>
        )}
      </CardContent>
    </Card>
  );
}
