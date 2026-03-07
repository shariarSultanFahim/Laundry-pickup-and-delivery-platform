"use client";

import AddOnServicesSection from "./add-on-services-section";
import ServicesSection from "./services-section";

export default function ServicesContent() {
  return (
    <div className="space-y-6">
      <ServicesSection />
      <AddOnServicesSection />
    </div>
  );
}
