import { prisma } from "@/lib/db/dbUtils";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody: { conversationId: string } = await request.json();
    const chats = await prisma.message.findMany({
      where: { conversationId: reqBody.conversationId },
    });
    return NextResponse.json({
      success: true,
      chats: chats,
    });
  } catch (err) {
    console.log(err);
  }

  return NextResponse.json({
    success: false,
    chats: [],
  });
}
