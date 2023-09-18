import { prisma } from "@/lib/db/dbUtils";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody: {
      message: string;
      senderId: string;
      conversationId: string;
    } = await request.json();

    const newMsg = await prisma.message.create({
      data: {
        text: reqBody.message,
        senderId: reqBody.senderId,
        conversationId: reqBody.conversationId,
      },
    });

    return NextResponse.json({
      success: true,
      message: newMsg,
    });
  } catch (err) {
    console.log(err);
  }

  return NextResponse.json({
    success: false,
    message: null,
  });
}
