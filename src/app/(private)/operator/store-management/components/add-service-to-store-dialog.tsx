"use client";

import { useState } from "react";
import { Plus, Search, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Checkbox,
  Badge
} from "@/ui";
import { useGetServices } from "@/lib/actions/service/get.services";
import { useAddServiceToStore } from "@/lib/actions/store/store-service";

interface AddServiceToStoreDialogProps {
  storeId: string;
  existingServiceIds: string[];
}

export default function AddServiceToStoreDialog({ storeId, existingServiceIds }: AddServiceToStoreDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const { data: servicesResponse, isLoading } = useGetServices({
    searchTerm: searchTerm || undefined,
    page: 1,
    limit: 100
  }, open);

  const { mutateAsync: addServices, isPending: isAdding } = useAddServiceToStore();

  const services = servicesResponse?.data || [];
  const filteredServices = services.filter(s => !existingServiceIds.includes(s.id));

  const toggleService = (id: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
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
    } catch (error: any) {
      toast.error(error.message || "Failed to add services");
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Services to Store</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="h-[300px] overflow-y-auto border rounded-md p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No new active services found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div key={service.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={selectedServiceIds.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <label
                      htmlFor={`service-${service.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full items-center cursor-pointer"
                    >
                      <div className="flex flex-col gap-1">
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

          <div className="flex flex-wrap gap-2">
            {selectedServiceIds.map(id => {
              const s = services.find(serv => serv.id === id);
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
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAdd}
            disabled={selectedServiceIds.length === 0 || isAdding}
          >
            {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add {selectedServiceIds.length > 0 ? `(${selectedServiceIds.length})` : ""} Services
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
