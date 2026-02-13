import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";

export type NotebookCardData = {
  id: string;
  name: string;
  createdAt: string;
};

type NotebookCardProps = {
  notebook: NotebookCardData;
};

export default function NotebookCard({ notebook }: NotebookCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{notebook.name}</CardTitle>
        <CardDescription>{formatDate(new Date(notebook.createdAt))}</CardDescription>
      </CardHeader>

      <CardContent>
        <Link href={`/${notebook.id}`} className="block">
          <div className="flex h-44 items-center justify-center rounded border">
            <span className="text-4xl font-bold">{notebook.name.charAt(0)}</span>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="gap-4">
        <Button>
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button>
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
