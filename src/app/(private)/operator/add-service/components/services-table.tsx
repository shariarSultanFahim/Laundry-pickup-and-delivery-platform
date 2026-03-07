"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Edit, Heart, Loader2, Search, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { Service } from "@/types/service-management";

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

import { deleteService, fetchServices, toggleServiceStatus } from "./service-api";

interface ServicesTableProps {
  onRefresh?: () => void;
  onEdit?: (service: Service) => void;
}

export default function ServicesTable({ onRefresh, onEdit }: ServicesTableProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [previewSheetOpen, setPreviewSheetOpen] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setIsLoading(true);
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Failed to load services");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleStatus(service: Service) {
    try {
      setTogglingId(service.id);
      const response = await toggleServiceStatus(service.id, !service.isActive);

      if (response.success) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, isActive: !s.isActive } : s))
        );
        toast.success(`Service ${!service.isActive ? "activated" : "deactivated"} successfully`);
      } else {
        toast.error(response.message || "Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("An error occurred while updating the service");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(serviceId: string) {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const response = await deleteService(serviceId);

      if (response.success) {
        setServices((prev) => prev.filter((s) => s.id !== serviceId));
        toast.success("Service deleted successfully");
        setPreviewSheetOpen(false);
        setSelectedService(null);
        onRefresh?.();
      } else {
        toast.error(response.message || "Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("An error occurred while deleting the service");
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
    if (service.bannerImage) {
      return service.bannerImage;
    }

    return "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800";
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(services.map((s) => s.category)));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-40 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
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
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border-input rounded-md bg-background border"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        {filteredServices.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">
              {services.length === 0 ? "No services yet" : "No services match your filters"}
            </p>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow
                    key={service.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleRowClick(service)}
                  >
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>${service.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {service.addOnServices.length > 0 ? (
                        <div className="gap-1 flex flex-wrap">
                          {service.addOnServices.slice(0, 2).map((addon) => (
                            <Badge key={addon} variant="outline" className="text-xs">
                              {addon}
                            </Badge>
                          ))}
                          {service.addOnServices.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{service.addOnServices.length - 2}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                  <span className="font-semibold">${selectedService.price.toFixed(2)}/lb</span>
                  <span className="text-muted-foreground ml-2">delivery fee on $2.00</span>
                </div>

                <div className="mt-4 gap-2 flex flex-wrap">
                  <Badge
                    className="capitalize"
                    variant={selectedService.isActive ? "default" : "secondary"}
                  >
                    {selectedService.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{selectedService.category}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => {
                    setPreviewSheetOpen(false);
                    onEdit?.(selectedService);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Service
                </Button>
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => handleDelete(selectedService.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Service
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
}
