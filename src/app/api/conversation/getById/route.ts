import { prisma } from "@/lib/db/dbUtils";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody: { id: string } = await request.json();
    const record = await prisma.conversation.findUnique({
      where: {
        id: reqBody.id,
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json({
      success: true,
      conversation: record,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      conversation: null,
    });
  }
}
