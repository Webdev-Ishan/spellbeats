import { prisma } from "@/lib/DB";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const queryschema = z.object({
  query: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Log in please",
        },
        { status: 401 }
      );
    }

    const userid = token.id.toString();

    const data = await req.json();
    const parsedBody = queryschema.safeParse(data);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: parsedBody.error.flatten,
          success: false,
        },
        { status: 401 }
      );
    }

    const { query } = parsedBody.data;

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

    const result = await prisma.streams.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        creator: {
          select: {
            username: true,
          },
        },
        upvotes: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        result,
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
