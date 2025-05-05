"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationCard } from "./NotificationCard";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";
import { useEffect, useState } from "react";
import { useNotifications } from "@/contexts/notifications";

export default function Notifications() {
  const { newNotifications, notificationsData } = useNotifications();
  const [filter, setFilter] = useState("new");

  useEffect(() => {
    if (newNotifications === 0) {
      setFilter("all");
    } else {
      setFilter("new");
    }
  }, [newNotifications]);

  return (
    <MainDashboardContentSkeleton title="Notifications">
      <Tabs value={filter}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger
            onClick={() => {
              setFilter("new");
            }}
            value="new"
          >
            New{" "}
            <span className="ml-4 p-2 w-7 h-7 min-h-2 min-w-2 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm">
              {newNotifications}
            </span>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              setFilter("all");
            }}
            value="all"
          >
            All ({notificationsData?.length})
          </TabsTrigger>
        </TabsList>

        {filter === "new" ? (
          <TabsContent value="new">
            {notificationsData !== null &&
              notificationsData.map((notification) => {
                if (!notification?.isViewed) {
                  return (
                    <NotificationCard
                      key={notification._id}
                      {...notification}
                    />
                  );
                }
              })}
          </TabsContent>
        ) : (
          <TabsContent value="all">
            {notificationsData !== null &&
              notificationsData
                
                .map((notification) => (
                  <NotificationCard key={notification._id} {...notification} />
                ))}
          </TabsContent>
        )}
      </Tabs>
    </MainDashboardContentSkeleton>
  );
}
