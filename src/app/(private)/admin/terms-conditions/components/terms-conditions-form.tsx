"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import "react-quill-new/dist/quill.snow.css";

import { Button } from "@/ui";

import { defaultTermsConditions } from "../data/terms-conditions";
import {
  termsConditionsSchema,
  type TermsConditionsFormData
} from "../schema/terms-conditions.schema";
import { createTermsConditions, getTermsConditions } from "./terms-conditions-api";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function TermsConditionsForm() {
  const [isLoadingTerms, setIsLoadingTerms] = useState(true);
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

  useEffect(() => {
    let isMounted = true;

    const loadTermsConditions = async () => {
      try {
        const legalDocument = await getTermsConditions();

        if (!isMounted || !legalDocument) {
          return;
        }

        setValue("content", legalDocument.content);
        setLastUpdated(
          new Date(legalDocument.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        );
      } catch {
        if (isMounted) {
          toast.error("Failed to load terms and conditions.", { position: "top-center" });
        }
      } finally {
        if (isMounted) {
          setIsLoadingTerms(false);
        }
      }
    };

    void loadTermsConditions();

    return () => {
      isMounted = false;
    };
  }, [setValue]);

  async function onSubmit(data: TermsConditionsFormData) {
    const legalDocument = await createTermsConditions(data);
    const formatted = new Date(legalDocument.updatedAt).toLocaleDateString("en-US", {
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
              Create and manage your platform&apos;s terms and conditions
            </label>

            <div className="rounded-md border-border border">
              <ReactQuill
                theme="snow"
                value={content ?? ""}
                onChange={(value) => setValue("content", value)}
                modules={modules}
                formats={formats}
                placeholder="Type here..."
                className="h-full"
                readOnly={isLoadingTerms}
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

          <Button
            type="submit"
            disabled={isSubmitting || isLoadingTerms}
            className="max-w-xs w-full"
          >
            {isLoadingTerms ? "Loading..." : isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
