"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import "react-quill-new/dist/quill.snow.css";

import { Button } from "@/ui";

import { defaultTermsConditions } from "../data/terms-conditions";
import {
  termsConditionsSchema,
  type TermsConditionsFormData
} from "../schema/terms-conditions.schema";
import { updateTermsConditions } from "./terms-conditions-api";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function TermsConditionsForm() {
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TermsConditionsFormData>({
    resolver: zodResolver(termsConditionsSchema),
    defaultValues: {
      content: defaultTermsConditions.content
    }
  });

  const content = useWatch({ control, name: "content" });

  async function onSubmit(data: TermsConditionsFormData) {
    await updateTermsConditions(data);
    // Update the last updated date
    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    setLastUpdated(formatted);
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link"],
      ["clean"]
    ]
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link"
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-lg border-border bg-card p-6 border">
        <div className="space-y-4">
          <div>
            <label className="mb-2 text-sm font-medium text-muted-foreground block">
              Create and manage your platform&apos;s terms and conditions
            </label>

            <div className="rounded-md border-border border">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={(value) => setValue("content", value)}
                modules={modules}
                formats={formats}
                placeholder="Type here..."
                className="h-full"
              />
            </div>

            {errors.content && (
              <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Last Updated On: <span className="font-medium text-foreground">{lastUpdated}</span>
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="max-w-xs w-full">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
