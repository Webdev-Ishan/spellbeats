import { prisma } from "@/lib/DB";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json(
      { success: false, message: "Please login first" },
      { status: 400 }
    );
  }

  const userid = token.id.toString();
  const data = await req.json();
  const { streamid } = data.data;

  if (!userid || !data) {
    return NextResponse.json(
      { success: false, message: "Ids are not found" },
      { status: 401 }
    );
  }

  try {
    const existUpvote = await prisma.upvotes.findUnique({
      where: {
        userId_streamsId: {
          streamsId: streamid,
          userId: userid,
        },
      },
    });

    if (existUpvote) {
      return NextResponse.json(
        { success: false, message: "Already upvoted" },
        { status: 500 }
      );
    }

    const newupvote = await prisma.upvotes.create({
      data: {
        streamsId: streamid,
        userId: userid,
      },
    });

    if (!newupvote) {
      return NextResponse.json(
        { success: false, message: "Oops try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Upvoted",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: "Somethign went wrong." },
        { status: 500 }
      );
    }
  }
  return NextResponse.json(
    { success: false, message: "Internal Server Error." },
    { status: 500 }
  );
}
