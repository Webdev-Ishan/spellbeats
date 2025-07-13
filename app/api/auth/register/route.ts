import { prisma } from "@/lib/DB";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import bcrypt from "bcrypt";
import { Resend } from "resend";

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string(),
  password: z.string().min(6).max(12),
});
const salt_value = process.env.salt_value;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
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

  const { email, password, username } = parsedBody.data;

  try {
    const existUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existUser) {
      return NextResponse.json(
        {
          message: "User alreadfy exists",
          success: false,
        },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(Number(salt_value));
    const hahshedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hahshedPassword,
      },
    });

    if (!newUser) {
      return NextResponse.json(
        {
          message: "Somethign went wrong",
          success: false,
        },
        { status: 411 }
      );
    }

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [newUser.email],
      subject: "Welcome to Spellbeats",
      text: "Welcome to the magival world of the music and melodies your registration is successfull",
    });

    return NextResponse.json(
      {
        message: "User created successfully.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
          success: false,
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    {
      message: "Internal Server Error",
      success: false,
    },
    { status: 500 }
  );
}
