import { prisma } from "@/lib/DB";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import extractYouTubeID from "@/helpers/urlParser";

// ✅ Regex Definitions
const youtubeRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

// ✅ Zod schema with enum validation
const streamSchema = z.object({
  active: z.boolean().default(true),
  url: z.string(),
});

const updateSchema = z.object({
  active: z.boolean().default(true),
  url: z.string(),
  streamid: z.string(),
});

const deletSchema = z.object({
  streamid: z.string(),
});
const API_KEY = process.env.YOUTUBE_API_KEY;

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
      { status: 401 }
    );
  }

  const { url, active } = parsedBody.data;

  const isYoutube = youtubeRegex.test(url);

  const extractedid = extractYouTubeID(url)?.toString();

  if (!isYoutube || !url.includes(extractedid)) {
    return NextResponse.json(
      { success: false, message: "Invalid YouTube URL or ID" },
      { status: 402 }
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
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${extractedid}&key=${API_KEY}`
    );
    console.log("YouTube API response:", res);
    const data = await res.json();

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { success: true, message: "Invalid or wrong ID" },
        { status: 403 }
      );
    }

    const video = data.items[0];
    const snippet = video.snippet;

    const thumbnails = snippet.thumbnails;
    const thumbnailarray = Object.values(thumbnails) as Array<{
      url: string;
      width: number;
      height: number;
    }>;

    const sortedThumbnails = thumbnailarray.sort((a, b) => a.width - b.width);

    // Smallest
    const smallest = sortedThumbnails[0];

    // Largest
    const largest = sortedThumbnails[sortedThumbnails.length - 1];

    const newStream = await prisma.streams.create({
      data: {
        active,
        url,
        extractedid,
        userId: token.id.toString(),
        title: snippet.title,
        smallImage: smallest.url,
        bigImage: largest.url,
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

    const streams = await prisma.streams.findMany({
      where: {
        userId: userid,
      },
      include: {
        upvotes: {
          select: {
            userId: true,
          },
        },
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!streams) {
      return NextResponse.json(
        { success: false, message: "Unable to fetch streams." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, streams }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: "Something went wrong." },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

  if (!token || !token.id) {
    return NextResponse.json(
      { success: false, message: "Please login first" },
      { status: 400 }
    );
  }
  const userid = token.id.toString();
  const data = await req.json();

  const parsedBody = deletSchema.safeParse(data);

  if (!parsedBody.success) {
    return NextResponse.json(
      { success: false, message: "invalid Body Structure" },
      { status: 401 }
    );
  }

  const { streamid } = parsedBody.data;

  try {
    const existUser = await prisma.user.findUnique({
      where: {
        id: userid,
      },
    });

    if (!existUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const existStream = await prisma.streams.findUnique({
      where: {
        id: streamid,
      },
    });

    if (!existStream) {
      return NextResponse.json(
        { success: false, message: "Stream not found." },
        { status: 404 }
      );
    }

    if (existStream.userId !== userid) {
      return NextResponse.json(
        { success: false, message: "You can not delete this stream." },
        { status: 409 }
      );
    }

    const relatedVotes = await prisma.upvotes.findMany({
      where: {
        streamsId: streamid,
      },
    });

    if (relatedVotes) {
      await prisma.upvotes.deleteMany({
        where: {
          streamsId: streamid,
        },
      });
    }

    await prisma.streams.deleteMany({
      where: {
        id: streamid,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Stream deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  }
}

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

  if (!token || !token.id) {
    return NextResponse.json(
      { success: false, message: "Please login first" },
      { status: 400 }
    );
  }
  const userid = token.id.toString();
  const data = await req.json();

  const parsedBody = updateSchema.safeParse(data);

  if (!parsedBody.success) {
    return NextResponse.json(
      { success: false, message: "invalid Body Structure" },
      { status: 401 }
    );
  }

  const { url, active, streamid } = parsedBody.data;

  const isYoutube = youtubeRegex.test(url);
  const extractedid = extractYouTubeID(url);

  if (!isYoutube || !url.includes(extractedid)) {
    return NextResponse.json(
      { success: false, message: "Invalid YouTube URL or ID" },
      { status: 402 }
    );
  }

  try {
    const existUser = await prisma.user.findUnique({
      where: {
        id: userid,
      },
    });

    if (!existUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const existStream = await prisma.streams.findUnique({
      where: {
        id: streamid,
      },
    });

    if (!existStream) {
      return NextResponse.json(
        { success: false, message: "Stream not found." },
        { status: 404 }
      );
    }

    if (existStream.userId !== userid) {
      return NextResponse.json(
        { success: false, message: "You can not update this stream." },
        { status: 409 }
      );
    }

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${extractedid}&key=${API_KEY}`
    );
    console.log("YouTube API response:", res);
    const data = await res.json();

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { success: true, message: "Invalid or wrong ID" },
        { status: 403 }
      );
    }

    const video = data.items[0];
    const snippet = video.snippet;

    const thumbnails = snippet.thumbnails;
    const thumbnailarray = Object.values(thumbnails) as Array<{
      url: string;
      width: number;
      height: number;
    }>;

    const sortedThumbnails = thumbnailarray.sort((a, b) => a.width - b.width);

    // Smallest
    const smallest = sortedThumbnails[0];

    // Largest
    const largest = sortedThumbnails[sortedThumbnails.length - 1];

    if (existStream.url !== url && existStream.extractedid !== extractedid) {
      await prisma.streams.update({
        where: {
          id: streamid,
        },
        data: {
          url: url,
          active: active,
          smallImage: smallest.url,
          bigImage: largest.url,
          title: snippet.title,
          extractedid: extractedid,
        },
      });
    }

    return NextResponse.json(
      { success: true, message: "Stream updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  }
}
