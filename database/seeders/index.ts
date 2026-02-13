import prisma from "../../lib/prisma";
import { userSeeder } from "./userSeeder";

async function main() {
  const user = await userSeeder();
  console.log(`Seeded user: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
