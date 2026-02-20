import NoteCard, { type NoteCardData } from "@/components/notes/note-card";

type NoteGridProps = {
  notes: NoteCardData[];
};

export default function NoteGrid({ notes }: NoteGridProps) {
  if (!notes.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        No notes yet. Create one to start writing.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
