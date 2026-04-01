"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import BannerCard from "./banner-card";
import { useGetBanners } from "@/lib/actions/banner/get.banners";

export default function BannersList() {
  const { data: bannersResponse, isLoading, isError } = useGetBanners();

  const banners = bannersResponse?.data ?? [];
  const activeBannersCount = banners.filter((b) => b.isActive).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Banners</CardTitle>
            <CardDescription>
              {activeBannersCount} of {banners.length} banners are currently active
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isError ? (
           <div className="rounded-lg border-border bg-destructive/5 p-12 text-center text-destructive">
             <p>Failed to load banners. Please try again later.</p>
           </div>
        ) : isLoading ? (
           <div className="rounded-lg border-border bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground animate-pulse">Loading banners...</p>
           </div>
        ) : banners.length === 0 ? (
          <div className="rounded-lg border-border bg-muted/30 p-12 border border-dashed text-center">
            <p className="text-muted-foreground">
              No banners yet. Create your first banner to get started.
            </p>
          </div>
        ) : (
          <div className="gap-6 lg:grid-cols-2 xl:grid-cols-3 grid">
            {banners.map((banner) => (
              <BannerCard
                key={banner.id}
                banner={banner}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

