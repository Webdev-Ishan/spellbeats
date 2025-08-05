import { prisma } from "@/lib/DB";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

type UserResponse = {
  id: string;
  email: string;
  name: string;
};

const shareSchema = z.object({
  Sharable: z.string(),
});

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

  if (!token || !token.id) {
    return NextResponse.json(
      {
        success: false,
        message: "Login please",
        token,
      },
      {
        status: 400,
      }
    );
  }

  const body = await req.json();
  const parsedBody = shareSchema.safeParse(body);

  if (!parsedBody || !parsedBody.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Input",
      },
      {
        status: 401,
      }
    );
  }

  const { Sharable } = parsedBody.data;

  try {
    const existUser = await prisma.user.findUnique({
      where: {
        id: token.id as string,
      },
    });

    if (!existUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const result = await prisma.user.findMany({
      where: {
        Sharable: Sharable,
      },
    });

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong",
        },
        {
          status: 409,
        }
      );
    }

    const response: UserResponse[] = result.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.username, // assuming username is stored in DB
    }));

    return NextResponse.json(
      {
        success: true,
        response,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}
