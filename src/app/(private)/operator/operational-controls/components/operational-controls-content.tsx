"use client";

import { useEffect, useState } from "react";

import { Calendar, Loader2, MapPin, Pause, X, Zap } from "lucide-react";
import { toast } from "sonner";

import type { OperationalControls } from "@/types/operational-controls";

import { useStoreOperationalSettings } from "@/lib/actions/store/use-store-operational-settings";
import { useUpdateStoreOperationalSettings } from "@/lib/actions/store/use-update-store-operational-settings";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Slider } from "@/ui/slider";
import { Switch } from "@/ui/switch";

interface OperationalControlsContentProps {
  selectedStoreId?: string;
}

function toIsoBlackoutDate(dateValue: string) {
  const parsedDate = dateValue.includes("T")
    ? new Date(dateValue)
    : new Date(`${dateValue}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toISOString();
}

function normalizeBlackoutDates(blackoutDates: string[]) {
  return [...new Set(blackoutDates.map((date) => toIsoBlackoutDate(date)))].sort();
}

export default function OperationalControlsContent({
  selectedStoreId
}: OperationalControlsContentProps) {
  const [pauseNewOrders, setPauseNewOrders] = useState<boolean | null>(null);
  const [dailyCapacity, setDailyCapacity] = useState<string | null>(null);
  const [capacityError, setCapacityError] = useState("");
  const [blackoutDateInput, setBlackoutDateInput] = useState("");
  const [blackoutDates, setBlackoutDates] = useState<string[] | null>(null);
  const [serviceRadius, setServiceRadius] = useState<number | null>(null);

  const { data, isLoading, isError } = useStoreOperationalSettings(selectedStoreId);
  const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateStoreOperationalSettings({
    storeId: selectedStoreId
  });

  const controls: OperationalControls | null = data?.data ?? null;
  const resolvedPauseNewOrders = pauseNewOrders ?? controls?.pauseNewOrders ?? false;
  const resolvedDailyCapacity = dailyCapacity ?? controls?.dailyCapacityLimit.toString() ?? "25";
  const resolvedBlackoutDates =
    blackoutDates ?? normalizeBlackoutDates(controls?.blackoutDates ?? []);
  const resolvedServiceRadius = serviceRadius ?? controls?.serviceRadius ?? 5;

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load operational settings");
    }
  }, [isError]);

  async function handleTogglePause() {
    try {
      const response = await updateSettings({ pauseNewOrders: !resolvedPauseNewOrders });
      setPauseNewOrders(response.data.pauseNewOrders);
      toast.success(response.message);
    } catch {
      toast.error("Failed to update pause status");
    }
  }

  async function handleUpdateCapacity() {
    const capacity = parseInt(resolvedDailyCapacity);
    if (isNaN(capacity) || capacity < 1) {
      setCapacityError("Please enter a valid number greater than 0");
      return;
    }

    setCapacityError("");
    try {
      const response = await updateSettings({ dailyCapacityLimit: capacity });
      setDailyCapacity(response.data.dailyCapacityLimit.toString());
      toast.success(response.message);
    } catch {
      toast.error("Failed to update capacity limit");
    }
  }

  async function handleAddBlackoutDate() {
    if (!blackoutDateInput) {
      toast.error("Please select a date");
      return;
    }

    try {
      const nextDates = normalizeBlackoutDates([...resolvedBlackoutDates, blackoutDateInput]);
      const response = await updateSettings({ blackoutDates: nextDates });
      setBlackoutDates(normalizeBlackoutDates(response.data.blackoutDates));
      setBlackoutDateInput("");
      toast.success(response.message);
    } catch {
      toast.error("Failed to add blackout date");
    }
  }

  async function handleRemoveBlackoutDate(date: string) {
    try {
      const nextDates = resolvedBlackoutDates.filter((d) => d !== date);
      const response = await updateSettings({ blackoutDates: nextDates });
      setBlackoutDates(normalizeBlackoutDates(response.data.blackoutDates));
      toast.success(response.message);
    } catch {
      toast.error("Failed to remove blackout date");
    }
  }

  async function handleUpdateServiceRadius() {
    try {
      const response = await updateSettings({ serviceRadius: resolvedServiceRadius });
      setServiceRadius(response.data.serviceRadius);
      toast.success(response.message);
    } catch {
      toast.error("Failed to update service radius");
    }
  }

  if (!selectedStoreId) {
    return (
      <div className="rounded-lg h-40 text-sm text-muted-foreground flex items-center justify-center border border-dashed">
        Select a store to manage operational settings.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!controls && !isLoading) {
    return (
      <div className="rounded-lg h-40 text-sm text-muted-foreground flex items-center justify-center border border-dashed">
        Operational settings are unavailable for this store.
      </div>
    );
  }

  return (
    <div className="gap-6 md:grid-cols-2 grid grid-cols-1">
      {/* Pause New Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="gap-3 flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Pause className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Pause New Orders</CardTitle>
                <CardDescription className="text-xs mt-1">
                  {!resolvedPauseNewOrders ? (
                    <span className="gap-1 text-green-600 flex items-center">
                      <span className="h-2 w-2 bg-green-600 rounded-full" />
                      Accepting orders
                    </span>
                  ) : (
                    <span className="gap-1 text-orange-600 flex items-center">
                      <span className="h-2 w-2 bg-orange-600 rounded-full" />
                      Not accepting orders
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={resolvedPauseNewOrders}
              onCheckedChange={handleTogglePause}
              disabled={isUpdating}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            New orders will be temporarily stopped when paused. Existing orders will continue to be
            processed.
          </p>
        </CardContent>
      </Card>

      {/* Daily Capacity Limit */}
      <Card>
        <CardHeader>
          <div className="gap-3 flex items-start">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Daily Capacity Limit</CardTitle>
              <CardDescription className="text-xs">Maximum orders per day</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            value={resolvedDailyCapacity}
            onChange={(e) => {
              setDailyCapacity(e.target.value);
              setCapacityError("");
            }}
            min="1"
            className="text-lg"
          />
          {capacityError && <p className="text-xs text-destructive">{capacityError}</p>}
          <Button onClick={handleUpdateCapacity} disabled={isUpdating} className="w-full">
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Limit the number of orders you can handle per day to maintain quality service.
          </p>
        </CardContent>
      </Card>

      {/* Blackout Dates */}
      <Card>
        <CardHeader>
          <div className="gap-3 flex items-start">
            <div className="bg-red-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Blackout Dates</CardTitle>
              <CardDescription className="text-xs">
                Days when service is unavailable
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="gap-2 flex">
            <Input
              type="date"
              value={blackoutDateInput}
              onChange={(e) => setBlackoutDateInput(e.target.value)}
            />
            <Button
              onClick={handleAddBlackoutDate}
              disabled={isUpdating || !blackoutDateInput}
              className="bg-red-600 hover:bg-red-700"
            >
              Add Date
            </Button>
          </div>

          {resolvedBlackoutDates.length > 0 ? (
            <div className="space-y-2">
              {resolvedBlackoutDates.map((date) => (
                <div key={date} className="bg-muted p-2 rounded flex items-center justify-between">
                  <span className="text-sm">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                  <button
                    onClick={() => handleRemoveBlackoutDate(date)}
                    disabled={isUpdating}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-2 text-center">No blackout dates set</p>
          )}
        </CardContent>
      </Card>

      {/* Service Radius */}
      <Card>
        <CardHeader>
          <div className="gap-3 flex items-start">
            <div className="bg-green-100 p-2 rounded-lg">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Service Radius</CardTitle>
              <CardDescription className="text-xs">Coverage area</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Coverage area</span>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {resolvedServiceRadius} km
              </Badge>
            </div>

            <Slider
              value={[resolvedServiceRadius]}
              onValueChange={(value) => setServiceRadius(value[0])}
              min={1}
              max={20}
              step={1}
              disabled={isUpdating}
              className="w-full"
            />

            <div className="text-xs text-muted-foreground flex justify-between">
              <span>1 km</span>
              <span>20 km</span>
            </div>
          </div>

          <Button onClick={handleUpdateServiceRadius} disabled={isUpdating} className="w-full">
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            Define the maximum distance for pickup and delivery services.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
