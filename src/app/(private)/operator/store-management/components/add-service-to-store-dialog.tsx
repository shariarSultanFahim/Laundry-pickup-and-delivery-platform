"use client";

import { useState } from "react";

import { Check, Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { useGetMyServices } from "@/lib/actions/service/get.my.services";
import { useAddServiceToStore } from "@/lib/actions/store/store-service";

import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input
} from "@/ui";

interface AddServiceToStoreDialogProps {
  storeId: string;
  existingServiceIds: string[];
}

export default function AddServiceToStoreDialog({
  storeId,
  existingServiceIds
}: AddServiceToStoreDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const { data: servicesResponse, isLoading } = useGetMyServices(
    {
      searchTerm: searchTerm || undefined,
      page: 1,
      limit: 100
    },
    open
  );

  const { mutateAsync: addServices, isPending: isAdding } = useAddServiceToStore();

  const services = servicesResponse?.data || [];
  const filteredServices = services.filter((s) => !existingServiceIds.includes(s.id));

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (selectedServiceIds.length === 0) return;
    try {
      await addServices({
        storeId,
        serviceIds: selectedServiceIds
      });
      toast.success("Services added to store successfully");
      setOpen(false);
      setSelectedServiceIds([]);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to add services");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add Services to Store</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="left-2.5 top-2.5 h-4 w-4 text-muted-foreground absolute" />
            <Input
              placeholder="Search services..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md p-4 h-75 overflow-y-auto border">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="py-10 text-muted-foreground text-center">
                No new active services found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div key={service.id} className="space-x-3 flex items-center">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={selectedServiceIds.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <label
                      htmlFor={`service-${service.id}`}
                      className="text-sm font-medium flex w-full cursor-pointer items-center justify-between leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <div className="gap-1 flex flex-col">
                        <span>{service.name}</span>
                        <span className="text-xs text-muted-foreground">${service.basePrice}</span>
                      </div>
                      {selectedServiceIds.includes(service.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="gap-2 flex flex-wrap">
            {selectedServiceIds.map((id) => {
              const s = services.find((serv) => serv.id === id);
              return s ? (
                <Badge key={id} variant="secondary" className="gap-1">
                  {s.name}
                  <button onClick={() => toggleService(id)} className="ml-1 hover:text-destructive">
                    <Plus className="h-3 w-3 rotate-45" />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        </div>
        <div className="gap-3 mt-4 flex justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={selectedServiceIds.length === 0 || isAdding}>
            {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add {selectedServiceIds.length > 0 ? `(${selectedServiceIds.length})` : ""} Services
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
