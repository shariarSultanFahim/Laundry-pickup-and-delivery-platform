"use client";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";

import { defaultBanners, type Banner } from "../data/banner";
import BannerCard from "./banner-card";

interface BannersListProps {
  onRefresh?: () => void;
}

export default function BannersList({ onRefresh }: BannersListProps) {
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);

  function handleStatusChange(bannerId: string) {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === bannerId ? { ...banner, isActive: !banner.isActive } : banner
      )
    );
    onRefresh?.();
  }

  function handleDelete(bannerId: string) {
    setBanners((prev) => prev.filter((banner) => banner.id !== bannerId));
    onRefresh?.();
  }

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
        {banners.length === 0 ? (
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
                onStatusChange={() => handleStatusChange(banner.id)}
                onDelete={() => handleDelete(banner.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
