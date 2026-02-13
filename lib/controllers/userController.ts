import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { userService } from "../services/userService";
import { badRequest, internalServerError, isRecord, isUniqueConstraintError } from "../utils/validation";

export class UserController {
  public async register(request: NextRequest): Promise<NextResponse> {
    const body = await request.json().catch(() => null);
    if (!isRecord(body)) {
      return badRequest("Request body must be a JSON object.");
    }

    const rawName = body.name;
    const rawEmail = body.email;
    const rawPassword = body.password;

    const name = typeof rawName === "string" && rawName.trim().length > 0 ? rawName.trim() : null;
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
    const password = typeof rawPassword === "string" ? rawPassword : "";

    if (!email) {
      return badRequest("Field 'email' is required.");
    }

    if (!password || password.length < 8) {
      return badRequest("Field 'password' is required and must have at least 8 characters.");
    }

    try {
      const hashedPassword = await hash(password, 12);
      const user = await userService.create({
        email,
        hashedPassword,
        name,
      });

      return NextResponse.json(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        { status: 201 },
      );
    } catch (error: unknown) {
      if (isUniqueConstraintError(error)) {
        return NextResponse.json({ error: "Email already exists." }, { status: 409 });
      }

      return internalServerError();
    }
  }
}

export const userController = new UserController();
