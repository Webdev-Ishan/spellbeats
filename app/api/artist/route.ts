import { prisma } from "@/lib/DB";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allartists = await prisma.user.findMany({
      where: {
        streams: {
          some: {},
        },
      },
      orderBy: {
        streams: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: { streams: true },
        },
      },
    });
    return NextResponse.json(
      {
        success: true,
        allartists,
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
