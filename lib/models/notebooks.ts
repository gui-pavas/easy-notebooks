import { Notebooks as NotebookModel } from "../generated/prisma/client";
import prisma from "../prisma";

export default class Notebook {
    public static async index(): Promise<NotebookModel[]> {
        return await prisma.notebooks.findMany();
    }

    public static async create(id: string, name: string): Promise<NotebookModel> {
        return await prisma.notebooks.create({
            data: {
                id,
                name,
            }
        });
    }

    public static async findById(id: string): Promise<NotebookModel | null> {
        return await prisma.notebooks.findUnique({
            where: {
                id
            }
        });
    }

    public static async atributeNote(id: string, noteId: string): Promise<NotebookModel> {
        return await prisma.notebooks.update({
            where: {
                id
            },
            data: {
                notes: {
                    connect: {
                        id: noteId
                    }
                }
            }
        });
    }

    public static async update(id: string, name: string): Promise<NotebookModel> {
        return await prisma.notebooks.update({
            where: {
                id
            },
            data: {
                name,
            }
        });
    }

    public static async delete(id: string): Promise<NotebookModel> {
        return await prisma.notebooks.delete({
            where: {
                id
            }
        });
    }
}