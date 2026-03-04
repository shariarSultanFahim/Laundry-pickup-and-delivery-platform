"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import "react-quill-new/dist/quill.snow.css";

import { Button } from "@/ui";

import { defaultPrivacyPolicy } from "../data/privacy-policy";
import { privacyPolicySchema, type PrivacyPolicyFormData } from "../schema/privacy-policy.schema";
import { updatePrivacyPolicy } from "./privacy-policy-api";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function PrivacyPolicyForm() {
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
  } = useForm<PrivacyPolicyFormData>({
    resolver: zodResolver(privacyPolicySchema),
    defaultValues: {
      content: defaultPrivacyPolicy.content
    }
  });

  const content = useWatch({ control, name: "content" });

  async function onSubmit(data: PrivacyPolicyFormData) {
    await updatePrivacyPolicy(data);
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
              Create and manage your platform&apos;s privacy policy
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
