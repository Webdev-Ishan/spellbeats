import { prisma } from "@/lib/DB";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { Resend } from "resend";
const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string(),
  password: z.string().min(6).max(12),
  bio: z.string().min(6).max(150),
});

const resend = new Resend(process.env.RESEND_API_KEY);
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
    const parsedBody = registerSchema.safeParse(data);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: parsedBody.error.flatten,
          success: false,
        },
        { status: 401 }
      );
    }

    const { email, username, bio } = parsedBody.data;

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

    if (exist.username !== username) {
      await prisma.user.update({
        where: {
          id: userid,
        },
        data: {
          username: username,
        },
      });
    }

    if (exist.email !== email) {
      await prisma.user.update({
        where: {
          id: userid,
        },
        data: {
          email: email,
        },
      });
    }

    if (exist.Bio !== bio) {
      await prisma.user.update({
        where: {
          id: userid,
        },
        data: {
          Bio: bio,
        },
      });
    }

    await resend.emails.send({
      from: "SpellBeats <onboarding@resend.dev>",
      to: [email],
      subject: "Account info changed",
      text: " Your updation is successfull",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profie updated",
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
