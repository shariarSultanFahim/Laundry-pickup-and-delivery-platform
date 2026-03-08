"use client";

import { useEffect, useState } from "react";

import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

import type { BundleService } from "@/types/bundle-management";
import type { Service } from "@/types/service-management";

import { cn } from "@/lib/utils";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@/ui";
import { Badge } from "@/ui/badge";

import { fetchServices } from "../../add-service/components/service-api";

interface ServiceSelectorProps {
  selectedServices: BundleService[];
  onServicesChange: (services: BundleService[]) => void;
}

export default function ServiceSelector({
  selectedServices,
  onServicesChange
}: ServiceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setIsLoading(true);
      const data = await fetchServices();
      setServices(data.filter((s) => s.isActive));
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setIsLoading(false);
    }
  }

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
          servicePrice: service.price
        }
      ]);
    }
  }

  function handleRemoveService(serviceId: string) {
    onServicesChange(selectedServices.filter((s) => s.serviceId !== serviceId));
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedServices.length > 0
              ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} selected`
              : "Select services..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full" align="start">
          <div className="max-h-64 p-2 overflow-y-auto">
            {isLoading ? (
              <div className="py-6 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : services.length === 0 ? (
              <div className="py-6 text-sm text-muted-foreground text-center">
                No active services available
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
                        "rounded-md px-3 py-2 text-sm hover:bg-accent flex w-full items-center justify-between",
                        isSelected && "bg-accent"
                      )}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-xs text-muted-foreground">${service.price}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedServices.length > 0 && (
        <div className="gap-2 flex flex-wrap">
          {selectedServices.map((service) => (
            <Badge key={service.serviceId} variant="secondary" className="px-3 py-1">
              <span className="mr-2">
                {service.serviceName} (${service.servicePrice})
              </span>
              <button
                type="button"
                onClick={() => handleRemoveService(service.serviceId)}
                className="hover:text-destructive"
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
