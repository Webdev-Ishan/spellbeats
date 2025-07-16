import { prisma } from "@/lib/DB";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reviewsSchema = z.object({
  topic: z.string().min(1),
  content: z.string().min(10).max(1000),
});

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json(
      {
        success: false,
        message: "Please login first",
      },
      {
        status: 401,
      }
    );
  }

  const userid = token.id;
  try {
    const data = await req.json();
    const parsedBody = reviewsSchema.safeParse(data);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsedBody.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const { topic, content } = parsedBody.data;

    const existuser = await prisma.user.findUnique({
      where: {
        id: userid,
      },
    });

    if (!existuser) {
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

    await prisma.reviews.create({
      data: {
        topic,
        content,
        creator: userid,
        createdAT: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted.",
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

  return NextResponse.json(
    {
      success: false,
      message: "Internal Server Error.",
    },
    {
      status: 501,
    }
  );
}

export async function GET() {
  try {
    const allReviews = await prisma.reviews.findMany({
      orderBy: {
        createdAT: "desc", // Optional: order reviews by latest first
      },
      include: {
        creatorId: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        allReviews,
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
          message: "Something went wrong.",
        },
        {
          status: 500,
        }
      );
    }
  }

  return NextResponse.json(
    {
      success: false,
      message: "Internal Server Error.",
    },
    {
      status: 501,
    }
  );
}
