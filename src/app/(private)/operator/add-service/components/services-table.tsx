"use client";

import { useEffect, useState } from "react";

import { Edit, Loader2, MoreHorizontal, Search, Trash2 } from "lucide-react";

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/ui";
import { Badge } from "@/ui/badge";
import { Switch } from "@/ui/switch";

import { toast } from "sonner";

import type { Service } from "@/types/service-management";
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
          prev.map((s) =>
            s.id === service.id ? { ...s, isActive: !s.isActive } : s
          )
        );
        toast.success(
          `Service ${!service.isActive ? "activated" : "deactivated"} successfully`
        );
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
        onRefresh?.();
      } else {
        toast.error(response.message || "Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("An error occurred while deleting the service");
    }
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
        <CardContent className="flex items-center justify-center h-40">
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
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
            className="px-3 py-2 border border-input rounded-md bg-background"
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
          <div className="text-center py-10">
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>${service.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {service.addOnServices.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
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
                    <TableCell>
                      <div className="flex items-center gap-2">
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit?.(service)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(service.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
