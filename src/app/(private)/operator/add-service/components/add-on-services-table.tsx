"use client";

import { Edit, Search, Trash2 } from "lucide-react";

import { AdminAddOnService } from "@/types";

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
import { Switch } from "@/ui/switch";

interface AddOnServicesTableProps {
  services: AdminAddOnService[];
  onEdit: (service: AdminAddOnService) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (service: AdminAddOnService) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function AddOnServicesTable({
  services,
  onEdit,
  onDelete,
  onToggleStatus,
  searchQuery,
  onSearchChange
}: AddOnServicesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add-On Services</CardTitle>
        <div className="mt-4">
          <div className="relative">
            <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search add-on services..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="py-8 text-muted-foreground text-center">
            {searchQuery ? "No add-on services found matching your search" : "No add-on services available"}
          </div>
        ) : (
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
                    <TableCell>${service.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <Switch
                          checked={service.status === "active"}
                          onCheckedChange={() => onToggleStatus(service)}
                        />
                        <Badge variant="secondary" className={service.status === "active" ? "text-emerald-600 bg-emerald-50" : "text-muted-foreground"}>
                           {service.status === "active" ? "Active" : "Inactive"}
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
        )}
      </CardContent>
    </Card>
  );
}
