"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useCompany } from "@/contexts/company";

export function SubscriptionDetails() {
  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const { company } = useCompany();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-custom-gradient font-bold">
            Subscription Details
          </CardTitle>
          <Badge
            variant={
              company?.subscriptionId?.status === "active"
                ? "default"
                : "secondary"
            }
          >
            {company?.subscriptionId?.status.charAt(0).toUpperCase() +
              company?.subscriptionId?.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Fee
            </h3>
            <p className="text-2xl font-semibold">
              ${company?.subscriptionId?.totalFee}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Screens
            </h3>
            <p className="text-2xl font-semibold">
              {company?.subscriptionId?.screens}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Duration
            </h3>
            <p className="text-2xl font-semibold">
              {company?.subscriptionId?.noOfMonths} month(s)
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Subscription Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Start Date
              </h4>
              <p className="text-base">
                {formatDate(company?.subscriptionId?.startDate)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                End Date
              </h4>
              <p className="text-base">
                {formatDate(company?.subscriptionId?.endDate)}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Plan Track</h3>
          {company?.subscriptionId?.planTrack.map((track, index) => (
            <Card key={track._id}>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Period
                    </h4>
                    <p className="text-sm">
                      {formatDate(track.startDate)} -{" "}
                      {formatDate(track.endDate)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Fee
                    </h4>
                    <p className="text-sm">${track.totalFee}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Transaction ID
                    </h4>
                    <p className="text-sm">{track.transactionId}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Screens
                    </h4>
                    <p className="text-sm">{track.screens}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Created: {formatDate(company?.subscriptionId?.createdAt)}</p>
          <p>Last Updated: {formatDate(company?.subscriptionId?.updatedAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
