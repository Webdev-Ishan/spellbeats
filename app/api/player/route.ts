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
        { success: false, message: "Ids are not found" },
        { status: 400 }
      );
    }

    const stream = await prisma.streams.findFirst({
      where: {
        id: streamid,
      },
      include:{
        creator:{
            select:{
                username:true
            }
        }
      }
    });

    if (!stream) {
      return NextResponse.json(
        { success: false, message: "Unable to fetch streams." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, stream }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  }
}
