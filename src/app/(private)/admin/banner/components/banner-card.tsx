"use client";

import Image from "next/image";

import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/button";
import { Switch } from "@/ui/switch";

import type { Banner } from "../data/banner";
import { deleteBanner, updateBannerStatus } from "./banner-api";

interface BannerCardProps {
  banner: Banner;
  onStatusChange?: () => void;
  onDelete?: () => void;
}

export default function BannerCard({ banner, onStatusChange, onDelete }: BannerCardProps) {
  async function handleStatusChange(isActive: boolean) {
    await updateBannerStatus(banner.id, isActive);
    onStatusChange?.();
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this banner?")) {
      await deleteBanner(banner.id);
      onDelete?.();
    }
  }

  return (
    <div className="rounded-lg border-border bg-card overflow-hidden border">
      {/* Banner Preview */}
      <div
        className="h-48 p-6 text-white relative flex w-full items-center justify-between overflow-hidden"
        style={{ background: banner.backgroundColor }}
      >
        {/* Gradient overlay */}
        <div className="inset-0 bg-black/20 absolute" />

        {/* Content */}
        <div className="space-y-2 relative z-10 flex-1">
          <h3 className="text-2xl font-bold" style={{ color: banner.textColor }}>
            {banner.title}
          </h3>
          <p className="text-sm opacity-90" style={{ color: banner.textColor }}>
            {banner.description}
          </p>
          <Button
            size="sm"
            variant="secondary"
            className="mt-3"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000"
            }}
          >
            {banner.buttonText}
          </Button>
        </div>

        {/* Image */}
        {banner.imageUrl && (
          <div className="ml-4 relative z-10 shrink-0">
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              width={192}
              height={160}
              className="h-40 w-48 rounded-lg object-cover"
            />
          </div>
        )}

        {/* Active Badge */}
        <div className="right-4 top-4 absolute z-20">
          <Badge
            variant="default"
            className={`${banner.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} ml-2 text-xs font-medium`}
          >
            {banner.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="border-border bg-muted/30 px-6 py-4 border-t">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Banner Status</p>
            <p className="text-xs text-muted-foreground">Toggle to activate/deactivate</p>
          </div>
          <div className="gap-4 flex items-center">
            <Switch
              checked={banner.isActive}
              onCheckedChange={handleStatusChange}
              aria-label="Toggle banner status"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          <p>
            Type: <span className="font-medium text-foreground">{banner.bannerType}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
