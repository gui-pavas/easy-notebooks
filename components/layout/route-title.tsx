"use client";

import { usePathname } from "next/navigation";

type NotebookTitleItem = {
  id: string;
  name: string;
};

function formatSegment(segment: string): string {
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function RouteTitle({ notebooks }: { notebooks: NotebookTitleItem[] }) {
  const pathname = usePathname();

  if (!pathname || pathname === "/") {
    return <h1 className="text-2xl font-semibold">All Notebooks</h1>;
  }

  const segment = pathname.split("/").filter(Boolean)[0];
  const match = notebooks.find((notebook) => notebook.id === segment);
  const title = match?.name ?? formatSegment(segment || "easy notebooks");

  return <h1 className="text-2xl font-semibold">{title}</h1>;
}
