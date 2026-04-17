"use client";

import { useState } from "react";

import { toast } from "sonner";

import type { OperatorAd } from "@/types/operator-ad";

import {
  useCancelAdSubscription,
  useCreateAd,
  useCreateAdSubscriptionCheckoutSession,
  useDeleteAd,
  useDeleteMyActiveAd,
  useGetAdSubscriptionPlans,
  useGetMyActiveAd,
  useGetOperatorAds,
  useGetOperatorAdSubscriptions,
  useGetOperatorStoreServices,
  useUpdateAd
} from "@/lib/actions/operator/use-operator-ads";
import { useGetOperatorMe } from "@/lib/actions/user/get.operator-me";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/ui";

import AdManagementTable from "./ad-management-table";
import AdPlanCard from "./ad-plan-card";
import AdSubscriptionsTable from "./ad-subscriptions-table";
import PromotionForm from "./promotion-form";

const LIST_LIMIT = 10;

const getListPayload = <T,>(response?: {
  data?:
    | T[]
    | { data: T[]; meta?: { total?: number; page?: number; limit?: number; totalPage?: number } };
  meta?: { total?: number; page?: number; limit?: number; totalPage?: number };
}) => {
  if (!response?.data) {
    return { items: [] as T[], totalPage: 1 };
  }

  if (Array.isArray(response.data)) {
    const meta = response.meta;
    const limit = meta?.limit ?? LIST_LIMIT;
    const total = meta?.total ?? response.data.length;
    const totalPage = meta?.totalPage ?? Math.max(1, Math.ceil(total / limit));

    return { items: response.data, totalPage };
  }

  const items = response.data.data ?? [];
  const meta = response.data.meta;
  const limit = meta?.limit ?? LIST_LIMIT;
  const total = meta?.total ?? items.length;
  const totalPage = meta?.totalPage ?? Math.max(1, Math.ceil(total / limit));

  return { items, totalPage };
};

