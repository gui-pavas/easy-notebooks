import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type UserResolution =
  | { userId: string; response?: undefined }
  | { userId?: undefined; response: NextResponse };

export async function resolveUserIdFromSession(): Promise<UserResolution> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { userId: session.user.id };
}
