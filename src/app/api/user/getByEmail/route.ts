import { prisma } from "@/lib/db/dbUtils";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody: { email: string } = await request.json();

    const record = await prisma.user.findUnique({
      where: { email: reqBody.email },
    });

    if (record) {
      return NextResponse.json({
        success: true,
        user: record,
      });
    }

    return NextResponse.json({
      success: false,
      user: null,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      user: null,
    });
  }
}
