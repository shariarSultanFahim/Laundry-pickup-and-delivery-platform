"use client";

import { useState } from "react";
import { Edit, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

import { useDebounce } from "@/hooks/use-debounce";
import { useGetBundles } from "@/lib/actions/bundle/get.bundles";
import { useUpdateBundle } from "@/lib/actions/bundle/update.bundle";
import { useDeleteBundle } from "@/lib/actions/bundle/delete.bundle";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { Bundle } from "@/types/bundle-management";

interface BundlesTableProps {
  onRefresh?: () => void;
  onEdit?: (bundle: Bundle) => void;
}

export default function BundlesTable({ onEdit }: BundlesTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [previewSheetOpen, setPreviewSheetOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState<Bundle | null>(null);

  const { data: bundlesResponse, isLoading } = useGetBundles({
    page,
    limit,
    searchTerm: debouncedSearch || undefined
  });

  const { mutateAsync: updateBundle } = useUpdateBundle();
  const { mutateAsync: deleteBundle, isPending: isDeleting } = useDeleteBundle();

  const bundles = bundlesResponse?.data ?? [];
  const meta = bundlesResponse?.meta;

  async function handleToggleStatus(bundle: Bundle) {
    try {
      setTogglingId(bundle.id);
      await updateBundle({
        id: bundle.id,
        payload: { isActive: !bundle.isActive }
      });
      toast.success(`Bundle ${!bundle.isActive ? "activated" : "deactivated"} successfully`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update bundle");
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
      await deleteBundle(bundleToDelete.id);
      toast.success("Bundle deleted successfully", { position: "top-center" });
      setPreviewSheetOpen(false);
      setSelectedBundle(null);
      setDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete bundle");
    } finally {
      setBundleToDelete(null);
    }
  }

  function handleViewDetails(bundle: Bundle) {
    setSelectedBundle(bundle);
    setPreviewSheetOpen(true);
  }

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
          ) : bundles.length === 0 ? (
            <div className="py-8 text-muted-foreground text-center">
              {searchQuery ? "No bundles found matching your search" : "No bundles available"}
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bundle Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Original Price</TableHead>
                      <TableHead>Bundle Price</TableHead>
                      <TableHead>Savings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bundles.map((bundle) => (
                      <TableRow key={bundle.id}>
                        <TableCell className="font-medium">{bundle.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {bundle.description}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleViewDetails(bundle)}
                            className="text-primary hover:underline"
                          >
                            {bundle.services.length} service
                            {bundle.services.length !== 1 ? "s" : ""}
                          </button>
                        </TableCell>
                        <TableCell>${Number(bundle.totalOriginalPrice).toFixed(2)}</TableCell>
                        <TableCell className="font-medium text-primary">
                          ${Number(bundle.bundlePrice).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {bundle.discountPercentage > 0 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {bundle.discountPercentage}% OFF
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
                            {/* <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(bundle)}
                              title="Delete bundle"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {meta && meta.totalPage > 1 && (
                <div className="mt-4">
                  <CustomPagination
                    page={page}
                    totalPage={meta.totalPage}
                    setPage={setPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Bundle Details Sheet */}
      <Sheet open={previewSheetOpen} onOpenChange={setPreviewSheetOpen}>
        <SheetContent side="right" className="md:w-[400px] p-0 w-full overflow-y-auto">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Bundle Overview</SheetTitle>
          </SheetHeader>
          {selectedBundle && (
            <div className="p-6 space-y-6">
              {selectedBundle.image && (
                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                  <img
                    src={selectedBundle.image}
                    alt={selectedBundle.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold">{selectedBundle.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {selectedBundle.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Included Services
                </h4>
                <div className="space-y-2">
                  {selectedBundle.services.map((bundleService: any) => (
                    <div
                      key={bundleService.id}
                      className="p-3 rounded-lg bg-muted/30 flex items-center justify-between border group hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {bundleService.service.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Base Price: ${Number(bundleService.service.basePrice).toFixed(2)}
                        </span>
                      </div>
                      <Badge variant="outline" className="font-normal">
                        ${Number(bundleService.service.basePrice).toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-primary/5 p-4 space-y-3 border border-primary/10">
                <div className="text-sm flex justify-between">
                  <span className="text-muted-foreground">Original Total:</span>
                  <span className="line-through text-muted-foreground/60">
                    ${Number(selectedBundle.totalOriginalPrice).toFixed(2)}
                  </span>
                </div>
                <div className="text-sm flex justify-between items-center">
                  <span className="font-medium">Bundle Price:</span>
                  <span className="font-bold text-2xl text-primary">
                    ${Number(selectedBundle.bundlePrice).toFixed(2)}
                  </span>
                </div>
                {selectedBundle.discountPercentage > 0 && (
                  <div className="pt-2 border-t border-primary/10 flex justify-between items-center">
                    <span className="text-xs font-medium text-green-600">Total Savings:</span>
                    <Badge className="bg-green-500 hover:bg-green-600">
                      {selectedBundle.discountPercentage}% OFF ($
                      {Number(selectedBundle.discountAmount).toFixed(2)})
                    </Badge>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-0 pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setPreviewSheetOpen(false);
                    onEdit?.(selectedBundle);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Bundle
                </Button>
                {/* <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    handleDeleteClick(selectedBundle);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button> */}
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
        description={`Are you sure you want to delete the bundle "${bundleToDelete?.name}"? This action will permanently remove it from the store.`}
      />
    </>
  );
}
