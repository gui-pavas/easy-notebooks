import { Notes as NotesModel } from "../generated/prisma/client";
import prisma from "../prisma";

export default class Notes {
    public static async index(): Promise<NotesModel[]> {
        return await prisma.notes.findMany();
    }

    public static async create(notebookId: string, title: string, content: string): Promise<NotesModel> {
        return await prisma.notes.create({
            data: {
                notebookId,
                title,
                content
            }
        });
    }

    public static async findById(id: string): Promise<NotesModel | null> {
        return await prisma.notes.findUnique({
            where: {
                id
            }
        });
    }

    public static async update(id: string, title: string, content: string): Promise<NotesModel> {
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

    public static async delete(id: string): Promise<NotesModel> {
        return await prisma.notes.delete({
            where: {
                id
            }
        });
    }
}