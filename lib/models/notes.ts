import { Notes as NotesModel } from "../generated/prisma/client";
import prisma from "../prisma";

export default class Notes {
    public static async index(userId: string): Promise<NotesModel[]> {
        return await prisma.notes.findMany({
            where: {
                notebook: {
                    userId,
                },
            },
        });
    }

    public static async create(userId: string, notebookId: string, title: string, content: string): Promise<NotesModel | null> {
        const notebook = await prisma.notebooks.findFirst({
            where: { id: notebookId, userId },
        });

        if (!notebook) {
            return null;
        }

        return await prisma.notes.create({
            data: {
                notebookId,
                title,
                content
            }
        });
    }

    public static async findById(userId: string, id: string): Promise<NotesModel | null> {
        return await prisma.notes.findFirst({
            where: {
                id,
                notebook: {
                    userId,
                },
            }
        });
    }

    public static async update(userId: string, id: string, title: string, content: string): Promise<NotesModel | null> {
        const note = await prisma.notes.findFirst({
            where: {
                id,
                notebook: {
                    userId,
                },
            },
        });

        if (!note) {
            return null;
        }

        return await prisma.notes.update({
            where: {
                id
            },
            data: {
                title,
                content
            }
        });
    }

    public static async delete(userId: string, id: string): Promise<NotesModel | null> {
        const note = await prisma.notes.findFirst({
            where: {
                id,
                notebook: {
                    userId,
                },
            },
        });

        if (!note) {
            return null;
        }

        return await prisma.notes.delete({
            where: {
                id
            }
        });
    }
}
