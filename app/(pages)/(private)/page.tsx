'use client';

import NewNotebookModal from "@/components/modals/new-notebook-modal";
import NotebookGrid from "@/components/notebooks/notebook-grid";
import * as React from "react";

export default function Home() {
  const [notebooks, setNotebooks] = React.useState<{ id: string; name: string; createdAt: string }[]>([]);

  const fetchNotebooks = async () => {
    const response = await fetch("/api/notebooks");
    const data = await response.json();
    setNotebooks(data);
  };

  React.useEffect(() => {
    fetchNotebooks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <NewNotebookModal onNotebookCreated={fetchNotebooks} />
      </div>
      <NotebookGrid notebooks={notebooks} />
    </div>
  );
}
