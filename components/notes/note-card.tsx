import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export type NoteCardData = {
  id: string;
  notebookId: string;
  title: string;
  content: string;
  updatedAt?: string;
};

type NoteCardProps = {
  note: NoteCardData;
};

function previewText(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function NoteCard({ note }: NoteCardProps) {
  const preview = previewText(note.content);

  return (
    <Link href={`/${note.notebookId}/notes/${note.id}`} className="block">
      <Card className="h-full transition-colors hover:bg-muted/40">
        <CardHeader>
          <CardTitle className="line-clamp-1 text-base">{note.title || "Untitled Note"}</CardTitle>
          <CardDescription>
            {note.updatedAt ? `Updated ${formatDate(new Date(note.updatedAt))}` : "Draft"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {preview || "Empty note. Click to start writing."}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-xs font-medium">Open note</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
