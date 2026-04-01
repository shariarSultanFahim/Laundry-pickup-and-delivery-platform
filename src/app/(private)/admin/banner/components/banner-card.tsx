"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/button";
import { Switch } from "@/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Banner } from "@/types/banner";
import { useUpdateBanner } from "@/lib/actions/banner/update.banner";
import { useDeleteBanner } from "@/lib/actions/banner/delete.banner";

interface BannerCardProps {
  banner: Banner;
}

export default function BannerCard({ banner }: BannerCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutateAsync: updateBanner } = useUpdateBanner();
  const { mutateAsync: deleteBanner, isPending: isDeleting } = useDeleteBanner();

  async function handleStatusChange(isActive: boolean) {
    try {
      await updateBanner({ id: banner.id, isActive });
      toast.success("Banner status updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update banner status");
    }
  }

  async function confirmDelete() {
    try {
      await deleteBanner(banner.id);
      toast.success("Banner deleted successfully");
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete banner");
    }
  }

  return (
    <>
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
          {banner.image && (
            <div className="ml-4 relative z-10 shrink-0">
              <Image
                src={banner.image}
                alt={banner.title}
                width={192}
                height={160}
                className="h-40 w-48 rounded-lg object-cover"
                unoptimized
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
                onClick={() => setShowDeleteDialog(true)}
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

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the banner "{banner.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
