"use client";

import React from "react";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function NewNotebookModal({ onNotebookCreated }: { onNotebookCreated: () => void }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const createNewNotebook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;

    const formData = new FormData(form);
    const rawName = formData.get("name");
    const name = typeof rawName === "string" ? rawName.trim() : "";
    if (!name) {
      setError("Notebook name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/notebooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        setError("Could not create notebook.");
        return;
      }

      form.reset();
      setOpen(false);
      onNotebookCreated();
      router.refresh();
    } catch {
      setError("Could not complete notebook creation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="mr-2 h-4 w-4" />
          New Notebook
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Notebook</DialogTitle>
        </DialogHeader>

        <form onSubmit={createNewNotebook} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full rounded-md border-2 border-gray-300 p-2"
            disabled={isSubmitting}
            autoFocus
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              <CirclePlus className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Notebook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
