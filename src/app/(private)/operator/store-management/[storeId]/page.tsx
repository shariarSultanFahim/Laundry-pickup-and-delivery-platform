"use client";

import { useGetStoreDetails } from "@/lib/actions/store/get.store-details";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui";
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function StoreDetailsPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const { data: response, isLoading } = useGetStoreDetails(storeId);
  const store = response?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="md:col-span-2 h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!store) {
    return <div className="text-center py-20 text-muted-foreground">Store not found</div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/operator/store-management">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Store Details</h1>
      </div>

      {/* Banner & Basic Info */}
      <Card className="overflow-hidden border-none shadow-sm py-0">
        <div className="h-48 md:h-100 relative bg-muted flex items-center justify-center">
          {store.banner ? (
            <img src={store.banner} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="text-muted-foreground font-medium">No banner provided</div>
          )}
          <div className="absolute -bottom-16 left-8 h-32 w-32 rounded-xl border-4 border-white overflow-hidden bg-white shadow-md">
            {store.logo ? (
              <img src={store.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-2xl">
                {store.name.substring(0, 1).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <CardContent className="pt-20 pb-8 px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold">{store.name}</h2>
                <Badge className={store.isActive ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-400"}>
                  {store.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {store.address}, {store.city}, {store.state}, {store.country} {store.postalCode}
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl space-y-2 w-full md:w-auto">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Owner Information</h4>
              {store.operator?.user ? (
                <div className="space-y-1">
                  <p className="font-medium text-sm flex items-center gap-2">
                    <span className="w-20 text-xs text-muted-foreground font-normal">Name:</span>
                    {store.operator.user.name}
                  </p>
                  <p className="font-medium text-sm flex items-center gap-2">
                    <span className="w-20 text-xs text-muted-foreground font-normal">Email:</span>
                    {store.operator.user.email}
                  </p>
                  <p className="font-medium text-sm flex items-center gap-2">
                    <span className="w-20 text-xs text-muted-foreground font-normal">Phone:</span>
                    {store.operator.user.phone}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No operator info available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Available Services</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {store.storeServices && store.storeServices.length > 0 ? (
                  store.storeServices.map((ss, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{ss.service.name}</TableCell>
                      <TableCell className="font-bold text-primary">${ss.service.basePrice}</TableCell>
                      <TableCell>
                        {ss.service.isActive ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-slate-300" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground italic">
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
          <CardHeader>
            <CardTitle className="text-xl">Available Bundles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bundle</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {store.storeBundles && store.storeBundles.length > 0 ? (
                  store.storeBundles.map((sb, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{sb.bundle.name}</TableCell>
                      <TableCell className="font-bold text-primary">${sb.bundle.bundlePrice}</TableCell>
                      <TableCell>
                        {sb.bundle.isActive ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-slate-300" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground italic">
                      No bundles assigned to this store.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
