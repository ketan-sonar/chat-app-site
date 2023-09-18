import { prisma } from "@/lib/db/dbUtils";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody: { userId: string } = await request.json();
    const record = await prisma.conversation.findMany({
      where: {
        memberIds: {
          has: reqBody.userId,
        },
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json({
      success: true,
      conversations: record,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      conversations: null,
    });
  }
}
