import { User as UserModel } from "../generated/prisma/client";
import User from "../models/users";

interface IUserService {
  findByEmail(email: string): Promise<UserModel | null>;
  findById(id: string): Promise<UserModel | null>;
  create(data: {
    email: string;
    hashedPassword: string;
    name?: string | null;
  }): Promise<UserModel>;
}

class UserService implements IUserService {
  public async findByEmail(email: string): Promise<UserModel | null> {
    return User.findByEmail(email);
  }

  public async findById(id: string): Promise<UserModel | null> {
    return User.findById(id);
  }

  public async create(data: {
    email: string;
    hashedPassword: string;
    name?: string | null;
  }): Promise<UserModel> {
    return User.create(data);
  }
}

export const userService: IUserService = new UserService();
