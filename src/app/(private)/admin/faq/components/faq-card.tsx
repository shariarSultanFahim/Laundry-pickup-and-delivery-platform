"use client";

import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useUpdateFAQ } from "@/lib/actions/faq";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FAQ } from "@/types";

import { EditFAQDialog } from "./edit-faq-dialog";

interface FAQCardProps {
  faq: FAQ;
  onDeleteSuccess?: () => void;
}

export function FAQCard({ faq, onDeleteSuccess }: FAQCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { mutateAsync: updateFAQ } = useUpdateFAQ();

  async function handleDelete() {
    try {
      // Note: Delete endpoint would be PATCH /faq/{id} with isActive: false
      // Or DELETE /faq/{id} if backend supports it
      await updateFAQ({
        id: faq.id,
        payload: { isActive: false }
      });
      toast.success("FAQ deleted successfully");
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
      toast.error("Failed to delete FAQ. Please try again.");
    }
  }

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="gap-4 flex items-start justify-between">
            <CardTitle className="text-base line-clamp-2">{faq.question}</CardTitle>
            <Badge variant={faq.isActive ? "default" : "secondary"}>
              {faq.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="gap-4 flex flex-1 flex-col">
          <p className="text-sm text-muted-foreground line-clamp-3">{faq.answer}</p>

          <div className="gap-2 pt-4 mt-auto flex border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="flex-1"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this FAQ? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <EditFAQDialog
        faq={faq}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={() => {
          setIsEditOpen(false);
          onDeleteSuccess?.();
        }}
      />
    </>
  );
}
