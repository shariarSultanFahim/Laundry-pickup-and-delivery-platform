"use client";

import { useState } from "react";

import Header from "../components/header";
import { FAQForm, FAQsList } from "./components";

export default function FAQPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <Header title="FAQ Management" subtitle="Manage and update frequently asked questions" />

      <FAQForm onSuccess={handleFormSuccess} />

      <div key={refreshTrigger}>
        <FAQsList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
