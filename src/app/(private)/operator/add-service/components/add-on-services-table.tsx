"use client";

import { useEffect, useState } from "react";
import { Edit, Search, Trash2 } from "lucide-react";

import { Addon } from "@/types/addon";
import { useDebounce } from "@/hooks/use-debounce";
import { CustomPagination } from "@/components/ui/custom-pagination";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/ui";
import { Badge } from "@/ui/badge";
import { Switch } from "@/ui/switch";

interface AddOnServicesTableProps {
  services: Addon[];
  onEdit: (service: Addon) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (service: Addon) => void;
  onSearchChange: (query: string) => void;
  page: number;
  totalPage: number;
  setPage: (page: number) => void;
  isLoading?: boolean;
}

export default function AddOnServicesTable({
  services,
  onEdit,
  onDelete,
  onToggleStatus,
  onSearchChange,
  page,
  totalPage,
  setPage,
  isLoading = false
}: AddOnServicesTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add-On Services</CardTitle>
        <div className="mt-4">
          <div className="relative">
            <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search add-on services..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="py-8 text-muted-foreground text-center">
            {searchInput
              ? "No add-on services found matching your search"
              : "No add-on services available"}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                      <TableCell>${Number(service.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.isActive}
                            onCheckedChange={() => onToggleStatus(service)}
                          />
                          <Badge
                            variant="secondary"
                            className={
                              service.isActive
                                ? "text-emerald-600 bg-emerald-50"
                                : "text-muted-foreground"
                            }
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="gap-2 flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(service)}
                            title="Edit service"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(service.id)}
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

            {totalPage > 1 && (
              <div className="pt-4 border-t">
                <CustomPagination
                  page={page}
                  totalPage={totalPage}
                  setPage={setPage}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
