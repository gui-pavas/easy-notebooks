import NotebookCard, { type NotebookCardData } from "@/components/notebooks/notebook-card";

type NotebookGridProps = {
  notebooks: NotebookCardData[];
};

export default function NotebookGrid({ notebooks }: NotebookGridProps) {
  if (!notebooks.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        No notebooks yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notebooks.map((notebook) => (
        <NotebookCard key={notebook.id} notebook={notebook} />
      ))}
    </div>
  );
}
