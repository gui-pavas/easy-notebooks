import { NextRequest, NextResponse } from "next/server";
import { userController } from "@/lib/controllers/userController";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return userController.register(request);
}
