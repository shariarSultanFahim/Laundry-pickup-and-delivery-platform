"use client";

import { useState } from "react";

import Header from "../components/header";
import BannerForm from "./components/banner-form";
import BannersList from "./components/banners-list";

export default function Banner() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <Header
        title="Banner Management"
        subtitle="Manage and update promotional banners and advertisements"
      />

      <BannerForm onSuccess={() => setRefreshKey((prev) => prev + 1)} />

      <div key={refreshKey}>
        <BannersList onRefresh={() => setRefreshKey((prev) => prev + 1)} />
      </div>
    </div>
  );
}
