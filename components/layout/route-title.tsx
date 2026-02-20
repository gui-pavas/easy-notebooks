"use client";

import { Button } from "@/components/ui/button";
import { NotebookSummary } from "@/types/notebooks";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function formatSegment(segment: string): string {
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function RouteTitle({ notebooks }: { notebooks: NotebookSummary[] }) {
  const pathname = usePathname();

  if (!pathname || pathname === "/") {
    return <h1 className="text-2xl font-semibold">All Notebooks</h1>;
  }

  const segments = pathname.split("/").filter(Boolean);
  const notebookId = segments[0];
  const match = notebooks.find((notebook) => notebook.id === notebookId);
  const title = match?.name ?? formatSegment(notebookId || "easy notebooks");

  const backHref =
    segments[1] === "notes" && segments[2]
      ? `/${notebookId}`
      : segments.length >= 1
        ? "/"
        : null;

  return (
    <div className="flex items-center gap-2">
      {backHref && (
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href={backHref} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      )}
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
}
