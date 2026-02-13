import { compare } from "bcryptjs";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { userService } from "@/lib/services/userService";

export type CredentialsInput = {
  email?: string;
  password?: string;
};

interface IAuthService {
  authorizeCredentials(credentials?: CredentialsInput): Promise<User | null>;
  applyJwt(token: JWT, user?: User): JWT;
  applySession(session: Session, token: JWT): Session;
}

class AuthService implements IAuthService {
  public async authorizeCredentials(credentials?: CredentialsInput): Promise<User | null> {
    const email = credentials?.email?.trim().toLowerCase();
    const password = credentials?.password;

    if (!email || !password) {
      return null;
    }

    const user = await userService.findByEmail(email);
    if (!user) {
      return null;
    }

    const validPassword = await compare(password, user.hashedPassword);
    if (!validPassword) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    };
  }

  public applyJwt(token: JWT, user?: User): JWT {
    if (user?.id) {
      token.sub = user.id;
    }

    return token;
  }

  public applySession(session: Session, token: JWT): Session {
    if (session.user && token.sub) {
      session.user.id = token.sub;
    }

    return session;
  }
}

export const authService: IAuthService = new AuthService();
