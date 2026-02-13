import { Notebooks as NotebookModel } from "../generated/prisma/client";
import Notebook from "../models/notebooks";

interface INotebookService {
    index(userId: string): Promise<NotebookModel[]>;
    create(userId: string, name: string): Promise<NotebookModel>;
    findById(userId: string, id: string): Promise<NotebookModel | null>;
    update(userId: string, id: string, name: string): Promise<NotebookModel | null>;
    delete(userId: string, id: string): Promise<NotebookModel | null>;
}

class NotebookService implements INotebookService {
    public async index(userId: string): Promise<NotebookModel[]> {
        return Notebook.index(userId);
    }

    public async create(userId: string, name: string): Promise<NotebookModel> {
        return Notebook.create(userId, name);
    }

    public async findById(userId: string, id: string): Promise<NotebookModel | null> {
        return Notebook.findById(userId, id);
    }

    public async update(userId: string, id: string, name: string): Promise<NotebookModel | null> {
        return Notebook.update(userId, id, name);
    }

    public async delete(userId: string, id: string): Promise<NotebookModel | null> {
        return Notebook.delete(userId, id);
    }
}

export const notebookService: INotebookService = new NotebookService();
