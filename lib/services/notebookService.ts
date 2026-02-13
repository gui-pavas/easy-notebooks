import { Notebooks as NotebookModel } from "../generated/prisma/client";
import Notebook from "../models/notebooks";

interface INotebookService {
    index(): Promise<NotebookModel[]>;
    create(id: string, name: string): Promise<NotebookModel>;
    findById(id: string): Promise<NotebookModel | null>;
    update(id: string, name: string): Promise<NotebookModel>;
    delete(id: string): Promise<NotebookModel>;
}

class NotebookService implements INotebookService {
    public async index(): Promise<NotebookModel[]> {
        return Notebook.index();
    }

    public async create(id: string, name: string): Promise<NotebookModel> {
        return Notebook.create(id, name);
    }

    public async findById(id: string): Promise<NotebookModel | null> {
        return Notebook.findById(id);
    }

    public async update(id: string, name: string): Promise<NotebookModel> {
        return Notebook.update(id, name);
    }

    public async delete(id: string): Promise<NotebookModel> {
        return Notebook.delete(id);
    }
}

export const notebookService: INotebookService = new NotebookService();
