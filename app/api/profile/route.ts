import { prisma } from "@/lib/DB";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    if (!token || token.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Log in please",
        },
        { status: 401 }
      );
    }

    const userid = token.id.toString();

    const exist = await prisma.user.findUnique({
      where: {
        id: userid,
      },
    });

    if (!exist) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found!!",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        exist,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }
  }
  return NextResponse.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    { status: 501 }
  );
}
