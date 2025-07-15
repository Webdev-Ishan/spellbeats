import { prisma } from "@/lib/DB";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { streamtype } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import youtubesearchapi from "youtube-search-api";

// ✅ Regex Definitions
const youtubeRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const spotifyRegex =
  /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]{22})(?:\?.*)?$/;
const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;
const spotifyIdRegex = /^[a-zA-Z0-9]{22}$/;

// ✅ Zod schema with enum validation
const streamSchema = z.object({
  type: z.nativeEnum(streamtype),
  active: z.boolean().default(true),
  url: z.string(),
  extractedid: z.string(),
});

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

  if (!token || !token.id) {
    return NextResponse.json(
      { success: false, message: "Please login first" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsedBody = streamSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { success: false, message: "Invalid body structure" },
      { status: 400 }
    );
  }

  const { url, extractedid, type, active } = parsedBody.data;

  const isYoutube = youtubeRegex.test(url);
  const isSpotify = spotifyRegex.test(url);
  const validYTid = youtubeIdRegex.test(extractedid);
  const validSpotifyid = spotifyIdRegex.test(extractedid);

  if ((!isYoutube && !isSpotify) || (!validYTid && !validSpotifyid)) {
    return NextResponse.json(
      { success: false, message: "Invalid YouTube/Spotify URL or ID" },
      { status: 400 }
    );
  }

  try {
    const streamExist = await prisma.streams.findFirst({
      where: {
        OR: [{ url }, { extractedid }],
      },
    });

    if (streamExist) {
      return NextResponse.json(
        { success: false, message: "Stream already exists" },
        { status: 409 }
      );
    }
    const res = await youtubesearchapi.GetVideoDetails(extractedid);
    const title = res.title;
    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );

    const newStream = await prisma.streams.create({
      data: {
        type,
        active,
        url,
        extractedid,
        userId: token.id.toString(),
        title,
        smallImage:
          (thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url) ??
          "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
        bigImage:
          thumbnails[thumbnails.length - 1].url ??
          "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
      },
    });
    if (!newStream) {
      return NextResponse.json(
        { success: true, message: "Something went wrong!" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Stream added successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

    if (!token || !token.id) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    const userid = token.id.toString();

    const upvotedStreams = await prisma.upvotes.findMany({
      where: {
        userId: userid,
      },
      select: {
        streams: {
          select: {
            id: true,
            url: true,
            type: true,
            active: true,
            extractedid: true,
            title: true,
            bigImage: true,
            smallImage: true,
          },
        },
      },
    });

    if (!upvotedStreams) {
      return NextResponse.json(
        { success: false, message: "Unable to fetch streams." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, upvotedStreams },
      { status: 200 }
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
