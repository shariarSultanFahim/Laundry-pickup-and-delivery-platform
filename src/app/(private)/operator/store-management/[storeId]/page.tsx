"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { ArrowLeft, CheckCircle2, MapPin, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { useGetStoreDetails } from "@/lib/actions/store/get.store-details";
import { useDeleteBundleFromStore } from "@/lib/actions/store/store-bundle";
import { useDeleteServiceFromStore } from "@/lib/actions/store/store-service";

import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/ui";

import AddBundleToStoreDialog from "../components/add-bundle-to-store-dialog";
import AddServiceToStoreDialog from "../components/add-service-to-store-dialog";

export default function StoreDetailsPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [deleteBundleId, setDeleteBundleId] = useState<string | null>(null);

  const { data: response, isLoading: isDetailsLoading } = useGetStoreDetails(storeId);
  const store = response?.data;

  const { mutateAsync: deleteService, isPending: isDeletingService } = useDeleteServiceFromStore();
  const { mutateAsync: deleteBundle, isPending: isDeletingBundle } = useDeleteBundleFromStore();

  const handleDeleteService = async () => {
    if (!deleteServiceId) return;
    try {
      await deleteService(deleteServiceId);
      toast.success("Service removed from store");
      setDeleteServiceId(null);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to remove service");
    }
  };

  const handleDeleteBundle = async () => {
    if (!deleteBundleId) return;
    try {
      await deleteBundle(deleteBundleId);
      toast.success("Bundle removed from store");
      setDeleteBundleId(null);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to remove bundle");
    }
  };

  if (isDetailsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-xl w-full" />
        <div className="md:grid-cols-3 gap-6 grid grid-cols-1">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="md:col-span-2 h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!store) {
    return <div className="py-20 text-muted-foreground text-center">Store not found</div>;
  }

  const existingServiceIds = store?.storeServices?.map((ss) => ss?.service?.id) || [];
  const existingBundleIds = store?.storeBundles?.map((sb) => sb?.bundle?.id) || [];

  return (
    <div className="space-y-8 pb-10">
      <div className="gap-4 flex items-center">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/operator/store-management">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Store Details</h1>
      </div>

      {/* Banner & Basic Info */}
      <Card className="shadow-sm py-0 overflow-hidden border-none">
        <div className="h-48 md:h-100 bg-muted relative flex items-center justify-center">
          {store.banner ? (
            <Image
              src={store.banner}
              alt="Banner"
              fill
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground font-medium">No banner provided</div>
          )}
          <div className="-bottom-16 left-8 h-32 w-32 rounded-xl border-white bg-white shadow-md absolute overflow-hidden border-4">
            {store.logo ? (
              <Image
                src={store.logo}
                alt="Logo"
                fill
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-slate-100 text-slate-400 font-bold text-2xl flex h-full w-full items-center justify-center">
                {store.name.substring(0, 1).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <CardContent className="pt-20 pb-8 px-8">
          <div className="md:flex-row gap-4 flex flex-col items-start justify-between">
            <div className="space-y-2">
              <div className="gap-3 flex items-center">
                <h2 className="text-3xl font-bold">{store?.name}</h2>
                <Badge
                  className={
                    store?.isActive ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-400"
                  }
                >
                  {store?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="gap-2 text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4" />
                {store?.address}, {store?.city}, {store?.state}, {store?.country}{" "}
                {store?.postalCode}
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl space-y-2 md:w-auto w-full">
              <h4 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                Owner Information
              </h4>
              {store?.operator?.user ? (
                <div className="space-y-1">
                  <p className="font-medium text-sm gap-2 flex items-center">
                    <span className="w-20 text-xs text-muted-foreground font-normal">Name:</span>
                    {store?.operator?.user?.name}
                  </p>
                  <p className="font-medium text-sm gap-2 flex items-center">
                    <span className="w-20 text-xs text-muted-foreground font-normal">Email:</span>
                    {store?.operator?.user?.email}
                  </p>
                  <p className="font-medium text-sm gap-2 flex items-center">
                    <span className="w-20 text-xs text-muted-foreground font-normal">Phone:</span>
                    {store?.operator?.user?.phone}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No operator info available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="lg:grid-cols-2 gap-8 grid grid-cols-1">
        {/* Services Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Available Services</CardTitle>
            <AddServiceToStoreDialog storeId={storeId} existingServiceIds={existingServiceIds} />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {store?.storeServices && store?.storeServices.length > 0 ? (
                  store?.storeServices.map((ss) => (
                    <TableRow key={ss.id}>
                      <TableCell className="font-medium">{ss?.service?.name}</TableCell>
                      <TableCell className="font-bold text-primary">
                        ${ss?.service?.basePrice}
                      </TableCell>
                      <TableCell>
                        {ss?.service?.isActive ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-slate-300" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteServiceId(ss.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-4 text-muted-foreground text-center italic"
                    >
                      No services assigned to this store.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Bundles Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Available Bundles</CardTitle>
            <AddBundleToStoreDialog storeId={storeId} existingBundleIds={existingBundleIds} />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bundle</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {store?.storeBundles && store?.storeBundles.length > 0 ? (
                  store?.storeBundles.map((sb) => (
                    <TableRow key={sb.id}>
                      <TableCell className="font-medium">{sb?.bundle?.name}</TableCell>
                      <TableCell className="font-bold text-primary">
                        ${sb?.bundle?.bundlePrice}
                      </TableCell>
                      <TableCell>
                        {sb?.bundle?.isActive ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-slate-300" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteBundleId(sb.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-4 text-muted-foreground text-center italic"
                    >
                      No bundles assigned to this store.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationModal
        open={!!deleteServiceId}
        onOpenChange={(open) => !open && setDeleteServiceId(null)}
        onConfirm={handleDeleteService}
        isLoading={isDeletingService}
        title="Remove Service"
        description="Are you sure you want to remove this service from the store?"
      />

      <DeleteConfirmationModal
        open={!!deleteBundleId}
        onOpenChange={(open) => !open && setDeleteBundleId(null)}
        onConfirm={handleDeleteBundle}
        isLoading={isDeletingBundle}
        title="Remove Bundle"
        description="Are you sure you want to remove this bundle from the store?"
      />
    </div>
  );
}