export default function AdsContent() {
  const [adsPage, setAdsPage] = useState(1);
  const [subscriptionsPage, setSubscriptionsPage] = useState(1);

  const { data: operatorMe } = useGetOperatorMe();
  const operatorId = operatorMe?.data.operatorProfile.id;

  const { data: plansResponse, isLoading: isPlansLoading } = useGetAdSubscriptionPlans();
  const { data: servicesResponse } = useGetOperatorStoreServices(operatorId);

  const { data: adsResponse, isLoading: isAdsLoading } = useGetOperatorAds({
    page: adsPage,
    limit: LIST_LIMIT
    // searchTerm
  });

  const { data: subscriptionsResponse, isLoading: isSubscriptionsLoading } =
    useGetOperatorAdSubscriptions({
      page: subscriptionsPage,
      limit: LIST_LIMIT
    });

  const { data: activeAdResponse, isLoading: isActiveAdLoading } = useGetMyActiveAd();

  const { mutateAsync: startCheckout, isPending: isCheckoutPending } =
    useCreateAdSubscriptionCheckoutSession();
  const { mutateAsync: createAd, isPending: isCreateAdPending } = useCreateAd();
  const { mutateAsync: deleteAd } = useDeleteAd();
  const { mutateAsync: deleteMyActiveAd, isPending: isDeletingMyActiveAd } = useDeleteMyActiveAd();
  const { mutateAsync: cancelAdSubscription, variables: cancelingSubscriptionId } =
    useCancelAdSubscription();
  const { mutateAsync: updateAd } = useUpdateAd();

  const plans = plansResponse?.data ?? [];
  const services = servicesResponse?.data ?? [];

  const { items: ads, totalPage: adsTotalPage } = getListPayload(adsResponse);

  const { items: subscriptions, totalPage: subscriptionsTotalPage } =
    getListPayload(subscriptionsResponse);

  const activeAd = activeAdResponse?.data ?? null;
  const hasActiveAd = Boolean(activeAd?.id);
  const hasActiveSubscription =
    Boolean(operatorMe?.data?.isSubscribed) ||
    subscriptions.some((subscription) => subscription.status === "ACTIVE");

  const handleBuyPlan = async (planId: string) => {
    if (hasActiveSubscription) {
      toast.info("You already have an active subscription plan.", { position: "top-center" });
      return;
    }

    try {
      const response = await startCheckout({ planId });
      const checkoutUrl = response.data.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      toast.error("Checkout URL was not returned.", { position: "top-center" });
    } catch (error) {
      toast.error((error as Error).message || "Failed to create checkout session.", {
        position: "top-center"
      });
    }
  };

  const handleCreateAd = async (payload: { storeServiceId?: string; planId?: string }) => {
    if (hasActiveAd) {
      toast.error("You already have an active ad. Cancel it before creating a new one.", {
        position: "top-center"
      });
      return;
    }

    try {
      const response = await createAd(payload);
      const result = response.data;

      if ("type" in result && result.type === "PAYMENT_REQUIRED") {
        window.location.href = result.checkoutUrl;
        return;
      }

      toast.success("Ad created successfully.", { position: "top-center" });
    } catch (error) {
      toast.error((error as Error).message || "Failed to create ad.", {
        position: "top-center"
      });
    }
  };

  const handleToggleStatus = async (ad: OperatorAd) => {
    try {
      await updateAd({
        adId: ad.id,
        payload: {
          status: ad.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
        }
      });
      toast.success("Ad status updated.", { position: "top-center" });
    } catch (error) {
      toast.error((error as Error).message || "Failed to update ad status.", {
        position: "top-center"
      });
    }
  };

  const handleDeleteAd = async (adId: string) => {
    try {
      await deleteAd(adId);
      toast.success("Ad deleted successfully.", { position: "top-center" });
    } catch (error) {
      toast.error((error as Error).message || "Failed to delete ad.", { position: "top-center" });
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      await cancelAdSubscription(subscriptionId);
      toast.success("Subscription canceled. Linked active ads were expired.", {
        position: "top-center"
      });
    } catch (error) {
      toast.error((error as Error).message || "Failed to cancel subscription.", {
        position: "top-center"
      });
    }
  };

  const handleDeleteMyActiveAd = async () => {
    try {
      await deleteMyActiveAd();
      toast.success("Active ad canceled successfully.", { position: "top-center" });
    } catch (error) {
      toast.error((error as Error).message || "Failed to cancel active ad.", {
        position: "top-center"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="manage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manage">Manage Ads</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          <div className="gap-4 lg:grid-cols-3 grid grid-cols-1">
            {isPlansLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Card key={`plan-skeleton-${index}`}>
                    <CardContent className="space-y-3 p-6">
                      <Skeleton className="h-5 w-36" />
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-9 w-full" />
                    </CardContent>
                  </Card>
                ))
              : plans.map((plan) => (
                  <AdPlanCard
                    key={plan.id}
                    plan={plan}
                    isLoading={isCheckoutPending}
                    hasActiveSubscription={hasActiveSubscription}
                    onBuy={handleBuyPlan}
                  />
                ))}
          </div>

          {hasActiveAd ? (
            <Card>
              <CardHeader>
                <CardTitle>Active Ad</CardTitle>
              </CardHeader>
              <CardContent className="gap-3 sm:flex-row flex flex-col items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm">
                    Active ad ID: <span className="font-medium">{activeAd?.id}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created at:{" "}
                    {activeAd?.createdAt ? new Date(activeAd.createdAt).toLocaleString() : "-"}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteMyActiveAd}
                  disabled={isDeletingMyActiveAd || isActiveAdLoading}
                >
                  {isDeletingMyActiveAd ? "Canceling..." : "Cancel Active Ad"}
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <PromotionForm
            services={services}
            plans={plans}
            isSubmitting={isCreateAdPending}
            disabled={hasActiveAd}
            disabledMessage={
              hasActiveAd
                ? "You already have an active ad. Cancel it first to create a new one."
                : undefined
            }
            onSubmit={handleCreateAd}
          />

          <AdManagementTable
            ads={ads}
            isLoading={isAdsLoading}
            page={adsPage}
            totalPage={adsTotalPage}
            setPage={setAdsPage}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteAd}
          />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <AdSubscriptionsTable
            subscriptions={subscriptions}
            isLoading={isSubscriptionsLoading}
            cancelingId={
              typeof cancelingSubscriptionId === "string" ? cancelingSubscriptionId : undefined
            }
            page={subscriptionsPage}
            totalPage={subscriptionsTotalPage}
            setPage={setSubscriptionsPage}
            onCancel={handleCancelSubscription}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
