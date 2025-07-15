import { prisma } from "@/lib/DB";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

    if (!token || !token.id) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    const userid = token.id.toString();
    const body = await req.json();
    const streamid = body?.streamid;

    if (!userid || !streamid) {
      return NextResponse.json(
        { success: false, message: "Ids are not found", userid, streamid },
        { status: 400 }
      );
    }

    // Check if the user has already upvoted
    const existUpvote = await prisma.upvotes.findUnique({
      where: {
        userId_streamsId: {
          userId: userid,
          streamsId: streamid,
        },
      },
    });

    if (existUpvote) {
      return NextResponse.json(
        { success: false, message: "Already upvoted" },
        { status: 409 } // 409 Conflict
      );
    }

    // Create new upvote
    const newupvote = await prisma.upvotes.create({
      data: {
        userId: userid,
        streamsId: streamid,
      },
    });

    if (!newupvote) {
      return NextResponse.json(
        { success: false, message: "Something went wrong." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Upvoted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: "Something went wrong." },
        { status: 500 }
      );
    }
  }
}
