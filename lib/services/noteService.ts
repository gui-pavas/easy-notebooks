import { Notes as NotesModel } from "../generated/prisma/client";
import Notes from "../models/notes";

interface INotesService {
    index(userId: string): Promise<NotesModel[]>;
    create(userId: string, notebookId: string, name: string, content: string): Promise<NotesModel | null>;
    findById(userId: string, id: string): Promise<NotesModel | null>;
    update(userId: string, id: string, name: string, content: string): Promise<NotesModel | null>;
    delete(userId: string, id: string): Promise<NotesModel | null>;
}

class NotesService implements INotesService {
    public async index(userId: string): Promise<NotesModel[]> {
        return Notes.index(userId);
    }

    public async create(userId: string, notebookId: string, name: string, content: string): Promise<NotesModel | null> {
        return Notes.create(userId, notebookId, name, content);
    }

    public async findById(userId: string, id: string): Promise<NotesModel | null> {
        return Notes.findById(userId, id);
    }

    public async update(userId: string, id: string, name: string, content: string): Promise<NotesModel | null> {
        return Notes.update(userId, id, name, content);
    }

    public async delete(userId: string, id: string): Promise<NotesModel | null> {
        return Notes.delete(userId, id);
    }
}

export const notesService: INotesService = new NotesService();
