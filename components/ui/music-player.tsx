"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import placeholder from "../../public/logo.png";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { Play, Pause } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactPlayer from "react-player";
import Image from "next/image";
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
  const [pod, setpod] = useState<backendresponse["stream"] | undefined>();

  const id = useSearchParams().get("id");

  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [session, status, router]);

  // const audioRef = useRef<HTMLAudioElement>(null);

  const fetchmusicinfo = async (id: string) => {
    try {
      const result = await axios.post<backendresponse>("/api/player", {
        streamid: id,
      });

      if (result.data && result.data.success) {
        console.log(result);
        setpod(result.data.stream);

        const currentUserId = session?.user.id;
        const hasUpvoted = result.data.stream.upvotes.some(
          (upvote: upvote) => upvote.userId === currentUserId
        );
        setIsLiked(hasUpvoted);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;

        if (status === 401) {
          toast.error("Please login first!");
        } else if (status === 404) {
          toast.error("User not found!!");
        } else if (status === 400) {
          toast.error("Ids not found!!");
        } else if (status == 500) {
          toast.error("Something went wrong");
          console.log(error);
        }
      } else {
        if (error instanceof Error) {
          toast.error(error.message);
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchmusicinfo(id);
    }
  }, []);

  // const play = () => {
  //   if (audioRef.current) {
  //     if (isPlaying) {
  //       audioRef.current.pause();
  //     } else {
  //       audioRef.current.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   } else {
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  const hanldevote = async (id: string | undefined) => {
    if (!id) return;
    try {
      let result;
      if (isLiked) {
        // If already liked, call downvote
        result = await axios.post<backendresponse2>("/api/downvote", {
          streamid: id,
        });
        if (result.data && result.data.success) {
          setIsLiked(false);
          fetchmusicinfo(id); // re-fetch to update upvotes
        }
      } else if (!isLiked) {
        // If not liked, call upvote
        result = await axios.post<backendresponse2>("/api/upvote", {
          streamid: id,
        });
        if (result.data && result.data.success) {
          setIsLiked(true);
          fetchmusicinfo(id); // re-fetch to update upvotes
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 409) {
          toast.info("Already liked!");
        } else if (status === 401) {
          toast.error("Please login first!");
        } else if (status === 404) {
          toast.error("User not found!!");
        } else if (status == 500) {
          toast.error("Something went wrong");
          console.log(error);
        }
      } else {
        if (error instanceof Error) {
          toast.error(error.message);
          console.log(error);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Music Player */}
      <section className="py-12 ">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-1 border-black shadow-2xl bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-12">
                {/* Song Info Header */}
                <div className="text-center border-1 border-black p-3 rounded-lg mb-8">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-4">
                    Now Playing
                  </Badge>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    {pod?.title ?? "Unknown Title"}
                  </h1>
                  <p className="text-xl text-green-500 mb-1">
                    {pod?.creator.username ?? "Unknown Artist"}
                  </p>
                </div>

                {/* Album Art */}
                <ReactPlayer
                  src={pod?.url}
                  loop={false}
                  playing={isPlaying}
                  volume={volume / 100}
                  width="0px"
                  height="0px"
                  controls={false}
                  style={{ display: "none" }}
                />
                <Image
                  src={pod?.bigImage ?? placeholder}
                  alt={pod?.title ?? "Album Art"}
                  width={500}
                  height={300}
                  className="rounded-2xl shadow-xl object-cover"
                />

                <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-white/90 text-slate-900 hover:bg-white rounded-full w-20 h-20 shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </Button>
                </div>

                {/* Like Button */}
                <div className="flex items-center justify-center mb-8">
                  <Button
                    variant="ghost"
                    size={"lg"}
                    onClick={() => hanldevote(pod?.id)}
                    className={`${isLiked ? "text-red-500" : "text-slate-400"} hover:text-red-500`}
                  >
                    {/* <Heart
                      className={`w-10 h-10 mr-2 ${isLiked ? "fill-green-500" : "fill-red-500"}`}
                    /> */}
                    {isLiked ? "Liked" : "Like"}
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-4">
                  {/* <Volume2 className="w-5 h-5 text-slate-600" /> */}
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <span className="text-sm text-slate-600 w-8">{volume}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
