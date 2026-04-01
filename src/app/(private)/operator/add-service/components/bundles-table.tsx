"use client";

import { useEffect, useState } from "react";

import { Edit, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { Bundle } from "@/types/bundle-management";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/ui";
import { Badge } from "@/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Switch } from "@/ui/switch";

import { deleteBundle, fetchBundles, toggleBundleStatus } from "./bundle-api";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";

interface BundlesTableProps {
  onRefresh?: () => void;
  onEdit?: (bundle: Bundle) => void;
}

export default function BundlesTable({ onRefresh, onEdit }: BundlesTableProps) {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [previewSheetOpen, setPreviewSheetOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState<Bundle | null>(null);

  useEffect(() => {
    loadBundles();
  }, []);

  async function loadBundles() {
    try {
      setIsLoading(true);
      const data = await fetchBundles();
      setBundles(data);
    } catch (error) {
      console.error("Error loading bundles:", error);
      toast.error("Failed to load bundles");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleStatus(bundle: Bundle) {
    try {
      setTogglingId(bundle.id);
      const response = await toggleBundleStatus(bundle.id, !bundle.isActive);

      if (response.success) {
        setBundles((prev) =>
          prev.map((b) => (b.id === bundle.id ? { ...b, isActive: !b.isActive } : b))
        );
        toast.success(`Bundle ${!bundle.isActive ? "activated" : "deactivated"} successfully`);
      } else {
        toast.error(response.message || "Failed to update bundle");
      }
    } catch (error) {
      console.error("Error updating bundle:", error);
      toast.error("An error occurred while updating the bundle");
    } finally {
      setTogglingId(null);
    }
  }

  function handleDeleteClick(bundle: Bundle) {
    setBundleToDelete(bundle);
    setDeleteModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (!bundleToDelete) return;

    try {
      setIsDeleting(true);
      const response = await deleteBundle(bundleToDelete.id);

      if (response.success) {
        setBundles((prev) => prev.filter((b) => b.id !== bundleToDelete.id));
        toast.success("Bundle deleted successfully", { position: "top-center" });
        setPreviewSheetOpen(false);
        setSelectedBundle(null);
        onRefresh?.();
        setDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Failed to delete bundle");
      }
    } catch (error) {
      console.error("Error deleting bundle:", error);
      toast.error("An error occurred while deleting the bundle");
    } finally {
      setIsDeleting(false);
      setBundleToDelete(null);
    }
  }

  function handleViewDetails(bundle: Bundle) {
    setSelectedBundle(bundle);
    setPreviewSheetOpen(true);
  }

  const filteredBundles = bundles.filter(
    (bundle) =>
      bundle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bundle.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bundles</CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search bundles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredBundles.length === 0 ? (
            <div className="py-8 text-muted-foreground text-center">
              {searchQuery ? "No bundles found matching your search" : "No bundles available"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Bundle Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBundles.map((bundle) => (
                    <TableRow key={bundle.id}>
                      <TableCell className="font-medium">{bundle.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{bundle.description}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleViewDetails(bundle)}
                          className="text-primary hover:underline"
                        >
                          {bundle.services.length} service{bundle.services.length > 1 ? "s" : ""}
                        </button>
                      </TableCell>
                      <TableCell>${bundle.totalPrice.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">
                        ${bundle.bundlePrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {bundle.discount > 0 && (
                          <Badge variant="secondary" className="text-green-600">
                            {bundle.discount.toFixed(0)}% off
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={bundle.isActive}
                          onCheckedChange={() => handleToggleStatus(bundle)}
                          disabled={togglingId === bundle.id}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="gap-2 flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit?.(bundle)}
                            title="Edit bundle"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(bundle)}
                            title="Delete bundle"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bundle Details Sheet */}
      <Sheet open={previewSheetOpen} onOpenChange={setPreviewSheetOpen}>
        <SheetContent side="right" className="md:w-96 p-4 w-full">
          <SheetHeader className="p-0">
            <SheetTitle>Bundle Details</SheetTitle>
          </SheetHeader>
          {selectedBundle && (
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedBundle.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedBundle.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Included Services:</h4>
                <div className="space-y-2">
                  {selectedBundle.services.map((service) => (
                    <div
                      key={service.serviceId}
                      className="p-2 rounded bg-muted/50 flex items-center justify-between border"
                    >
                      <span className="text-sm">{service.serviceName}</span>
                      <span className="text-sm font-medium">
                        ${service.servicePrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="text-sm flex justify-between">
                  <span className="text-muted-foreground">Total Price:</span>
                  <span className="font-medium">${selectedBundle.totalPrice.toFixed(2)}</span>
                </div>
                <div className="text-sm flex justify-between">
                  <span className="text-muted-foreground">Bundle Price:</span>
                  <span className="font-semibold text-lg">
                    ${selectedBundle.bundlePrice.toFixed(2)}
                  </span>
                </div>
                {selectedBundle.discount > 0 && (
                  <div className="text-sm flex justify-between">
                    <span className="text-muted-foreground">You save:</span>
                    <span className="font-medium text-green-600">
                      {selectedBundle.discount.toFixed(0)}% ($
                      {(selectedBundle.totalPrice - selectedBundle.bundlePrice).toFixed(2)})
                    </span>
                  </div>
                )}
              </div>

              <div className="gap-2 pt-4 flex">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onEdit?.(selectedBundle)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteClick(selectedBundle)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Bundle"
        description={`Are you sure you want to delete the bundle "${bundleToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
}
