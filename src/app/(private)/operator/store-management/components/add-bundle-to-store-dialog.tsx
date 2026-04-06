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
import { useGetBundles } from "@/lib/actions/bundle/get.bundles";
import { useAddBundleToStore } from "@/lib/actions/store/store-bundle";

interface AddBundleToStoreDialogProps {
  storeId: string;
  existingBundleIds: string[];
}

export default function AddBundleToStoreDialog({ storeId, existingBundleIds }: AddBundleToStoreDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBundleIds, setSelectedBundleIds] = useState<string[]>([]);

  const { data: bundlesResponse, isLoading } = useGetBundles({
    searchTerm: searchTerm || undefined,
    page: 1,
    limit: 100
  }, open);

  const { mutateAsync: addBundles, isPending: isAdding } = useAddBundleToStore();

  const bundles = bundlesResponse?.data || [];
  const filteredBundles = bundles.filter(b => !existingBundleIds.includes(b.id));

  const toggleBundle = (id: string) => {
    setSelectedBundleIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (selectedBundleIds.length === 0) return;
    try {
      await addBundles({
        storeId,
        bundleIds: selectedBundleIds
      });
      toast.success("Bundles added to store successfully");
      setOpen(false);
      setSelectedBundleIds([]);
    } catch (error: any) {
      toast.error(error.message || "Failed to add bundles");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Bundle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Bundles to Store</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bundles..."
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
            ) : filteredBundles.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No new bundles found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBundles.map((bundle) => (
                  <div key={bundle.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`bundle-${bundle.id}`}
                      checked={selectedBundleIds.includes(bundle.id)}
                      onCheckedChange={() => toggleBundle(bundle.id)}
                    />
                    <label
                      htmlFor={`bundle-${bundle.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full items-center cursor-pointer"
                    >
                      <div className="flex flex-col gap-1">
                        <span>{bundle.name}</span>
                        <span className="text-xs text-muted-foreground">${bundle.bundlePrice}</span>
                      </div>
                      {selectedBundleIds.includes(bundle.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedBundleIds.map(id => {
              const b = bundles.find(bund => bund.id === id);
              return b ? (
                <Badge key={id} variant="secondary" className="gap-1">
                  {b.name}
                  <button onClick={() => toggleBundle(id)} className="ml-1 hover:text-destructive">
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
            disabled={selectedBundleIds.length === 0 || isAdding}
          >
            {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add {selectedBundleIds.length > 0 ? `(${selectedBundleIds.length})` : ""} Bundles
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
