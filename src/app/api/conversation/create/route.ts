import { prisma } from "@/lib/db/dbUtils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody: { memberIds: string[] } = await request.json();

    const res = await prisma.conversation.create({
      data: {
        memberIds: reqBody.memberIds,
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json({
      success: true,
      createdConversation: res,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      createdConversation: null,
    });
  }
}
