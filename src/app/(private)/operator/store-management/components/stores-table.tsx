"use client";

import { Edit, Eye, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/ui";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { Store } from "@/types/store";

interface StoresTableProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onToggleStatus: (store: Store) => void;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  page: number;
  totalPage: number;
  setPage: (page: number) => void;
  isLoading?: boolean;
}

export default function StoresTable({
  stores,
  onEdit,
  onToggleStatus,
  onSearchChange,
  onStatusFilterChange,
  page,
  totalPage,
  setPage,
  isLoading = false
}: StoresTableProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    onSearchChange(val);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stores</CardTitle>
        <div className="mt-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search stores..."
              value={searchInput}
              onChange={handleSearch}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground font-medium">Status:</span>
            <select
               onChange={(e) => onStatusFilterChange(e.target.value)}
               className="bg-background border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
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
        ) : stores.length === 0 ? (
          <div className="py-8 text-muted-foreground text-center">
            No stores found.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>{store.address}</TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {store.city}, {store.country}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={store.isActive}
                            onCheckedChange={() => onToggleStatus(store)}
                          />
                          <Badge
                            variant="secondary"
                            className={
                              store.isActive
                                ? "text-emerald-600 bg-emerald-50"
                                : "text-muted-foreground"
                            }
                          >
                            {store.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="gap-2 flex justify-end">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/operator/store-management/${store.id}`} title="View Details">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(store)}
                            title="Edit Store"
                          >
                            <Edit className="h-4 w-4" />
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
