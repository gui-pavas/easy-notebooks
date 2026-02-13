import { User as UserModel } from "../generated/prisma/client";
import prisma from "../prisma";

export default class User {
  public static async findByEmail(email: string): Promise<UserModel | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  public static async create(data: {
    email: string;
    hashedPassword: string;
    name?: string | null;
  }): Promise<UserModel> {
    return prisma.user.create({
      data: {
        email: data.email,
        hashedPassword: data.hashedPassword,
        name: data.name ?? null,
      },
    });
  }
}
