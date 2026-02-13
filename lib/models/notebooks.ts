import { Notebooks as NotebookModel } from "../generated/prisma/client";
import prisma from "../prisma";

export default class Notebook {
    public static async index(userId: string): Promise<NotebookModel[]> {
        return await prisma.notebooks.findMany({
            where: { userId },
        });
    }

    public static async create(userId: string, name: string): Promise<NotebookModel> {
        return await prisma.notebooks.create({
            data: {
                userId,
                name,
            }
        });
    }

    public static async findById(userId: string, id: string): Promise<NotebookModel | null> {
        return await prisma.notebooks.findFirst({
            where: {
                id,
                userId,
            }
        });
    }

    public static async update(userId: string, id: string, name: string): Promise<NotebookModel | null> {
        const notebook = await prisma.notebooks.findFirst({
            where: { id, userId },
        });

        if (!notebook) {
            return null;
        }

        return await prisma.notebooks.update({
            where: {
                id
            },
            data: {
                name,
            }
        });
    }

    public static async delete(userId: string, id: string): Promise<NotebookModel | null> {
        const notebook = await prisma.notebooks.findFirst({
            where: { id, userId },
        });

        if (!notebook) {
            return null;
        }

        return await prisma.notebooks.delete({
            where: {
                id
            }
        });
    }
}
