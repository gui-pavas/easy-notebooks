import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { authService, type CredentialsInput } from "@/lib/services/authService";

interface IAuthController {
  authorizeCredentials(credentials?: CredentialsInput): Promise<User | null>;
  applyJwt(token: JWT, user?: User): JWT;
  applySession(session: Session, token: JWT): Session;
}

class AuthController implements IAuthController {
  public async authorizeCredentials(credentials?: CredentialsInput): Promise<User | null> {
    return authService.authorizeCredentials(credentials);
  }

  public applyJwt(token: JWT, user?: User): JWT {
    return authService.applyJwt(token, user);
  }

  public applySession(session: Session, token: JWT): Session {
    return authService.applySession(session, token);
  }
}

export const authController: IAuthController = new AuthController();
