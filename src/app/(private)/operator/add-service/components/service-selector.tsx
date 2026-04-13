"use client";

import { useMemo, useState } from "react";

import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";

import type { Service } from "@/types/service";

import { useGetMyServices } from "@/lib/actions/service/get.my.services";
import { cn } from "@/lib/utils";

import { useDebounce } from "@/hooks/use-debounce";

import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "@/ui";
import { Badge } from "@/ui/badge";

interface SelectedServiceItem {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
}

interface ServiceSelectorProps {
  selectedServices: SelectedServiceItem[];
  onServicesChange: (services: SelectedServiceItem[]) => void;
}

export default function ServiceSelector({
  selectedServices,
  onServicesChange
}: ServiceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: servicesResponse, isLoading } = useGetMyServices({
    searchTerm: debouncedSearch || undefined,
    limit: 50 // Show enough options in selector
  });

  const services = useMemo(
    () => servicesResponse?.data?.filter((s) => s.isActive) ?? [],
    [servicesResponse]
  );

  function handleToggleService(service: Service) {
    const isSelected = selectedServices.some((s) => s.serviceId === service.id);

    if (isSelected) {
      onServicesChange(selectedServices.filter((s) => s.serviceId !== service.id));
    } else {
      onServicesChange([
        ...selectedServices,
        {
          serviceId: service.id,
          serviceName: service.name,
          servicePrice: Number(service.basePrice)
        }
      ]);
    }
  }

  function handleRemoveService(serviceId: string) {
    onServicesChange(selectedServices.filter((s) => s.serviceId !== serviceId));
  }

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-11 shadow-sm hover:border-primary/50 w-full justify-between transition-colors"
          >
            {selectedServices.length > 0
              ? `${selectedServices.length} service${selectedServices.length !== 1 ? "s" : ""} selected`
              : "Search & select services..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="left-2.5 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 border-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="p-1 custom-scrollbar max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="py-8 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
              </div>
            ) : services.length === 0 ? (
              <div className="py-8 text-sm text-muted-foreground text-center italic">
                {searchQuery ? "No matching services found" : "No active services available"}
              </div>
            ) : (
              <div className="space-y-1">
                {services.map((service) => {
                  const isSelected = selectedServices.some((s) => s.serviceId === service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleToggleService(service)}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm hover:bg-primary/5 flex w-full items-center justify-between transition-colors",
                        isSelected && "bg-primary/10 text-primary hover:bg-primary/10"
                      )}
                    >
                      <div className="pr-4 flex flex-col items-start">
                        <span className="font-semibold text-foreground/80">{service.name}</span>
                        <span className="text-muted-foreground text-[11px] capitalize">
                          {service.category?.name || "General"}
                        </span>
                      </div>
                      <div className="gap-2 flex items-center">
                        <span className="text-xs font-bold font-mono">
                          ${Number(service.basePrice).toFixed(2)}
                        </span>
                        {isSelected && <Check className="h-4 w-4 stroke-[2.5px]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedServices.length > 0 && (
        <div className="gap-2.5 pt-1 flex flex-wrap">
          {selectedServices.map((service) => (
            <Badge
              key={service.serviceId}
              variant="outline"
              className="pl-3 pr-1 py-1.5 border-primary/20 bg-primary/[0.02] text-foreground/80 group"
            >
              <span className="text-xs font-medium mr-2">{service.serviceName}</span>
              <span className="text-muted-foreground mr-1 text-[10px] opacity-70">
                ${service.servicePrice.toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveService(service.serviceId)}
                className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                title="Remove service"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
