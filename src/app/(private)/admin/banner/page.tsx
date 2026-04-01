"use client";

import Header from "../components/header";
import BannerForm from "./components/banner-form";
import BannersList from "./components/banners-list";

export default function Banner() {
  return (
    <div className="space-y-6">
      <Header
        title="Banner Management"
        subtitle="Manage and update promotional banners and advertisements"
      />

      <BannerForm />

      <div>
        <BannersList />
      </div>
    </div>
  );
}
