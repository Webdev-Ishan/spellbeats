"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import ReactPlayer from "react-player";
import placeholder from "../../public/logo.png";
import { Play, Pause, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

type upvote = {
  userId: string;
};

type backendresponse = {
  success: boolean;
  status: number;
  stream: {
    id: string;
    title: string;
    bigImage?: string;
    url: string;
    creator: {
      username: string;
    };
    upvotes: upvote[];
  };
};

type backendresponse2 = {
  success: boolean;
  status: number;
};

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isLiked, setIsLiked] = useState(true);
  const [pod, setPod] = useState<backendresponse["stream"] | undefined>();

  const id = useSearchParams().get("id");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/signin");
  }, [status]);

  const fetchMusicInfo = async (id: string) => {
    try {
      const result = await axios.post<backendresponse>("/api/player", {
        streamid: id,
      });

      if (result.data?.success) {
        setPod(result.data.stream);
        const currentUserId = session?.user.id;
        const hasUpvoted = result.data.stream.upvotes.some(
          (u) => u.userId === currentUserId
        );
        setIsLiked(hasUpvoted);
      }
    } catch (error) {
      const msg =
        axios.isAxiosError(error) && error.response
          ? error.response.status === 401
            ? "Please login first!"
            : error.response.status === 404
              ? "User not found!"
              : error.response.status === 400
                ? "Invalid stream ID!"
                : "Something went wrong"
          : error instanceof Error
            ? error.message
            : "Unexpected error";

      toast.error(msg);
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) fetchMusicInfo(id);
  }, [id]);

  const handleVote = async () => {
    if (!pod?.id) return;
    try {
      const endpoint = isLiked ? "/api/downvote" : "/api/upvote";
      const result = await axios.post<backendresponse2>(endpoint, {
        streamid: pod.id,
      });

      if (result.data?.success) {
        setIsLiked(!isLiked);
        fetchMusicInfo(pod.id);
      }
    } catch (error) {
      toast.error("Vote action failed.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-xl bg-white mt-10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative group">
          <Image
            src={pod?.bigImage ?? placeholder}
            alt={pod?.title ?? "Album Art"}
            width={800}
            height={400}
            className="w-full h-[300px] object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              className="w-16 h-16 bg-white text-black hover:bg-green-500 hover:text-white rounded-full shadow-lg"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-[2px]" />
              )}
            </Button>
          </div>
        </div>

        <div className="p-6 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">
            {pod?.title ?? "Unknown Title"}
          </h1>
          <p className="text-lg text-slate-500">
            {pod?.creator.username ?? "Unknown Artist"}
          </p>

          <div className="flex justify-center items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleVote}
              className={`hover:text-red-600 transition-colors ${isLiked ? "text-red-500" : "text-slate-400"}`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500" : ""}`} />
              <span className="ml-2">{isLiked ? "Liked" : "Like"}</span>
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm text-slate-600 w-10 text-right">
              {volume}
            </span>
          </div>
        </div>
      </div>

      <ReactPlayer
        src={pod?.url}
        playing={isPlaying}
        volume={volume / 100}
        controls={false}
        loop={false}
        width="0"
        height="0"
        style={{ display: "none" }}
      />

      {/* Custom styling for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
