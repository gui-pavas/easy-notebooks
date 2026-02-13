import SignInForm from "@/components/auth/sign-in-form";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <SignInForm />
    </main>
  );
}
