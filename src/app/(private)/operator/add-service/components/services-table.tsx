"use client";

import Image from "next/image";
import { useState } from "react";
import { Edit, Eye, Heart, Loader2, Search, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { Service } from "@/types/service";
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
import { useGetServices } from "@/lib/actions/service/get.services";
import { useDeleteService } from "@/lib/actions/service/delete.service";
import { useUpdateService } from "@/lib/actions/service/update.service";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";
import { CustomPagination } from "@/components/ui/custom-pagination";

interface ServicesTableProps {
  onRefresh?: () => void;
  onEdit?: (service: Service) => void;
}

export default function ServicesTable({ onEdit }: ServicesTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [previewSheetOpen, setPreviewSheetOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const { data: servicesResponse, isLoading } = useGetServices({
    page,
    limit,
    searchTerm: debouncedSearch || undefined
  });

  const { mutateAsync: deleteService, isPending: isDeleting } = useDeleteService();
  const { mutateAsync: updateService } = useUpdateService();

  const services = servicesResponse?.data ?? [];
  const meta = servicesResponse?.meta;

  async function handleToggleStatus(service: Service) {
    try {
      setTogglingId(service.id);
      await updateService({
        id: service.id,
        data: { isActive: !service.isActive }
      });
      toast.success(`Service ${!service.isActive ? "activated" : "deactivated"} successfully`, {
        position: "top-center"
      });
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast.error(error.message || "Failed to update service status", {
        position: "top-center"
      });
    } finally {
      setTogglingId(null);
    }
  }

  function handleDeleteClick(service: Service) {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (!serviceToDelete) return;

    try {
      await deleteService(serviceToDelete.id);
      toast.success("Service deleted successfully", { position: "top-center" });
      setPreviewSheetOpen(false);
      setSelectedService(null);
      setDeleteModalOpen(false);
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast.error(error.message || "Failed to delete service", {
        position: "top-center"
      });
    } finally {
      setServiceToDelete(null);
    }
  }

  function handleRowClick(service: Service) {
    setSelectedService(service);
    setPreviewSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setPreviewSheetOpen(open);
    if (!open) {
      setSelectedService(null);
    }
  }

  function getDemoImage(service: Service) {
    if (service.image) {
      return service.image;
    }

    return "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800";
  }

  if (isLoading && page === 1) {
    return (
      <Card>
        <CardContent className="h-40 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="gap-4 md:grid-cols-2 grid grid-cols-1">
            <div className="relative">
              <Search className="left-3 top-2.5 h-4 w-4 text-muted-foreground absolute" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          {services.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              {isLoading ? (
                <div className="flex justify-center items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : "No services found"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Add-ons</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium underline decoration-primary decoration-dotted underline-offset-4 cursor-pointer" onClick={() => handleRowClick(service)}>{service.name}</TableCell>
                      <TableCell>{service.category?.name}</TableCell>
                      <TableCell>${Number(service.basePrice).toFixed(2)}</TableCell>
                      <TableCell>
                        {service.addons && service.addons.length > 0 ? (
                          <div className="gap-1 flex flex-wrap">
                            {service.addons.slice(0, 2).map((addon: any) => (
                              <Badge key={addon.id} variant="outline" className="text-xs">
                                {addon.addon.name}
                              </Badge>
                            ))}
                            {service.addons.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{service.addons.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell onClick={(event) => event.stopPropagation()}>
                        <div className="gap-2 flex items-center">
                          <Switch
                            checked={service.isActive}
                            onCheckedChange={() => handleToggleStatus(service)}
                            disabled={togglingId === service.id}
                          />
                          {togglingId === service.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {service.isActive ? "Active" : "Inactive"}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="gap-2 flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRowClick(service)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit?.(service)}
                            title="Edit service"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(service)}
                            title="Delete service"
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

          {meta && meta.totalPage > 1 && (
            <div className="pt-4 border-t">
              <CustomPagination
                page={page}
                totalPage={meta.totalPage}
                setPage={setPage}
                isLoading={isLoading}
              />
            </div>
          )}
        </CardContent>

        <Sheet open={previewSheetOpen} onOpenChange={handleSheetOpenChange}>
          <SheetContent side="right" className="md:w-96 p-4 w-full">
            <SheetHeader className="p-0">
              <SheetTitle>Service Preview</SheetTitle>
            </SheetHeader>

            {selectedService && (
              <div className="space-y-4 mt-6">
                <div className="border-border rounded-xl p-3 border">
                  <Image
                    width={1000}
                    height={1000}
                    src={getDemoImage(selectedService)}
                    alt={selectedService.name}
                    className="h-44 rounded-xl w-full object-cover"
                    unoptimized
                  />

                  <div className="mt-3 flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">{selectedService.name}</h3>
                    <Heart className="text-muted-foreground h-6 w-6" />
                  </div>

                  <div className="mt-3 gap-2 text-base text-muted-foreground flex items-center">
                    <Star className="text-black h-4 w-4 fill-current" />
                    <span className="font-medium text-foreground">4.6</span>
                    <span>(5k+)</span>
                    <span>. 2.2 mi.</span>
                    <span>30 min</span>
                  </div>

                  <div className="mt-3 text-xl">
                    <span className="font-semibold">${Number(selectedService.basePrice).toFixed(2)}/lb</span>
                    <span className="text-muted-foreground ml-2">delivery fee on $2.00</span>
                  </div>

                  <div className="mt-4 gap-2 flex flex-wrap">
                    <Badge
                      className="capitalize"
                      variant={selectedService.isActive ? "default" : "secondary"}
                    >
                      {selectedService.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{selectedService.category?.name}</Badge>
                  </div>

                  {selectedService.addons && selectedService.addons.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <h4 className="text-sm font-medium">Included Add-ons:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.addons.map((addon: any) => (
                          <Badge key={addon.id} variant="secondary" className="text-xs">
                            {addon.addon?.name || addon.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </Card>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Service"
        description={`Are you sure you want to delete "${serviceToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
}
