import { hash } from "bcryptjs";
import prisma from "../../lib/prisma";

export async function userSeeder() {
  const email = process.env.SEED_USER_EMAIL?.trim().toLowerCase() || "user@admin.com";
  const password = process.env.SEED_USER_PASSWORD?.trim() || "password123";
  const name = process.env.SEED_USER_NAME?.trim() || "admin";

  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      hashedPassword,
    },
    create: {
      email,
      name,
      hashedPassword,
    },
  });

  return user;
}
