"use client";

import { useMemo, useState } from "react";

import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { StorePerformance } from "@/types/admin-analytics";

interface StorePerformanceTableProps {
  data: StorePerformance[];
}


export default function StorePerformanceTable({ data }: StorePerformanceTableProps) {
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedMonth, setSelectedMonth] = useState("This Month");

  const filteredData = useMemo(() => {
    return data.filter((store) => {
      const regionMatch = selectedRegion === "All Regions" || (store.region && store.region === selectedRegion) || !store.region;
      const monthMatch = selectedMonth === "This Month" || (store.month && store.month === selectedMonth) || !store.month;
      return regionMatch && monthMatch;
    });
  }, [data, selectedRegion, selectedMonth]);

  const getStatusColor = (status: StorePerformance["status"]) => {
    switch (status) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="gap-3 flex flex-wrap items-center justify-between">
          <CardTitle>Store Performance</CardTitle>

        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm text-muted-foreground text-center">
                  Store Name
                </TableHead>
                <TableHead className="text-sm text-muted-foreground text-center">
                  Current Sales
                </TableHead>
                <TableHead className="text-sm text-muted-foreground text-center">
                  Previous Sales
                </TableHead>
                <TableHead className="text-sm text-muted-foreground text-center">
                  Growth %
                </TableHead>
                <TableHead className="text-sm text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((store, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-center">{store.storeName}</TableCell>
                    <TableCell className="font-semibold text-center">
                      {formatCurrency(store.currentSales)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center">
                      {formatCurrency(store.previousSales)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div
                        className={cn(
                          "gap-1 font-medium inline-flex items-center",
                          store.growth >= 0 ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {store.growth >= 0 ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                        {Math.abs(store.growth).toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn("font-medium capitalize", getStatusColor(store.status))}>
                        {store.status === "declining"
                          ? "Declining"
                          : store.status === "excellent"
                            ? "Excellent"
                            : "Good"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground text-center">
                    No data available for the selected filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
