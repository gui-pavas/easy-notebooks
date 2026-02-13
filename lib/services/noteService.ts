import { Notes as NotesModel } from "../generated/prisma/client";
import Notes from "../models/notes";

interface INotesService {
    index(): Promise<NotesModel[]>;
    create(NotebookId: string, name: string, content: string): Promise<NotesModel>;
    findById(id: string): Promise<NotesModel | null>;
    update(id: string, name: string, content: string): Promise<NotesModel>;
    delete(id: string): Promise<NotesModel>;
}

class NotesService implements INotesService {
    public async index(): Promise<NotesModel[]> {
        return Notes.index();
    }

    public async create(NotebookId: string, name: string, content: string): Promise<NotesModel> {
        return Notes.create(NotebookId, name, content);
    }

    public async findById(id: string): Promise<NotesModel | null> {
        return Notes.findById(id);
    }

    public async update(id: string, name: string, content: string): Promise<NotesModel> {
        return Notes.update(id, name, content);
    }

    public async delete(id: string): Promise<NotesModel> {
        return Notes.delete(id);
    }
}

export const notesService: INotesService = new NotesService();
